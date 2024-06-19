import React, { useState, useRef } from 'react'
import Node from './Node/Node';

import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

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

const resetGrid = (grid) => {
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 50; col++) {
            if (grid[row][col].isVisited = true) {
                if (grid[row][col].isStart) {
                    document.getElementById(`node-${row}-${col}`).className =
                    'node node-start';
                } else if (grid[row][col].isFinish) {
                    document.getElementById(`node-${row}-${col}`).className =
                    'node node-finish';
                } else {
                    document.getElementById(`node-${row}-${col}`).className =
                    'node node-unvisited';
                }
            }
            grid[row][col].isVisited = false;
        }
    }
}

const createNode = (col, row) => {
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
}

const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!(node.isStart || node.isFinish)) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
        }
      }, 10 * i);
    }
}

const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
}

const PathfindingVisualizer = () => {
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const grid = getInitialGrid();

    const visualizeDijkstra = () => {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    return (
        <>
        <div className='header'>
            <button onClick={() => visualizeDijkstra()}> 
                Visualize Dijkstra's Algorithm
            </button>
            <button onClick={() => resetGrid(grid)}> 
                Reset Grid
            </button>
        </div>
        <div className='grid'>
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
        </>
    )
}

export default PathfindingVisualizer