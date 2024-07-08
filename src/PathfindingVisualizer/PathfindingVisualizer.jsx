import React, { Component } from 'react';
import Node from './Node/Node';
import Navbar from './Navbar';

import CloseWindowIcon from '../assets/CloseWindow.png';
import './PathfindingVisualizer.css';

import {dijkstra, dijkstraPath} from '../algorithms/dijkstra';
import {depthFirstSearch, dfsPath} from '../algorithms/dfs';

// number of rows and columns in the grid
const NUM_COLS = Math.floor((window.innerWidth*0.75)/25);
const NUM_ROWS = Math.floor(((window.innerHeight-119)*0.75)/25);
// initial node position
const START_NODE_ROW = Math.ceil(NUM_ROWS/2)-1;
const START_NODE_COL = Math.floor(NUM_COLS*0.25);
// goal node position
const GOAL_NODE_ROW = Math.ceil(NUM_ROWS/2)-1;
const GOAL_NODE_COL = Math.floor(NUM_COLS*0.75);

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            showHelpWindow: false,
            isAnimating: false,
            algoType: "Dijkstra's",
        };

        this.visualize = this.visualize.bind(this);
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
        this.setState({showHelpWindow: false, isAnimating: false});
    }

    // Handles the drawing of walls
    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    // Handles the drawing of walls
    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    // Handles the drawing of walls
    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }

    // Calls all necessary functions to visualize Dijkstra's
    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[GOAL_NODE_ROW][GOAL_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInPathOrder = dijkstraPath(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInPathOrder);
    }

    // Animates how Dijkstra searches 
    animateDijkstra(visitedNodesInOrder, nodesInPathOrder) {
        this.setState({isAnimating: true});
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInPathOrder);
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

    // Calls all necessary functions to visualize DFS
    visualizeDFS() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[GOAL_NODE_ROW][GOAL_NODE_COL];
        const visitedNodesInOrder = depthFirstSearch(grid, startNode, finishNode);
        const nodesInPathOrder = dfsPath(finishNode);
        this.animateDFS(visitedNodesInOrder, nodesInPathOrder);
    }

    // Animates how DFS searches
    animateDFS(visitedNodesInOrder, nodesInPathOrder) {
        this.setState({isAnimating: true});
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInPathOrder);
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

    // Animates the shortest path of any algorithm
    animateShortestPath(nodesInPathOrder) {
        for (let i = 0; i < nodesInPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-shortest-path';
            }, 50 * i);
        }
        setTimeout(() => {
            this.setState({isAnimating: false});
        }, 50 * nodesInPathOrder.length);
        
    }

    // Handler for changing which algorithm is selected from the Navbar
    handleAlgoChange = (selectedType) => {
        this.setState({algoType: selectedType});
    }

    // Ensures the correct algorithm is visualized
    visualize() {
        if (this.state.algoType == "Dijkstra's") {
            this.visualizeDijkstra();
        } else if (this.state.algoType == "A* Search") {
            console.log("Not implemented yet");
        } else if (this.state.algoType == "Greedy-BFS") {
            console.log("Not implemented yet");
        } else if (this.state.algoType == "BFS") {
            console.log("Not implemented yet");
        } else if (this.state.algoType == "DFS") {
            this.visualizeDFS();
        }
    }

    // Handler for toggling the help window
    toggleHelpWindow = (currentValue) => {
        const newValue = !currentValue;
        this.setState({showHelpWindow: newValue});
    }

    // Resets the grid to its initial state
    resetGrid = (grid) => {
        if (!this.state.isAnimating) {
            for (let row = 0; row < grid.length; row++) {
                for (let col = 0; col < grid[0].length; col++) {
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
                    grid[row][col].isVisited = false;
                }
            }
        }   
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
                    resetGrid={() => this.resetGrid(grid)}
                    showHelpWindow={this.state.showHelpWindow}
                    toggleHelpWindow={this.toggleHelpWindow}
                />
            </div>
            <div className="grid">
            {grid.map((row, rowIdx) => {
                return (
                <div key={rowIdx} className='row'>
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

// Initializes the grid
const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < NUM_ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < NUM_COLS; col++) {
            const isStart = row === START_NODE_ROW && col === START_NODE_COL;
            const isFinish = row === GOAL_NODE_ROW && col === GOAL_NODE_COL;
            currentRow.push(createNode(col, row, isStart, isFinish));
        }
        grid.push(currentRow);
    }
    return grid;
};



// Creates a new node object
const createNode = (col, row, isStart, isFinish) => {
    return {
        col,
        row,
        isStart,
        isFinish,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

// Creates a new grid that contains the walls
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