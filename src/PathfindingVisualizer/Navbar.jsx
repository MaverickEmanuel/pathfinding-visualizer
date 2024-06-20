import React, {Component} from 'react';

export default class Navbar extends Component {    
    render() {    
        const {
            grid,
            resetGrid,
            visualize,
        } = this.props;

        return (
            <div>
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