import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import { Switch } from '@material-ui/core';
import FiltersDialog from './FiltersDialog';
import ProfileDialog from './ProfileDialog';
import SignOutDialog from './signOutDialog';
import noImgUrl from './style/img/user.png';
import down_arrow from './style/img/down-arrow.png';
import steamLogo from './style/img/steamLogo.png';
import logo from './style/img/smkd_logo3.png';

class LoginDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            popperOpen: false,
            anchorEl: null,
            loginUsername: '',
            loginPassword: '',
            signupUsername: '',
            signupEmail: '',
            signupPswd: '',
            signupPswdConf: '',
            displayLogin: true,
            user: {},
            darkTheme: false,
            loginErr: ''
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.user !== prevProps.user) {
            this.setState({ open: false });
            this.setState({ user: this.props.user, darkTheme: this.props.user.darkTheme, open: false }, () => {
                if (this.props.user.is_steam_user === false) localStorage.setItem('authToken', this.state.user._id);
            });
        }
    }

    steamLogin = () => {
        window.location.href = 'http://localhost:8080/login/steam';
    };

    signup = () => {
        this.setState({ signupErr: '' });
        if (this.state.signupUsername === '' || this.state.signupPswd === '' || this.state.signupEmail === '' || this.state.signupPswdConf === '') this.setState({ signupErr: 'Please provide all the informations.' });
        else if (this.state.signupUsername.length < 5) this.setState({ signupErr: 'Username must be at least 5 characters.' });
        else if (this.state.signupPswd.length < 7) this.setState({ signupErr: 'Password must have at least 7 characters.' });
        else if (this.state.signupPswd !== this.state.signupPswdConf) this.setState({ signupErr: 'Passwords do not match.' });
        else {
            // Send data here, check response and edit signupErr in case
            const { signupUsername, signupPswd, signupEmail } = this.state;
            const userSignUp = {
                username: signupUsername,
                password: signupPswd,
                email: signupEmail,
                img_url: ''
            };

            fetch('http://localhost:8080/users', {
                method: 'POST',
                body: JSON.stringify(userSignUp),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            }).then(response => response.json())
                .then(data => {
                    if (data.errors !== undefined) {
                        // Display the global error message
                        this.setState({ signupErr: data.message });
                    } else {
                        this.setState({ user: data, open: false }); // Retour de l'utilisateur récemment inscrit
                    }
                })
                .catch(error => {
                    // eslint-disable-next-line no-console
                    console.log(error.message);
                });
        }
    };

    login = () => {
        const { loginUsername, loginPassword } = this.state;
        const that = this;

        function checkLoginInfo(username, password) {
            if (username === '' || password === '') {
                that.setState({ loginErr: 'Please provide all the informations.' });
                return false;
            }

                that.setState({ loginErr: '' });
                return true;
        }

        if (checkLoginInfo(loginUsername, loginPassword) === true) {
            const base64Auth = new Buffer(`${loginUsername }:${ loginPassword}`).toString('base64');

            fetch('http://localhost:8080/login', {
                method: 'GET',
                headers: new Headers({ Authorization: `Basic ${ base64Auth}` })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) this.setState({ loginErr: data.error.description });
                    else {
                        this.setState({ user: data.user, darkTheme: data.user.darkTheme }, () => {
                            this.props.setUser(this.state.user);
                            this.setState({ loginUsername: '', loginPassword: '', open: false });
                        });
                    }
                });
        }
    };

    disconnect = () => {
        if (this.state.user.is_steam_user) this.props.signOut(true);
        else this.props.signOut(false);
        this.setState({ user: {}, popperOpen: false });
    };

    handleDarkMode = event => {
        this.setState({ darkTheme: event.target.checked }, () => {
            this.props.setDarkMode(this.state.darkTheme);
        });
    };

    handleClick = event => {
        const { currentTarget } = event;
        this.setState(state => ({
            anchorEl: currentTarget,
            popperOpen: !state.popperOpen
        }));
    };

    render() {
        const {
            anchorEl, popperOpen, user, darkTheme,
            open, displayLogin, loginUsername,
            loginPassword, loginErr
        } = this.state;
        const { theme, isUserLoading, setUser } = this.props;
        const id = popperOpen ? 'simple-popper' : null;

        return (
            <MuiThemeProvider theme={theme}>
                {
                    isUserLoading ? ''
                        : (
                            <div className="login-container">
                                {
                                user._id
                                    ? (
                                        <div>
                                            <div
                                                className="user-container"
                                                aria-describedby={id}
                                                onClick={this.handleClick}
                                            >
                                                <img className="profile-picture" src={user.img_url || noImgUrl} alt="" />
                                                <p>{user.username}</p>
                                                <img className={`dropdown-arrow${ popperOpen ? ' rotate' : ''}`} src={down_arrow} alt="SMKD bottom arrow" />
                                            </div>
                                            <Popper
                                                id={id}
                                                open={popperOpen}
                                                anchorEl={anchorEl}
                                                placement="bottom-end"
                                                transition
                                            >
                                                {({ TransitionProps }) => (
                                                    <Fade {...TransitionProps} timeout={350}>
                                                        <Paper>
                                                            <div className="user-dropdown">
                                                                <ul>
                                                                    <li>
                                                                        <p>Dark Sidebar</p>
                                                                        <Switch
                                                                            checked={darkTheme}
                                                                            onChange={this.handleDarkMode}
                                                                        />
                                                                    </li>
                                                                    { !user.is_steam_user
                                                                        && (
                                                                        <ProfileDialog
                                                                            theme={theme}
                                                                            user={user}
                                                                            setUser={setUser}
                                                                        />
                                                                    )}
                                                                    <FiltersDialog
                                                                        theme={theme}
                                                                        user={user}
                                                                        setUser={setUser}
                                                                    />
                                                                    <SignOutDialog
                                                                        theme={theme}
                                                                        disconnect={this.disconnect}
                                                                    />
                                                                </ul>
                                                            </div>
                                                        </Paper>
                                                    </Fade>
                                            )}
                                            </Popper>
                                        </div>
                                    )
                                    : (
                                        <div className="custom-button" onClick={() => this.setState({ open: true })}>
                                            <span className="circle" />
                                            <span className="text">Log in</span>
                                        </div>
                                    )
                            }
                                <Dialog
                                    onClose={() => this.setState({ open: false })}
                                    open={open}
                                    fullWidth
                                    maxWidth="xs"
                                    style={{ backgroundColor: 'transparent' }}
                                >
                                    <div className="login-content">
                                        <div className="title-container">
                                            <h2>Welcome !</h2>
                                            <div className="logo-container">
                                                <img src={logo} alt="SMKD Logo" />
                                            </div>
                                        </div>
                                        {
                                        displayLogin ? (
                                            <div className="login-form">
                                                <form>
                                                    <Grid container justify="center">
                                                        <TextField
                                                            value={loginUsername}
                                                            onChange={
                                                                e => this.setState({ loginUsername: e.target.value })
                                                            }
                                                            margin="dense"
                                                            id="loginUserUsername"
                                                            label="Username"
                                                            type="text"
                                                            fullWidth
                                                        />
                                                        <TextField
                                                            value={loginPassword}
                                                            onChange={
                                                                e => this.setState({ loginPassword: e.target.value })
                                                            }
                                                            margin="dense"
                                                            id="loginUserPassword"
                                                            label="Password"
                                                            type="password"
                                                            fullWidth
                                                        />
                                                        <div className="validate-button" onClick={this.login}>
                                                            <span>LOG IN</span>
                                                        </div>
                                                        <div className="err-container">
                                                            {loginErr ? <p>{loginErr}</p> : ''}
                                                        </div>
                                                    </Grid>
                                                </form>
                                            </div>
                                            ) : (
                                            <div className="signUp-form">
                                                <form>
                                                    <Grid container justify="center">
                                                        <TextField
                                                            value={this.state.signupUsername}
                                                            onChange={
                                                                e => this.setState({ signupUsername: e.target.value })
                                                            }
                                                            margin="dense"
                                                            id="signupUserUsername"
                                                            label="Username"
                                                            type="text"
                                                            fullWidth
                                                        />
                                                        <TextField
                                                            value={this.state.signupEmail}
                                                            onChange={
                                                                e => this.setState({ signupEmail: e.target.value })
                                                            }
                                                            margin="dense"
                                                            id="signupUserEmail"
                                                            label="Email"
                                                            type="email"
                                                            fullWidth
                                                        />
                                                        <TextField
                                                            value={this.state.signupPswd}
                                                            onChange={
                                                                e => this.setState({ signupPswd: e.target.value })
                                                            }
                                                            margin="dense"
                                                            id="signupUserPassword"
                                                            label="Password"
                                                            type="password"
                                                            fullWidth
                                                        />
                                                        <TextField
                                                            value={this.state.signupPswdConf}
                                                            onChange={
                                                                e => this.setState({ signupPswdConf: e.target.value })
                                                            }
                                                            margin="dense"
                                                            id="signupUserPasswordConf"
                                                            label="Confirm Password"
                                                            type="password"
                                                            fullWidth
                                                        />
                                                        <div className="validate-button" onClick={this.signup}>
                                                            <span>SIGN UP</span>
                                                        </div>
                                                        <div className="err-container">
                                                            {this.state.signupErr ? <p>{this.state.signupErr}</p> : ''}
                                                        </div>
                                                    </Grid>
                                                </form>
                                            </div>
                                        )
                                    }
                                        <div className="validate-button steam-login" onClick={this.steamLogin}>
                                            <img src={steamLogo} alt={'SMKD Steam Login'} />
                                            <span>LOG IN WITH STEAM</span>
                                        </div>
                                        <div className="bottom-text">
                                            {
                                                displayLogin
                                                    ? (<p>Not registered ?<span onClick={() => this.setState({ displayLogin: !displayLogin })}>Sign up here</span></p>)
                                                    : (<p>Already registered ?<span onClick={() => this.setState({ displayLogin: !displayLogin })}>Log in here</span></p>)
                                            }
                                        </div>
                                    </div>
                                </Dialog>
                            </div>
                        )
                }
            </MuiThemeProvider>
        );
    }
}

export default LoginDialog;
