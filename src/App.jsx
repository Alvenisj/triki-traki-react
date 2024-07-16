import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

import { Square } from "./components/Square.jsx";
import { TURNS } from "./constantes.js";
import { checkWinnerFrom, checkAndGame } from "./logic/board.js";
import { WinnerModal } from "./components/WinnerModal.jsx";

import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));

  const [turn, setTurn] = useState(TURNS.X);

  const [winner, setWinner] = useState(null); // null - no hay ganador - y el false - hay un empate -
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    const turnFromStorage = window.localStorage.getItem("turn");

    if (boardFromStorage) {
      setBoard(JSON.parse(boardFromStorage));
    }

    if (turnFromStorage) {
      setTurn(turnFromStorage);
    }

    setIsInitialized(true); // Esto asegura que los datos se inicializan antes de renderizar el componente
  }, []);

  useEffect(() => {
    if (isInitialized) {
      // Solo guarda en localStorage si la inicialización está completa
      window.localStorage.setItem("board", JSON.stringify(board));
      window.localStorage.setItem("turn", turn);
    }
  }, [board, turn, isInitialized]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    // CAMBIAR EL TURNO
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    // GUARDAR PARTIDA
    // window.localStorage.setItem("board", JSON.stringify(newBoard));
    // window.localStorage.setItem("turn", newTurn);
    // REVISAR SI HAY UN GANADOR
    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkAndGame(newBoard)) {
      setWinner(false); // empate
    }
  };

  return (
    <main className="board">
      <h1>Triki Traki</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <div className="highlight">Realizado por: Alvenis Becerra</div>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
