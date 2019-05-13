import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Button, withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import classNames from 'classnames';
import arrow from './style/img/arrow.png';
import addNade from './style/img/addnade.png';

const styles = theme => ({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    formControl: {
        minWidth: '44%',
        width: '44%',
        padding: '5px 0 10px 0'
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    chip: {
        margin: theme.spacing.unit / 4
    }
});

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 40 * 4.5 + 5,
            width: 250
        }
    }
};

const grenadeTags = [
    'FAKE',
    'ONEWAY',
    'RETAKE',
    'ASITE',
    'BSITE',
    'WALL',
    'MID',
    'CT',
    'TERRO',
    '64TICK',
    '128TICK',
    'POPFLASH'
];

function getStyles(name, that) {
    return {
        fontWeight:
            that.state.tags.indexOf(name) === -1
                ? that.props.theme.typography.fontWeightRegular
                : that.props.theme.typography.fontWeightMedium
    };
}

class CreateGrenadeDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            title: '',
            successMessage: '',
            map: '',
            type: '',
            tags: [],
            destinationX: '',
            destinationY: '',
            originX: '',
            originY: '',
            video: '',
            previewResult: '',
            preview64: '',
            preview128: '',
            description: '',
            landmark: '',
            created: false
        };
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    createNade = () => {
        const nade = {
            map: this.state.map,
            title: this.state.title,
            type: this.state.type,
            tags: this.state.tags,
            destination: [this.state.destinationX, this.state.destinationX],
            origin: [this.state.originX, this.state.originY],
            video: this.state.video,
            previewResult: this.state.previewResult,
            preview64: this.state.preview64,
            preview128: this.state.preview128,
            description: this.state.description,
            landmark: this.state.landmark,
            userCreator: this.props.user
        };

        if (this.props.user.role === 'ADMIN') {
            // Operate data here, and set "created" to true if the return status is OK
            // Check if the user is ADMIN server side too.

            fetch('http://localhost:8080/grenades', {
                method: 'POST',
                body: JSON.stringify(nade),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            }).then(response => response.json())
                .then(() => {
                    this.setState({
                        title: '',
                        successMessage: 'Grenade successfully created.',
                        map: '',
                        type: '',
                        tags: [],
                        destinationX: '',
                        destinationY: '',
                        originX: '',
                        originY: '',
                        video: '',
                        previewResult: '',
                        preview64: '',
                        preview128: '',
                        description: '',
                        landmark: '',
                        created: true
                    });
                })
                .catch(error => {
                    // eslint-disable-next-line no-console
                    console.log(error.message);
                    this.setState({
                        successMessage: error.message
                    });
                });
        }
    };

    render() {
        const { theme, classes } = this.props;
        const {
            open, title, successMessage, map, type, tags,
            destinationX, destinationY, originX, originY,
            video, previewResult, preview64, preview128,
            description, landmark, created
        } = this.state;

        return (
            <MuiThemeProvider theme={theme}>
                <div className="name" onClick={() => this.setState({ open: true })}>
                    <img className="pin" src={addNade} alt={'SMKD create'} />
                    <span>Create Grenade</span>
                    <img className="rotate-icon" src={arrow} alt="SMKD Rotate icon" />
                </div>
                <Dialog
                    open={open}
                    onClose={() => this.setState({ open: false })}
                >
                    <div className="login-content profile-edition">
                        <form>
                            <div className="input-container">
                                <TextField
                                    name="grenadeTitle"
                                    value={title}
                                    onChange={e => this.setState({ title: e.target.value })}
                                    margin="dense"
                                    label="Title"
                                    type="text"
                                    fullWidth
                                />
                            </div>
                            <div className={classes.container}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="age-simple">Type</InputLabel>
                                    <Select
                                        value={type}
                                        onChange={this.handleChange}
                                        inputProps={{
                                            name: 'type',
                                            id: 'type-simple'
                                        }}
                                    >
                                        <MenuItem value="SMOKE">Smoke</MenuItem>
                                        <MenuItem value="FLASH">Flash</MenuItem>
                                        <MenuItem value="HE">HE</MenuItem>
                                        <MenuItem value="MOLOTOV">Molotov</MenuItem>
                                        <MenuItem value="BOOST">Boost</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="age-simple">Map</InputLabel>
                                    <Select
                                        value={map}
                                        onChange={this.handleChange}
                                        inputProps={{
                                            name: 'map',
                                            id: 'map-simple'
                                        }}
                                    >
                                        <MenuItem value="cache">Cache</MenuItem>
                                        <MenuItem value="mirage">Mirage</MenuItem>
                                        <MenuItem value="dust2">Dust 2</MenuItem>
                                        <MenuItem value="inferno">Inferno</MenuItem>
                                        <MenuItem value="nuke">Nuke</MenuItem>
                                        <MenuItem value="overpass">Overpass</MenuItem>
                                        <MenuItem value="train">Train</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="select-multiple-chip">Tags</InputLabel>
                                <Select
                                    multiple
                                    value={tags}
                                    onChange={e => this.setState({ tags: e.target.value })}
                                    input={<Input id="select-multiple-chip" />}
                                    renderValue={selected => (
                                        <div className={classes.chips}>
                                            {
                                                selected.map(value => (
                                                    <Chip
                                                        key={value}
                                                        label={value}
                                                        className={classes.chip}
                                                    />
                                                )
                                            )}
                                        </div>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {grenadeTags.map(tag => (
                                        <MenuItem key={tag} value={tag} style={getStyles(tag, this)}>
                                            {tag}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                name="video"
                                value={video}
                                onChange={e => this.setState({ video: e.target.value })}
                                margin="dense"
                                label="Video Link"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                name="previewResult"
                                value={previewResult}
                                onChange={e => this.setState({ previewResult: e.target.value })}
                                margin="dense"
                                label="Preview Result"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                name="preview64"
                                value={preview64}
                                onChange={e => this.setState({ preview64: e.target.value })}
                                margin="dense"
                                label="Preview 64"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                name="preview128"
                                value={preview128}
                                onChange={e => this.setState({ preview128: e.target.value })}
                                margin="dense"
                                label="Preview 128"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                id="filled-multiline-flexible"
                                name="description"
                                value={description}
                                onChange={e => this.setState({ description: e.target.value })}
                                margin="dense"
                                label="Description"
                                type="text"
                                fullWidth
                                multiline
                                rowsMax="3"
                            />
                            <div className="input-container">
                                <h3>From :</h3>
                                <div className={classNames([
                                    classes.container,
                                    'formControls'
                                ])}
                                >
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            name="destinationX"
                                            value={destinationX}
                                            onChange={e => this.setState({ destinationX: e.target.value })}
                                            margin="dense"
                                            label="X"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            name="destinationY"
                                            value={destinationY}
                                            onChange={e => this.setState({ destinationY: e.target.value })}
                                            margin="dense"
                                            label="Y"
                                            type="text"
                                        />
                                    </FormControl>
                                </div>
                            </div>
                            <div className="input-container">
                                <h3>To :</h3>
                                <div className={classNames([
                                    classes.container,
                                    'formControls'
                                ])}
                                >
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            name="originX"
                                            value={originX}
                                            onChange={e => this.setState({ originX: e.target.value })}
                                            margin="dense"
                                            label="X"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            name="originY"
                                            value={originY}
                                            onChange={e => this.setState({ originY: e.target.value })}
                                            margin="dense"
                                            label="Y"
                                            type="text"
                                        />
                                    </FormControl>
                                </div>
                            </div>
                            <div className="input-container">
                                <h3>Landmark :</h3>
                                <div className={classNames([
                                    classes.container,
                                    'formControls'
                                ])}
                                >
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            name="landmark"
                                            value={landmark}
                                            onChange={e => this.setState({ landmark: e.target.value })}
                                            margin="dense"
                                            label="Sec"
                                            type="text"
                                            fullWidth
                                        />
                                    </FormControl>
                                </div>
                            </div>
                        </form>
                        <div className="response-message">
                            {successMessage ? <p>{successMessage}</p> : ''}
                        </div>
                        <div className="actions">
                            {
                                created
                                    ? <Button variant="contained" color="primary" className="fullWidth" disabled>CREATED !</Button>
                                    : (
                                        <Button
                                            variant="contained"
                                            onClick={this.createNade}
                                            color="primary"
                                            className="fullWidth"
                                        >
                                            {'CREATE'}
                                        </Button>
                                    )
                            }
                        </div>
                    </div>
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

CreateGrenadeDialog.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreateGrenadeDialog);
