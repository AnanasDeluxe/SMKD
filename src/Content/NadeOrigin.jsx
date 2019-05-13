import React, { Component } from 'react';
import NadeDialog from './NadeDialog';

class NadeOrigin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nade: this.props.nade,
            nadePosition: {
                left: this.props.adaptNadePositionOnGraph(this.props.nade.destination[0]),
                top: this.props.adaptNadePositionOnGraph(this.props.nade.destination[1])
            }
        };
    }

    render() {
        const { nade, nadePosition } = this.state;
        const { theme, user } = this.props;

        return (
            <div>
                <div className="nade" style={nadePosition} />
                {
                    nade.origins.map(item => (
                        <NadeDialog
                            x={this.props.adaptNadePositionOnGraph(item.position[0])}
                            y={this.props.adaptNadePositionOnGraph(item.position[1])}
                            key={item._id}
                            id={item._id}
                            theme={theme}
                            user={user}
                        />
                    ))
                }
            </div>
        );
    }
}

export default NadeOrigin;
