import React, {Component} from 'react';

export default class Navbar extends Component {    
    constructor() {
        super();
        this.state = {
            algoType: 'dijkstra',
        };
    }
    
    handleSelectAlgo = (event) => {
        var selectedType = event.target.value;
        this.props.handleSelectAlgo(selectedType);            
    }
    
    render() {    
        const {
            grid,
            resetGrid,
            visualize,
        } = this.props;

        return (
            <div>
                <label>
                    Select Algorithm
                    <select value={this.algoType} onChange={this.handleSelectAlgo}>
                        <option value="dijkstra">Dijkstra's</option>
                        <option value="dijkstra2">Test1</option>
                        <option value="dijkstra3">Test2</option>
                    </select>
                </label>
                <button onClick={() => visualize()}> 
                    Visualize
                </button>
                <button onClick={() => resetGrid(grid)}> 
                    Reset Grid
                </button>
            </div>
        );
    }
}