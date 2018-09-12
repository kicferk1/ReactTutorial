import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Board } from './Board'

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: { row: null, col: null }
      }],
      stepNumber: 0,
      xIsNext: true,
      movesTopDown: true
    };
  }

  toggleMovesTopDown() {
    this.setState({ movesTopDown: !this.state.movesTopDown })
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  getCoordinates(squareKey) {
    return {
      row: (squareKey - squareKey % 3) / 3,
      col: squareKey % 3
    }
  }

  handleClick(squareKey) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[squareKey]) { return; }

    squares[squareKey] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        move: this.getCoordinates(squareKey)
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  displayMoves(history) {
    return history.map((step, moveNumber) => {
      const currentPlayer = moveNumber % 2 !== 0 ? 'X' : 'O';
      const moveCoordinates = '(' + step.move.col + ',' + step.move.row + ')';
      const moveDescription = moveNumber ?
        'Go to move #' + moveNumber + ': ' + currentPlayer + ' plays ' + moveCoordinates :
        'Go to game start';
      return this.displayMove(moveNumber, moveDescription);
    });
  }

  displayMove(moveNumber, description){
    return (
      <div key={moveNumber} style={{ display: 'inlile-block' }}>
        <label>Move # {moveNumber} </label>
        <button
          onClick={() => this.jumpTo(moveNumber)}
          style={{ 'fontWeight': moveNumber === this.state.stepNumber ? 'bold' : '' }}
        >{description}</button>
      </div>
    );
  }

  getStatus(winner){
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (this.state.stepNumber === 9) {
      status = 'It is a draw';
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return status;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerSquares = calculateWinner(current.squares);
    const winner = current.squares[winnerSquares && winnerSquares[0]];
    const status = this.getStatus(winner);

    let moves = this.displayMoves(history)
    if (!this.state.movesTopDown) {
      moves = moves.slice().reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlighSquares={winnerSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{moves}</div>
          <button onClick={this.toggleMovesTopDown}>Change move order</button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
