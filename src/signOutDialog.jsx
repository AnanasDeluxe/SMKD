import React, { Component } from 'react';
// Material UI
import Dialog from '@material-ui/core/Dialog';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Button } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

class SignOutDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    disconnect = () => {
        this.props.disconnect();
        this.handleClose();
    };

    render() {
        const { theme } = this.props;
        const { open } = this.state;

        return (
            <MuiThemeProvider theme={theme}>
                <li onClick={() => this.setState({ open: true })}><p>Sign out</p></li>
                <Dialog
                    open={open}
                    onClose={() => this.setState({ open: false })}
                >
                    <DialogTitle>Sign out</DialogTitle>
                    <DialogContent>
                        <DialogContentText>

                            Do you really want to sign out ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={this.disconnect} color="primary">Yes</Button>
                        <Button variant="contained" onClick={() => this.setState({ open: false })}>No</Button>
                    </DialogActions>
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

export default SignOutDialog;
