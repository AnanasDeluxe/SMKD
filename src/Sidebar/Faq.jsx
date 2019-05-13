import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

class FaqDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    render() {
        const { theme } = this.props;
        const { open } = this.state;

        return (
            <MuiThemeProvider theme={theme}>
                <Dialog
                    open={open}
                    onClose={() => this.setState({ open: false })}
                >
                    {'Oui'}
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

export default FaqDialog;
