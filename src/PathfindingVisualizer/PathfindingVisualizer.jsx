import React, { useState } from 'react'
import Node from './Node/Node';

// initial node position
const START_NODE_ROW = 10;
const START_NODE_COL = 15;
// goal node position
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
          currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
      }
      return grid;
}

const createNode = (col, row) => {
    console.log('Node created at:', col, row);
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

const PathfindingVisualizer = () => {
    const [grid, setGrid] = useState(getInitialGrid());
    const [mouseIsPressed, setMouseIsPressed] = useState(false);

    return (
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
    )
}

export default PathfindingVisualizer