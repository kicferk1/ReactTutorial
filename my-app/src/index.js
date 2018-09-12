import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" 
    onClick={props.onClick}
    style={{'backgroundColor': props.highlight ? 'yellow' : 'white'}}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i, highlight) {
    return <Square 
    key={i}
    value = {this.props.squares[i]} 
    onClick = {() => this.props.onClick(i)}
    highlight = {highlight}
    />;
  }

  render() {
    const rows = [0,1,2].map(rowNumber => {
      const squares = [0,1,2].map(colNumber => {
        let highlight = false;
        if(this.props.highlighSquares){
          this.props.highlighSquares.forEach(element => {
            highlight = highlight || element === rowNumber * 3 + colNumber
          });
        }
        return this.renderSquare(rowNumber * 3 + colNumber, highlight);
      })
      return(
        <div key={rowNumber} className="board-row">
          {squares}
        </div>
      )
    })

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null), 
        move: {row: null, col: null}
      }],
      stepNumber: 0,
      xIsNext: true,
      movesTopDown: true
    };
  }

  toggleMovesTopDown(){
    this.setState({...this.state, movesTopDown: !this.state.movesTopDown})
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        move: {
          row: (i-i%3)/3, 
          col: i%3
        }
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerSquares = calculateWinner(current.squares);
    const winner = current.squares[winnerSquares && winnerSquares[0]];

    let moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ': ' + 
        (move %2!==0 ? 'X' : 'O') + ' plays' + 
        '(' + step.move.col + ',' + step.move.row + ')':
        'Go to game start';

      if(move === this.state.stepNumber){
        return (
          <div key={move} style={{display: 'inlile-block'}}>
            <label>Move # {move} </label>
            <button 
            onClick={() => this.jumpTo(move)}
            style={{'fontWeight': 'bold'}}
            >{desc}</button>          
          </div>
        );
      }
      return (
        <div key={move} style={{display: 'inlile-block'}}>
          <label>Move # {move} </label>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>          
        </div>
      );
    });

    if(!this.state.movesTopDown){
      moves = moves.slice().reverse();
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if(this.state.stepNumber === 9){
      status = 'It is a draw';
    }
    else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
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
          <button onClick={() => this.toggleMovesTopDown()}>Change move order</button>
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
      return [a,b,c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
