import React, { Component } from 'react';
import './style/css/Content.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import NadePreview from './NadePreview';
import NadeOrigin from './NadeOrigin';
import Loader from '../Shared/Loader/Loader';
import MapFilters from './MapFilters';
import backArrow from './style/img/back-arrow.png';

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showOnly: null,
            map: this.props.mapData
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.map !== nextProps.mapData
            || this.state.showOnly !== nextState.showOnly
            || this.props !== nextProps;
    }

    componentDidUpdate() {
        this.setState({ map: this.props.mapData });
    }

    hideNadesExceptOne = selectedNadeId => {
        const that = this;

        this.state.map.grenades.forEach(grenade => {
            if (grenade._id === selectedNadeId) {
                that.setState({ showOnly: grenade });
            }
        });
    };

    adaptNadePositionOnGraph = nadePosition => `calc(${ nadePosition / 750 * 100 }%)`;

    render() {
        const {
            theme, selectedMap, isLoading, shrink, user
        } = this.props;
        const { showOnly, map } = this.state;

        return (
            <MuiThemeProvider theme={theme}>
                <div className={`Content ${ shrink ? ' expand-content' : ''}`}>
                    {
                        isLoading
                            ? <Loader />
                            : (
                                <div className="content-container">
                                    <h1>{selectedMap.name}</h1>
                                    <div className="content-content">
                                        <MapFilters user={user} />
                                        <div className="map-container">
                                            <img
                                                className="map"
                                                src={require(`./style/img/${ selectedMap.name.toLowerCase().replace(/\s/g, '') }Radar.png`)}
                                                alt={`SMKD ${ selectedMap.name } Radar`}
                                            />
                                            {
                                            showOnly
                                                ? (
                                                    <div className="showOnly">
                                                        <div className="back-arrow" onClick={() => this.setState({ showOnly: null })}>
                                                            <img src={backArrow} alt="SMKD Back" />
                                                        </div>
                                                        <NadeOrigin
                                                            nade={showOnly}
                                                            theme={theme}
                                                            adaptNadePositionOnGraph={this.adaptNadePositionOnGraph}
                                                            user={user}
                                                        />
                                                    </div>
                                                )
                                                : map.grenades.map(item => (
                                                    <NadePreview
                                                        key={item._id}
                                                        id={item._id}
                                                        x={this.adaptNadePositionOnGraph(item.destination[0])}
                                                        y={this.adaptNadePositionOnGraph(item.destination[1])}
                                                        type={item.type}
                                                        preview={item.previewResult}
                                                        name={item.title}
                                                        onlyShow={this.hideNadesExceptOne}
                                                    />
                                                ))
                                        }
                                        </div>
                                    </div>
                                </div>
                            )
                    }
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Content;
