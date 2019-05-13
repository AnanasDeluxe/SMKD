import React, { Component } from 'react';
import './style/css/App.css';
import FullScreen from 'react-full-screen';
import queryString from 'query-string';
import jwtDecode from 'jwt-decode';
import createMuiTheme from '@material-ui/core/es/styles/createMuiTheme';
import Sidebar from './Sidebar/Sidebar';
import Content from './Content/Content';
import LoginDialog from './LoginDialog';
import menu from './style/img/menu.png';
import fullScreen from './style/img/fullscreen.png';
import exitFullScreen from './style/img/exitFullscreen.png';
import previewImg from './Content/style/img/cache_cross.jpg';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    },
    palette: {
        primary: { main: '#0073aa' },
        secondary: { A400: '#2E2E2E' }
    }
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarShrinked: false,
            sidebarTriggered: false,
            isFull: false,
            selectedMap: {
                name: 'cache',
                grenades: []
            },
            user: {},
            isContentLoading: true,
            isUserLoading: true,
            darkMode: true
        };
    }

    componentDidMount() {
        const authToken = localStorage.getItem('authToken');

        function getDecodedAccessToken(token) {
            try {
                return jwtDecode(token);
            } catch (error) {
                return null;
            }
        }

        if (authToken && authToken !== 'undefined') this.loginWithId(authToken);
        else if (this.props.location.search.length > 0) {
            const values = queryString.parse(this.props.location.search);
            const tokenDecoded = getDecodedAccessToken(values.token);

            // If the token decoding is successful (= its body is readable)
            if (tokenDecoded !== null) this.setUser(tokenDecoded.body);
        } else {
            this.setState({ isUserLoading: false });
        }

        // Retrieving of the default map : 'Cache'
        const defaultMapName = this.state.selectedMap.name.toLowerCase().replace(/\s/g, '');
        this.getMap(defaultMapName);
    }

    updateContent = value => {
        const { selectedMap } = this.state;
        const temp = { ...selectedMap };
        const that = this;
        temp.name = value;

        // get new map data
        const mapName = value.toLowerCase().replace(/\s/g, '');
        this.setState({ selectedMap: temp }, () => {
            that.getMap(mapName);
        });
    };

    getMap = mapName => {
        const that = this;
        // Fetch la map(mapName) -> map
        fetch(`http://localhost:8080/maps/${ mapName}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    // eslint-disable-next-line no-console
                    console.error(data.error.description);
                } else {
                    this.setState({
                        map: {
                            ...that.state.map,
                            name: data.name,
                            grenades: data.nades
                        },
                        isContentLoading: false
                    }, () => {
                        const { map } = this.state;
                        const temp = { ...map };
                        for (let i = 0; i < temp.grenades.length; i = i + 1) {
                            if (temp.grenades[i].previewResult.length === 0) {
                                temp.grenades[i].previewResult = previewImg;
                            }
                        }
                        this.setState({ map: temp });
                    });
                }
            });
    };

    setUser = user => {
        this.setState({ user, darkMode: user.darkTheme }, () => {
            this.setState({ isUserLoading: false });
        });
    };

    signOut = isSteamUser => {
        this.setState({ user: {}, isUserLoading: false, darkMode: true });
        localStorage.clear();
        if (isSteamUser) window.location.href = '/';
    };

    loginWithId = authToken => {
        fetch('http://localhost:8080/login/withId', {
            method: 'GET',
            headers: new Headers({ Authorization: authToken })
        })
            .then(response => response.json())
            .then(data => (data.error ? this.setState({ loginErr: data.error.description }) : this.setUser(data.user)));
    };

    setDarkMode = darkModeActivated => {
        const userId = this.state.user._id;

        fetch(`http://localhost:8080/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({ darkTheme: darkModeActivated }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                this.setState({ darkMode: darkModeActivated });
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.error(error);
            });
    };

    render() {
        const {
            isFull, sidebarShrinked, sidebarTriggered, user, map,
            darkMode, isUserLoading, isContentLoading, selectedMap
        } = this.state;

        return (
            <FullScreen
                enabled={isFull}
                onChange={() => this.setState({ isFull })}
            >
                <div className="App">
                    <Sidebar
                        shrink={sidebarShrinked}
                        trigger={sidebarTriggered}
                        updateContent={this.updateContent}
                        isUserConnected={!!user._id}
                        darkMode={darkMode}
                        theme={theme}
                        user={user}
                    />
                    <div className={`Navbar ${ sidebarShrinked ? 'NavbarShrinked' : ''}`}>
                        <div className="sidebar-shrinker">
                            <img src={menu} alt="SMKD menu" onClick={() => this.setState({ sidebarShrinked: !sidebarShrinked })} />
                        </div>
                        <div className="sidebar-trigger">
                            <img src={menu} alt="SMKD menu" onClick={() => this.setState({ sidebarTriggered: !sidebarTriggered })} />
                        </div>
                        <div className="fullscreen-container">
                            <img
                                src={isFull ? exitFullScreen : fullScreen}
                                alt="SMKD fullscreen"
                                onClick={() => this.setState({ isFull: !isFull })}
                            />
                        </div>
                        <LoginDialog
                            user={user}
                            setDarkMode={this.setDarkMode}
                            setUser={this.setUser}
                            isUserLoading={isUserLoading}
                            signOut={this.signOut}
                            theme={theme}
                        />
                    </div>
                    {
                        isContentLoading
                            ? (
                                <Content
                                    shrink={sidebarShrinked}
                                    selectedMap={selectedMap}
                                    mapData={selectedMap}
                                    theme={theme}
                                    isLoading
                                    user={user}
                                />
                            )
                            : (
                                <Content
                                    shrink={sidebarShrinked}
                                    selectedMap={selectedMap}
                                    mapData={map}
                                    theme={theme}
                                    isLoading={false}
                                    user={user}
                                />
                            )
                    }
                </div>
            </FullScreen>
        );
    }
}

export default App;
