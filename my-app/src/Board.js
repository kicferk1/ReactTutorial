import React from 'react';
import './index.css';

function Square(props) {
  return (
    <button className="square"
      onClick={props.onClick}
      style={{ 'backgroundColor': props.highlight ? 'yellow' : 'white' }}
    >
      {props.value}
    </button>
  );
}

export class Board extends React.Component {

  renderSquare(squareKey, highlight) {
    return <Square
      key={squareKey}
      value={this.props.squares[squareKey]}
      onClick={() => this.props.onClick(squareKey)}
      highlight={highlight}
    />;
  }

  renderRows(rowKeys){
    return rowKeys.map(rowKey => {
      return (
        <div key={rowKey} className="board-row">
          {this.renderCellsInRow(rowKey)}
        </div>
      )
    })
  }

  renderCellsInRow(rowKey){
    const cellKeys = this.getCellKeys(rowKey);
    return cellKeys.map(cellKey => {
      let highlight = this.props.highlighSquares && this.props.highlighSquares
      .reduce((prev, current) => prev || current === cellKey, false);
      return this.renderSquare(cellKey, highlight);
    })
  }

  getCellKeys(rowKey){
    return [0,1,2].map(elem => elem+rowKey * 3)
  }

  getRows(){
    return [0, 1, 2];
  }

  render() {
    const rows = this.renderRows(this.getRows());
    return (
      <div>
        {rows}
      </div>
    );
  }
}