import React, { Component } from 'react';
import { Popover, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import search from './style/img/search.png';

const styles = theme => ({
    popover: { pointerEvents: 'none' },
    paper: { padding: theme.spacing.unit }
});

class NadePreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            nadePosition: {
                left: this.props.x,
                top: this.props.y
            }
        };
    }

    handlePopoverOpen = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handlePopoverClose = () => {
        this.setState({ anchorEl: null });
    };

    seeOrigins = () => {
        this.setState({ anchorEl: null }, function () {
            this.props.onlyShow(this.props.id);
        });
    };

    render() {
        const { anchorEl, nadePosition } = this.state;
        const { preview, name, type } = this.props;
        const open = Boolean(anchorEl);
        return (
            <div>
                <div
                    aria-owns={open ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={this.handlePopoverOpen}
                    className="nade"
                    style={nadePosition}
                />
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    onClose={this.handlePopoverClose}
                    disableRestoreFocus
                >
                    <div className="popover-content">
                        <img src={preview} alt="SMKD nade preview" />
                        <div className="text">
                            <div className="tag"><span>{type}</span></div>
                            <h4>{name}</h4>
                            <div className="send-button" onClick={this.seeOrigins}><img src={search} alt="SMKD origin" /></div>
                        </div>
                    </div>
                </Popover>
            </div>
        );
    }
}

NadePreview.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NadePreview);

