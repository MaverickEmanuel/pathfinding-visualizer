import React, { Component } from 'react';
import Node from './Node/Node';
import Navbar from './Navbar';

import CloseWindowIcon from '../assets/CloseWindow.png';
import './PathfindingVisualizer.css';

import {dijkstra, dijkstraPath} from '../algorithms/dijkstra';
import {aStarSearch, aStarPath} from '../algorithms/astar';
import {greedyBFSearch, greedyBFPath} from '../algorithms/greedy';
import {depthFirstSearch, dfsPath} from '../algorithms/dfs';
import {breadthFirstSearch, bfsPath} from '../algorithms/bfs';


// number of rows and columns in the grid
const NUM_COLS = Math.floor((window.innerWidth*0.75)/25);
const NUM_ROWS = Math.floor(((window.innerHeight-119)*0.75)/25);

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            startNodeRow: 0,
            startNodeCol: 0,
            goalNodeRow: 0,
            goalNodeCol: 0,
            mouseIsPressed: false,
            showHelpWindow: false,
            editGrid: false,
            moveStartNode: false,
            moveGoalNode: false,
            isAnimating: false,
            algoType: "Dijkstra's",
        };

        this.visualize = this.visualize.bind(this);
    }

    componentDidMount() {
        // initial node position
        const startNodeRow = Math.ceil(NUM_ROWS/2)-1;
        const startNodeCol = Math.floor(NUM_COLS*0.25);
        // goal node position
        const goalNodeRow = Math.ceil(NUM_ROWS/2)-1;
        const goalNodeCol = Math.floor(NUM_COLS*0.75);
        this.setState({startNodeRow: startNodeRow, startNodeCol: startNodeCol, goalNodeRow: goalNodeRow, goalNodeCol: goalNodeCol});

        const grid = getInitialGrid();
        this.setState({grid});
        this.setState({showHelpWindow: false, editGrid: false, moveStartNode: false, moveGoalNode: false, isAnimating: false});
    }

    // Handles mouse clicks
    handleMouseDown(row, col) {
        if (this.state.isAnimating) return;
        if (this.state.moveStartNode) {
            // Handles moving the start node
            this.setState({startNodeRow: row, startNodeCol: col});
            document.getElementById(`node-${row}-${col}`).className = 'node node-start';
        } else if (this.state.moveGoalNode) {
            // Handles moving the goal node
            this.setState({goalNodeRow: row, goalNodeCol: col});
            document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
        } else {
            // Handles drawing walls
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({grid: newGrid, mouseIsPressed: true});
        }
    }

    // Handles mouse clicks
    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed || this.state.isAnimating) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    // Handles mouse clicks
    handleMouseUp() {
        if (this.state.isAnimating) return;

        // Handles moving the start and goal nodes
        if (this.state.moveStartNode) {
            this.setState({moveStartNode: false});
        } else if (this.state.moveGoalNode) {
            this.setState({moveGoalNode: false});
        }
        this.setState({mouseIsPressed: false});
    }

    // Calls all necessary functions to visualize Dijkstra's
    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
        const finishNode = grid[this.state.goalNodeRow][this.state.goalNodeCol];
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

    // Calls all necessary functions to visualize A* search
    visualizeAStar() {
        const {grid} = this.state;
        const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
        const finishNode = grid[this.state.goalNodeRow][this.state.goalNodeCol];
        const visitedNodesInOrder = aStarSearch(grid, startNode, finishNode);
        const nodesInPathOrder = aStarPath(finishNode);
        this.animateAStar(visitedNodesInOrder, nodesInPathOrder);
    }
    // Animates how A* searches
    animateAStar(visitedNodesInOrder, nodesInPathOrder) {
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

    // Calls all necessary functions to visualize Greedy-BFS
    visualizeGBFS() {
        const {grid} = this.state;
        const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
        const finishNode = grid[this.state.goalNodeRow][this.state.goalNodeCol];
        const visitedNodesInOrder = greedyBFSearch(grid, startNode, finishNode);
        const nodesInPathOrder = greedyBFPath(finishNode);
        this.animateGBFS(visitedNodesInOrder, nodesInPathOrder);
    }
    // Animates how Greedy-BFS searches
    animateGBFS(visitedNodesInOrder, nodesInPathOrder) {
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

    // Calls all necessary functions to visualize BFS
    visualizeBFS() {
        const {grid} = this.state;
        const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
        const finishNode = grid[this.state.goalNodeRow][this.state.goalNodeCol];
        const visitedNodesInOrder = breadthFirstSearch(grid, startNode, finishNode);
        const nodesInPathOrder = bfsPath(finishNode);
        this.animateBFS(visitedNodesInOrder, nodesInPathOrder);
    }
    // Animates how BFS searches
    animateBFS(visitedNodesInOrder, nodesInPathOrder) {
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
        const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
        const finishNode = grid[this.state.goalNodeRow][this.state.goalNodeCol];
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
            this.visualizeAStar();
        } else if (this.state.algoType == "Greedy-BFS") {
            this.visualizeGBFS();
        } else if (this.state.algoType == "BFS") {
            this.visualizeBFS();
        } else if (this.state.algoType == "DFS") {
            this.visualizeDFS();
        }
    }

    // Handler for moving start node and goal node in edit mode
    handleMoveNode = (nodeType) => {
        if (nodeType == 'start') {
            document.getElementById(`node-${this.state.startNodeRow}-${this.state.startNodeCol}`).className = 'node node-unvisited';
            this.setState({moveStartNode: true});
        } else if (nodeType == 'goal') {
            document.getElementById(`node-${this.state.goalNodeRow}-${this.state.goalNodeCol}`).className = 'node node-unvisited';
            this.setState({moveGoalNode: true});
        }
    }

    // Handler for toggling the help window
    toggleHelpWindow = (currentValue) => {
        this.setState({showHelpWindow: !currentValue});
    }

    // Handler for toggling edit grid mode
    toggleEditGrid = (grid) => {
        if (this.state.editGrid) {
            this.setState({moveStartNode: false, moveGoalNode: false});
            this.resetGrid(grid);
        }
        this.setState({editGrid: !this.state.editGrid});
    }
    
    // Resets the grid to its initial state
    resetGrid = (grid) => {
        if (!this.state.isAnimating) {
            for (let row = 0; row < grid.length; row++) {
                for (let col = 0; col < grid[0].length; col++) {
                    if (row === this.state.startNodeRow && col === this.state.startNodeCol) {
                        document.getElementById(`node-${row}-${col}`).className =
                        'node node-start';
                    } else if (row === this.state.goalNodeRow && col === this.state.goalNodeCol) {
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
            <div className='app-wrapper'>
                <div className='navbar'>
                    <Navbar 
                        grid={grid}
                        visualize={this.visualize}
                        handleSelectAlgo={this.handleAlgoChange}
                        resetGrid={() => this.resetGrid(grid)}
                        showHelpWindow={this.state.showHelpWindow}
                        toggleHelpWindow={this.toggleHelpWindow}
                        editGrid={this.state.editGrid}
                        toggleEditGrid={this.toggleEditGrid}
                        handleMoveNode={this.handleMoveNode}
                    />
                </div>
                <div className='instructions'>
                    {this.state.moveStartNode && (
                        <p>Click to set the location of the start node</p>
                    )}
                    {this.state.moveGoalNode && (
                        <p>Click to set the location of the goal node</p>
                    )}
                </div>
                <div className='grid'>
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
            </div>
        );
    }
}

// Initializes the grid
const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < NUM_ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < NUM_COLS; col++) {
            const isStart = row === Math.ceil(NUM_ROWS/2)-1 && col === Math.floor(NUM_COLS*0.25);
            const isFinish = row === Math.ceil(NUM_ROWS/2)-1 && col === Math.floor(NUM_COLS*0.75);
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