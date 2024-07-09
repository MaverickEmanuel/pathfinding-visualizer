import React, {Component} from 'react';

import './Navbar.css';

export default class Navbar extends Component {    
    constructor() {
        super();
        this.state = {
            algoType: "Dijkstra's",
        };
    }

    componentDidMount() {
        this.algoType = "Dijkstra's";
    }
    
    handleSelectAlgo = (selectedType) => {
        this.algoType = selectedType;
        this.setState({algoType: selectedType});
        this.props.handleSelectAlgo(selectedType);        
    }
    
    render() {    
        const {
            grid,
            resetGrid,
            visualize,
        } = this.props;

        return (
            <div className='navbar-wrapper'>
                <nav role="navigation">
                    <h1 onClick={openGithub}>Pathfinding Visualizer</h1>
                    <ul>
                        <li><a aria-haspopup="true">Select Algorithm</a>
                            <ul class="dropdown" aria-label="submenu">
                                <li onClick={() => this.handleSelectAlgo("Dijkstra's")}><a>Dijkstra's Algorithm</a></li>
                                <li onClick={() => this.handleSelectAlgo('A* Search')}><a>A* Search</a></li>
                                <li onClick={() => this.handleSelectAlgo('Greedy-BFS')}><a>Greedy Best-first Search</a></li>
                                <li onClick={() => this.handleSelectAlgo('BFS')}><a>Breadth-first Search</a></li>
                                <li onClick={() => this.handleSelectAlgo('DFS')}><a>Depth-first Search</a></li>
                            </ul>
                        </li>
                        <li className='visualize' onClick={() => visualize()}><a>Visualize {this.algoType}</a></li>
                        <li onClick={() => resetGrid(grid)}><a>Reset Grid</a></li>
                        <li onClick={() => this.props.toggleHelpWindow(false)}><a>Help</a></li>
                    </ul>
                </nav>
            </div>
        );
    }
}

const openGithub = () => {
    window.open('https://github.com/MaverickEmanuel/pathfinding-visualizer', '_blank').focus();
};