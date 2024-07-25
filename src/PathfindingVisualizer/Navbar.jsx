import React, {Component} from 'react';

import './Navbar.css';

export default class Navbar extends Component {    
    constructor() {
        super();
        this.state = {
            algoType: "Dijkstra's",
            searchSpeed: 'Normal'
        };
    }

    componentDidMount() {
        this.setState({algoType: "Dijkstra's", searchSpeed: 'Normal'});
    }
    
    // Handler for setting the new algorithm type when selected
    handleSelectAlgo = (selectedType) => {
        this.setState({algoType: selectedType});
        this.props.handleSelectAlgo(selectedType);        
    }

    // Handler for setting algorithm search speed
    handleSelectSpeed = (selectedSpeed) => {
        if (!this.props.isAnimating) {
            if (selectedSpeed === 5) {
                this.setState({searchSpeed: 'Fast'});
            } else if (selectedSpeed === 10) {
                this.setState({searchSpeed: 'Normal'});
            } else if (selectedSpeed === 20) {
                this.setState({searchSpeed: 'Slow'});
            }
            this.props.setSearchSpeed(selectedSpeed);
        }
    }
    
    render() {    

        return (
            <div className='navbar-wrapper'>
                <nav role="navigation">
                    {this.props.editGrid ? (
                        <>
                        <h1 className='edit-header'>Edit Node Positions</h1>
                        <ul>
                            <li onClick={() => this.props.handleMoveNode('start')}><a>Move Start Node</a></li>
                            <li onClick={() => this.props.handleMoveNode('goal')}><a>Move Goal Node</a></li>
                            <li onClick={() => this.props.toggleEditGrid(this.props.grid)}><a>Back</a></li>
                        </ul>
                        </>
                    ) : (
                        <>
                        <h1 className='main-header' onClick={openGithub}>Pathfinding Visualizer</h1>
                        <ul>
                            <li onClick={() => this.props.toggleHelpWindow(false)}><a>Help</a></li>
                            <li><a aria-haspopup="true">Select Algorithm</a>
                                <ul class="dropdown" aria-label="submenu">
                                    <div className='algoTypes'>
                                        <li onClick={() => this.handleSelectAlgo("Dijkstra's")}><a>Dijkstra's Algorithm</a></li>
                                        <li onClick={() => this.handleSelectAlgo('A* Search')}><a>A* Search</a></li>
                                        <li onClick={() => this.handleSelectAlgo('Greedy-BFS')}><a>Greedy Best-first Search</a></li>
                                        <li onClick={() => this.handleSelectAlgo('BFS')}><a>Breadth-first Search</a></li>
                                        <li onClick={() => this.handleSelectAlgo('DFS')}><a>Depth-first Search</a></li>
                                    </div>
                                </ul>
                            </li>
                            <li><a aria-haspopup="true">Speed: {this.state.searchSpeed}</a>
                                <ul class="dropdown" aria-label="submenu">
                                    <li onClick={() => this.handleSelectSpeed(5)}><a>Fast</a></li>
                                    <li onClick={() => this.handleSelectSpeed(10)}><a>Normal</a></li>
                                    <li onClick={() => this.handleSelectSpeed(20)}><a>Slow</a></li>
                                </ul>
                            </li>
                            <li className='visualize' onClick={() => this.props.visualize()}><a>Visualize {this.state.algoType}</a></li>
                            <li onClick={() => this.props.resetGrid(false)}><a>Reset Path</a></li>
                            <li onClick={() => this.props.resetGrid(true)}><a>Reset Grid</a></li>
                            <li onClick={() => this.props.toggleEditGrid(this.props.grid)}><a>Edit Grid</a></li>
                        </ul>
                        </>
                    )}
                </nav>
            </div>
        );
    }
}

// Opens the github repository in a new tab
const openGithub = () => {
    window.open('https://github.com/MaverickEmanuel/pathfinding-visualizer', '_blank').focus();
};