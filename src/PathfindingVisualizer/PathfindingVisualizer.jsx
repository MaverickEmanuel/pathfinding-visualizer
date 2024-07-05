import React, {Component} from 'react';
import Node from './Node/Node';
import Navbar from './Navbar';

import CloseWindowIcon from '../assets/CloseWindow.png';
import './PathfindingVisualizer.css';

import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

// initial node position
const START_NODE_ROW = 8;
const START_NODE_COL = 10;
// goal node position
const FINISH_NODE_ROW = 8;
const FINISH_NODE_COL = 30;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            showHelpWindow: false,
            algoType: "Dijkstra's",
        };

        this.visualize = this.visualize.bind(this);
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
        this.setState({showHelpWindow: false});
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
        }, 50 * i);
        }
    }

    handleAlgoChange = (selectedType) => {
        this.setState({algoType: selectedType});
    }

    visualize() {
        console.log(this.state.algoType);
        if (this.state.algoType == "Dijkstra's") {
            this.visualizeDijkstra();
        }
    }

    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    toggleHelpWindow = (currentValue) => {
        const newValue = !currentValue;
        this.setState({showHelpWindow: newValue});
    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
        <>
            <div className='header'>
                <Navbar 
                    grid={grid}
                    visualize={this.visualize}
                    handleSelectAlgo={this.handleAlgoChange}
                    resetGrid={() => resetGrid(grid)}
                    showHelpWindow={this.state.showHelpWindow}
                    toggleHelpWindow={this.toggleHelpWindow}
                />
            </div>
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
                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                        onMouseEnter={(row, col) =>
                            this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}></Node>
                    );
                    })}
                </div>
                );
            })}
            </div>
            {this.state.showHelpWindow && (
                <div className='help-window'>
                    <div className='help-window-header'>
                        <h1>How to use</h1>
                        <img src={CloseWindowIcon} alt='Close Window' width='35' onClick={() => this.toggleHelpWindow(true)}/>
                    </div>
                    <ul>
                        <li>Select a pathfinding algorithm</li>
                        <li>Left click the grid to draw walls</li>
                        <li>Click the visualize button to begin pathfinding</li>
                        <li>Click the reset grid button to clear the grid</li>
                    </ul> 
                </div>
            )}
        </>
        );
    }
}

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 18; row++) {
        const currentRow = [];
        for (let col = 0; col < 40; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const resetGrid = (grid) => {
    for (let row = 0; row < 18; row++) {
        for (let col = 0; col < 40; col++) {
            if (grid[row][col].isVisited = true) {
                if (grid[row][col].isStart) {
                    document.getElementById(`node-${row}-${col}`).className =
                    'node node-start';
                } else if (grid[row][col].isFinish) {
                    document.getElementById(`node-${row}-${col}`).className =
                    'node node-finish';
                } else {
                    grid[row][col].isWall = false;
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
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};