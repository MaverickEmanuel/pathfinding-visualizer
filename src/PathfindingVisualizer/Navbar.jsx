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
        console.log(selectedType);
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
                    <ul>
                        <li><a aria-haspopup="true">Select Algorithm</a>
                            <ul class="dropdown" aria-label="submenu">
                                <li onClick={() => this.handleSelectAlgo("Dijkstra's")}><a>Dijkstra's</a></li>
                                <li onClick={() => this.handleSelectAlgo('test2')}><a>Test 1</a></li>
                                <li onClick={() => this.handleSelectAlgo('test3')}><a>Test 2</a></li>
                            </ul>
                        </li>
                        <li onClick={() => visualize()}><a>Visualize {this.algoType}</a></li>
                        <li onClick={() => resetGrid(grid)}><a>Reset Grid</a></li>
                    </ul>
                </nav>
            </div>
        );
    }
}