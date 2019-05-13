import React, { Component } from 'react';
// Material UI
import Dialog from '@material-ui/core/Dialog';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import noImgUrl from './style/img/user.png';

class ProfileDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            imgUrl: this.props.user.imgUrl,
            email: this.props.user.email,
            username: this.props.user.username,
            password: '',
            oldPassword: '',
            successMessage: ''
        };
    }

    updateUser = newUser => {
        this.props.setUser(newUser);
    };

    editProfile = () => {
        const userId = this.props.user._id;
        const {
email, username, password, oldPassword
        } = this.state;

        const userPatched = {
            username: this.props.user.username !== username ? username : undefined,
            password: password !== '' ? password : undefined,
            oldPassword: oldPassword !== '' ? oldPassword : undefined,
            email: this.props.user.email !== email ? email : undefined
        };

        fetch(`http://localhost:8080/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(userPatched),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
            .then(response => {
                if (response.status === 201) {
                    return response.json();
                }
                return null;
            })
            .then(data => {
                this.updateUser(data);
                this.setState({
                    successMessage: 'Your profile has been updated.'
                });
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.error(error);
            });
    };

    render() {
        const { theme } = this.props;
        const {
            open, email, username, password, imgUrl, oldPassword, successMessage
        } = this.state;

        const userState = {
            email,
            username
        };

        const disable = email === userState.email && username === userState.username;

        return (
            <MuiThemeProvider theme={theme}>
                <li onClick={() => this.setState({ open: true })}><p>Profile</p></li>
                <Dialog
                    open={open}
                    onClose={() => this.setState({ open: false })}
                >
                    <div className="login-content profile-edition">
                        <div className="title-container">
                            <h2>Profile edition</h2>
                        </div>
                        <form>
                            <div className="edit-image">
                                <img src={imgUrl || noImgUrl} alt="User" />
                            </div>
                            <div className="textfield-container">
                                <TextField
                                    name="editUserUsername"
                                    value={username}
                                    onChange={e => this.setState({ username: e.target.value })}
                                    margin="dense"
                                    label="Username"
                                    type="text"
                                    fullWidth
                                />
                            </div>
                            <div className="textfield-container">
                                <TextField
                                    name="editUserEmail"
                                    value={email}
                                    onChange={e => this.setState({ email: e.target.value })}
                                    label="Email"
                                    type="text"
                                    fullWidth
                                />
                            </div>
                            <div className="textfield-container">
                                <TextField
                                    name="editUserOldPassword"
                                    value={oldPassword}
                                    onChange={e => this.setState({ oldPassword: e.target.value })}
                                    margin="dense"
                                    label="Old password"
                                    type="password"
                                    fullWidth
                                />
                            </div>
                            <div className="textfield-container">
                                <TextField
                                    name="editUserPassword"
                                    value={password}
                                    onChange={e => this.setState({ password: e.target.value })}
                                    margin="dense"
                                    label="New password"
                                    type="password"
                                    fullWidth
                                />
                            </div>
                        </form>
                        <div className="response-message">
                            { successMessage ? <p>{successMessage}</p> : '' }
                        </div>
                        <div className="actions">
                            <Button variant="contained" onClick={() => this.setState({ open: false })}>CANCEL</Button>
                            <Button
                                variant="contained"
                                onClick={this.editProfile}
                                color="primary"
                                disabled={disable}
                            >
                                {'EDIT'}
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

export default ProfileDialog;
