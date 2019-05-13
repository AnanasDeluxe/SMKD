import React, { Component } from 'react';
// Material UI
import Dialog from '@material-ui/core/Dialog';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Button } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class FiltersDialog extends Component {
    constructor(props) {
        super(props);
        const { user } = this.props;
        this.state = {
            open: false,
            smoke: user && user.filters.includes('smoke'),
            flash: user && user.filters.includes('flash'),
            he: user && user.filters.includes('he'),
            molo: user && user.filters.includes('molo'),
            boost: user && user.filters.includes('boost')

        };
    }

    updateUser = newUser => {
        this.props.setUser(newUser);
    };

    editProfile = () => {
        const { _id: userId } = this.props.user;
        const {
            smoke, flash, he, molo, boost
        } = this.state;

        // Filter array creation before sending to the back-end
        const newFilters = [];
        if (smoke) newFilters.push('smoke');
        if (flash) newFilters.push('flash');
        if (he) newFilters.push('he');
        if (molo) newFilters.push('molo');
        if (boost) newFilters.push('boost');

        fetch(`http://localhost:8080/users/${userId}/filters`, {
            method: 'PATCH',
            body: JSON.stringify(newFilters),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .then(user => {
                const { filters } = user;
                this.updateUser(user);
                this.setState({
                    smoke: filters.includes('smoke'),
                    flash: filters.includes('flash'),
                    he: filters.includes('he'),
                    molo: filters.includes('molo'),
                    boost: filters.includes('boost'),
                    open: false
                });
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.error(error);
            });
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    render() {
        const { theme } = this.props;
        const {
            open, smoke, flash, he, molo, boost
        } = this.state;

        return (
            <MuiThemeProvider theme={theme}>
                <li onClick={() => this.setState({ open: true })}><p>Filters</p></li>
                <Dialog
                    open={open}
                    onClose={() => this.setState({ open: false })}
                >
                    <div className="login-content profile-edition">
                        <div className="title-container">
                            <h2>Filters preferences</h2>
                        </div>
                        <form>
                            <div className="formControl-container">
                                <FormControlLabel
                                    control={(
                                        <Checkbox
                                            checked={smoke}
                                            onChange={this.handleChange('smoke')}
                                            value="checkedB"
                                            color="primary"
                                        />
                                    )}
                                    label="Smoke"
                                />
                            </div>
                            <div className="formControl-container">
                                <FormControlLabel
                                    control={(
                                        <Checkbox
                                            checked={flash}
                                            onChange={this.handleChange('flash')}
                                            value="checkedB"
                                            color="primary"
                                        />
                                    )}
                                    label="Flash"
                                />
                            </div>
                            <div className="formControl-container">
                                <FormControlLabel
                                    control={(
                                        <Checkbox
                                            checked={he}
                                            onChange={this.handleChange('he')}
                                            value="checkedB"
                                            color="primary"
                                        />
                                    )}
                                    label="HE Grenade"
                                />
                            </div>
                            <div className="formControl-container">
                                <FormControlLabel
                                    control={(
                                        <Checkbox
                                            checked={molo}
                                            onChange={this.handleChange('molo')}
                                            value="checkedB"
                                            color="primary"
                                        />
                                    )}
                                    label="Molotov"
                                />
                            </div>
                            <div className="formControl-container">
                                <FormControlLabel
                                    control={(
                                        <Checkbox
                                            checked={boost}
                                            onChange={this.handleChange('boost')}
                                            value="checkedB"
                                            color="primary"
                                        />
                                    )}
                                    label="Boost"
                                />
                            </div>
                        </form>
                        <div className="actions">
                            <Button variant="contained" onClick={() => this.setState({ open: false })}>CANCEL</Button>
                            <Button variant="contained" onClick={this.editProfile} color="primary">SAVE</Button>
                        </div>
                    </div>
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

export default FiltersDialog;
