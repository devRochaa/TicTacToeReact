import { useState } from "react";

import "./App.css";

export function Square({
  value,
  onSquareClick,
  hasStyle
}: {
  value: any;
  onSquareClick: any;
  hasStyle: boolean;
}) {
  return (
    <>
      <button className={hasStyle ? "squareWinner" : "square"} onClick={onSquareClick}>
        {value}
      </button>
    </>
  );
}

export default function Game() {
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: any) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: any) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    squares = squares;
    let description;
    if (move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = `Go to Game Start`;
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export function Board({
  xIsNext,
  squares,
  onPlay,
}: {
  xIsNext: any;
  squares: any;
  onPlay: any;
}) {
  // const [squares, setSquares]: [s:any, y:any] = useState(Array(9).fill(null));
  // const [xIsNext, setxIsNext]: [s:any, y:any] = useState(true);

  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) return; //se for diferente de null ele ira retornar sem mudar nada

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext === true ? "X" : "O";
    //-setxIsNext(!xIsNext);
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  let winnersBlock: any = [];
  status = winner ? `Vencedor: ${winner.winner}` : `Jogador: ${xIsNext ? "X" : "O"}`;
  if (winner !== null && winner ) {
    status = winner ? `Vencedor: ${winner.winner}` : `Jogador: ${xIsNext ? "X" : "O"}`;
    winnersBlock = winner.winIndex;
  }
  if (winner == false) {
    status = `Velha`;
  }

  //board
  const size: number = 3;
  const rows = [];
  for (let i = 0; i < size; i++) {
    const cells = [];
    for (let g = 0; g < size; g++) {
      const index = i * size + g;
      const hasStyle = winnersBlock.includes(index);

      cells.push(
        <td key={g}>
          <Square
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            hasStyle ={hasStyle}
          />
        </td>
      );
    }
    rows.push(<tr key={i}>{cells}</tr>);
  }

  return (
    <>
      <div className="status">{status}</div>
      <table>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
}



function calculateWinner(squares: any) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let allFilled = 0;
  for (let i = 0; i < lines.length; i++) {
    if (squares[i] != null) allFilled++; //verifica se esta preenchido
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winIndex: [a, b, c],
      };
    }
  }
  if (allFilled == 8) {
    return false;
  }
  return null;
}
