import React, { Component } from 'react';
import Node from './Node/Node';
import Navbar from './Navbar';

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
            helpPageNum: 1,
            editGrid: false,
            moveStartNode: false,
            moveGoalNode: false,
            isAnimating: false,
            searchSpeed: 10,
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
        this.setState({showHelpWindow: true, helpPageNum: 1, editGrid: false, moveStartNode: false, moveGoalNode: false, isAnimating: false, searchSpeed: 10});
    }

    // Handles mouse clicks
    handleMouseDown(row, col) {
        // Cannot draw walls while animating
        if (this.state.isAnimating) return;

        // Handles moving the start node
        if (this.state.moveStartNode) {
            this.setState({startNodeRow: row, startNodeCol: col});
            this.state.grid[row][col].isStart = true;
            document.getElementById(`node-${row}-${col}`).className = 'node node-start';

        // Handles moving the goal node
        } else if (this.state.moveGoalNode) {
            this.setState({goalNodeRow: row, goalNodeCol: col});
            this.state.grid[row][col].isFinish = true;
            document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
        
        // Handles drawing walls
        } else {
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({grid: newGrid, mouseIsPressed: true});
        }
    }

    // Handles mouse clicks
    handleMouseEnter(row, col) {
        // Cannot draw walls while animating
        if (!this.state.mouseIsPressed || this.state.isAnimating) return;

        // Handles drawing walls
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    // Handles mouse clicks
    handleMouseUp() {
        // Cannot draw walls while animating
        if (this.state.isAnimating) return;

        // Handles moving the start node
        if (this.state.moveStartNode) {
            this.setState({moveStartNode: false});
        // Handles moving the goal node
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
                }, this.state.searchSpeed * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (node.isStart) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-start-visited';
                } else if (node.isFinish) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-finish-visited';
                } else {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
                }
            }, this.state.searchSpeed * i);
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
                }, this.state.searchSpeed * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (node.isStart) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-start-visited';
                } else if (node.isFinish) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-finish-visited';
                } else {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
                }
            }, this.state.searchSpeed * i);
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
                }, this.state.searchSpeed * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (node.isStart) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-start-visited';
                } else if (node.isFinish) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-finish-visited';
                } else {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
                }
            }, this.state.searchSpeed * i);
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
                }, this.state.searchSpeed * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (node.isStart) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-start-visited';
                } else if (node.isFinish) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-finish-visited';
                } else {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
                }
            }, this.state.searchSpeed * i);
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
                }, this.state.searchSpeed * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (node.isStart) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-start-visited';
                } else if (node.isFinish) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-finish-visited';
                } else {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
                }
            }, this.state.searchSpeed * i);
        }
    }

    // Animates the shortest path of any algorithm
    animateShortestPath(nodesInPathOrder) {
        for (let i = 0; i < nodesInPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-shortest-path';
            }, this.state.searchSpeed * 5 * i);
        }
        // Sets isAnimating to false when animation is complete
        setTimeout(() => {
            this.setState({isAnimating: false});
        }, this.state.searchSpeed * 5 * nodesInPathOrder.length);
        
    }

    // Handler for changing which algorithm is selected from the Navbar
    handleAlgoChange = (selectedType) => {
        if (this.state.isAnimating === false) {
            this.resetGrid(false);
        }
        this.setState({algoType: selectedType});
    }

    // Ensures the correct algorithm is visualized
    visualize() {
        if (!this.state.isAnimating) {
            this.resetGrid(false);
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
    }

    // Handler for moving start node and goal node in edit mode
    handleMoveNode = (nodeType) => {
        if (nodeType == 'start') {
            this.state.grid[this.state.startNodeRow][this.state.startNodeCol].isStart = false;
            document.getElementById(`node-${this.state.startNodeRow}-${this.state.startNodeCol}`).className = 'node node-unvisited';
            this.setState({moveStartNode: true});
        } else if (nodeType == 'goal') {
            this.state.grid[this.state.goalNodeRow][this.state.goalNodeCol].isFinish = false;
            document.getElementById(`node-${this.state.goalNodeRow}-${this.state.goalNodeCol}`).className = 'node node-unvisited';
            this.setState({moveGoalNode: true});
        }
    }

    // Handler for toggling the help window
    toggleHelpWindow = (currentValue) => {
        if (currentValue === false) {
            this.setState({helpPageNum: 1});
        }
        this.setState({showHelpWindow: !currentValue});
    }

    setHelpPageNum = (newPageNum) => {
        this.setState({helpPageNum: newPageNum});
    }

    // Handler for toggling edit grid mode
    toggleEditGrid = (grid) => {
        if (!this.state.isAnimating) {
            if (this.state.editGrid) {
                this.setState({moveStartNode: false, moveGoalNode: false});
            }
            this.resetGrid(false);
            this.setState({editGrid: !this.state.editGrid});
        }
    }

    // Handler for setting algorithm search speed
    setSearchSpeed = (speed) => {
        this.setState({searchSpeed: speed});
    }
    
    // Resets the grid to its initial state
    resetGrid = (resetWalls) => {
        if (!this.state.isAnimating) {
            const grid = [];
            try {
                for (let row = 0; row < NUM_ROWS; row++) {
                    const currentRow = [];
                    for (let col = 0; col < NUM_COLS; col++) {
                        const isStart = row === this.state.startNodeRow && col === this.state.startNodeCol;
                        const isFinish = row === this.state.goalNodeRow && col === this.state.goalNodeCol;
                        
                        // Resets the board but keeps the walls in place
                        if (resetWalls) {
                            currentRow.push(createNode(col, row, isStart, isFinish, false));
                            // Resets the start node
                            if (isStart) {
                                document.getElementById(`node-${row}-${col}`).className = 'node node-start';
                            // Resets the goal node
                            } else if (isFinish) {
                                document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
                            // Sets each node to unvisited
                            } else {
                                document.getElementById(`node-${row}-${col}`).className = 'node node-unvisited';
                            }

                        // Completely resets the board, removing all walls
                        } else {
                            if (this.state.grid[row][col].isWall) {
                                currentRow.push(createNode(col, row, isStart, isFinish, true));
                            } else {
                                currentRow.push(createNode(col, row, isStart, isFinish, false));
                                // Resets the start node
                                if (isStart) {
                                    document.getElementById(`node-${row}-${col}`).className = 'node node-start';
                                // Resets the goal node
                                } else if (isFinish) {
                                    document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
                                // Sets each node to unvisited
                                } else {
                                    document.getElementById(`node-${row}-${col}`).className = 'node node-unvisited';
                                }
                            }
                        }
                       
                    }
                    grid.push(currentRow);
                }
            } finally {
                // Sets the grid to the clear grid
                this.setState({grid});
            }
            
        }   
    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        // Handles the display of text while editing the grid
        let editTip;
        if (this.state.editGrid) {
            if (!this.state.moveStartNode && !this.state.moveGoalNode) {
                editTip = <p>Select a node to move</p>;
            } else if (this.state.moveStartNode) {
                editTip = <p>Click to set the location of the start node</p>;
            } else if (this.state.moveGoalNode) {
                editTip = <p>Click to set the location of the goal node</p>;
            }
        }

        // Handles displaying each page of the help window
        let helpWindow;
        if (this.state.showHelpWindow) {
            switch (this.state.helpPageNum) {
                case 1:
                    helpWindow = <div className='help-window'>
                                    <div id='pageCounter'>1/3</div>
                                    <h1>Welcome to Pathfinding Visualizer!</h1>
                                    <h2>This short tutorial will walk you through all of the features of this application.</h2>
                                    <p>If you want to dive right in, feel free to press the "Skip Tutorial" button below. Otherwise, press "Next"!</p>
                                    <img src={require('../assets/pathIcon.png')} alt='Path from point A to point B' height='30%'/>
                                    <button id='skipButton' onClick={() => this.toggleHelpWindow(true)}>Skip Tutorial</button>
                                    <button id='prevButton' onClick={() => this.setHelpPageNum(1)}>Previous</button>
                                    <button id='nextButton' onClick={() => this.setHelpPageNum(2)}>Next</button>
                                </div>;
                    break;
                case 2:
                    helpWindow = <div className='help-window'>
                                    <div id='pageCounter'>2/3</div>
                                    <h1>What is a pathfinding algorithm?</h1>
                                    <h2>At its core, a pathfinding algorithm seeks to find the shortest path between two points. This application visualizes various pathfinding algorithms in action, and more!</h2>
                                    <p>All of the algorithms on this application are adapted for a 2D grid, where 90 degree turns have a "cost" of 1 and movements from a node to another have a "cost" of 1.</p>
                                    <button id='skipButton' onClick={() => this.toggleHelpWindow(true)}>Skip Tutorial</button>
                                    <button id='prevButton' onClick={() => this.setHelpPageNum(1)}>Previous</button>
                                    <button id='nextButton' onClick={() => this.setHelpPageNum(3)}>Next</button>
                                </div>;
                    break;
                case 3:
                    helpWindow = <div className='help-window'>
                                    <div id='pageCounter'>3/3</div>
                                    <h1>How to use</h1>
                                    <ul>
                                        <li>Select a pathfinding algorithm using the dropdown menu</li>
                                        <li>Left click the grid to draw walls</li>
                                        <li>Click the visualize button to begin pathfinding</li>
                                        <li>Click the reset path button to clear the search path</li>
                                        <li>Click the reset grid button to clear the grid, including walls</li>
                                        <li>The start and goal nodes can be moved by clicking edit grid</li>
                                    </ul> 
                                    <button id='skipButton' onClick={() => this.toggleHelpWindow(true)}>Skip Tutorial</button>
                                    <button id='prevButton' onClick={() => this.setHelpPageNum(2)}>Previous</button>
                                    <button id='nextButton' onClick={() => this.toggleHelpWindow(true)}>Finish</button>
                                </div>;
                    break;
            }
        }

        return (
            <div className='app-wrapper'>
                <div className='navbar'>
                    <Navbar 
                        grid={grid}
                        visualize={this.visualize}
                        handleSelectAlgo={this.handleAlgoChange}
                        resetGrid={this.resetGrid}
                        showHelpWindow={this.state.showHelpWindow}
                        toggleHelpWindow={this.toggleHelpWindow}
                        editGrid={this.state.editGrid}
                        toggleEditGrid={this.toggleEditGrid}
                        handleMoveNode={this.handleMoveNode}
                        setSearchSpeed={this.setSearchSpeed}
                        isAnimating={this.state.isAnimating}
                    />
                </div>
                <div className='instructions'>
                    {editTip}
                    {!this.state.editGrid && (
                        <p>Click the Visualize button to pathfind from the start node to the goal node using {this.state.algoType} algorithm!</p>
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
                {helpWindow}
                </div>
                
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
const createNode = (col, row, isStart, isFinish, isWall) => {
    return {
        col,
        row,
        isStart,
        isFinish,
        distance: Infinity,
        isVisited: false,
        isWall,
        previousNode: null,
    };
};

// Creates a new grid that contains the walls
const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (node.isStart === false && node.isFinish === false) {
        const newNode = {
            ...node,
            isWall: !node.isWall,
        };
        newGrid[row][col] = newNode;
    } else {
        const newNode = {
            ...node,
        };
        newGrid[row][col] = newNode;
    }
    return newGrid;
};