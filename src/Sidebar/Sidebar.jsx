import React, { Component } from 'react';
import './style/css/Sidebar.css';
import logo from '../style/img/smkd_logo2.png';
import logo1024 from '../style/img/smkd_logo_1024.png';
import cachePin from './style/img/cachePin.png';
import overpassPin from './style/img/overpassPin.png';
import dust2Pin from './style/img/dust2Pin.png';
import trainPin from './style/img/trainPin.png';
import nukePin from './style/img/nukePin.png';
import infernoPin from './style/img/infernoPin.png';
import miragePin from './style/img/miragePin.png';
import faqPin from './style/img/faqPin.png';
import arrow from './style/img/arrow.png';
import favPin from './style/img/favPin.png';
import CreateGrenadeDialog from './CreateGrenadeDialog';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMapPool: [
                { name: 'Cache', pin: cachePin, active: false },
                { name: 'Dust 2', pin: dust2Pin, active: false },
                { name: 'Inferno', pin: infernoPin, active: false },
                { name: 'Mirage', pin: miragePin, active: false },
                { name: 'Nuke', pin: nukePin, active: false },
                { name: 'Overpass', pin: overpassPin, active: false },
                { name: 'Train', pin: trainPin, active: false }
            ]
        };
    }

    toggleChangeMap = index => {
        const temp = { ...this.state };
        temp.activeMapPool.forEach(element => {
            element.active = false;
        });
        temp.activeMapPool[index].active = true;
        this.setState({ activeMapPool: temp.activeMapPool }, () => {
            this.props.updateContent(temp.activeMapPool[index].name);
        });
    };

    render() {
        const {
            shrink, trigger, darkMode, isUserConnected, theme, user
        } = this.props;
        const { activeMapPool } = this.state;

        return (
            <nav className={`Sidebar ${ shrink ? ' shrinked' : '' }${trigger ? '' : ' hidden' }${darkMode ? '' : ' light'}`}>
                <div className="logo-container">
                    <img className="logo-large" src={logo} alt="SMKD Logo" />
                    <img className="logo-small" src={logo1024} alt="SMKD Logo Small" />
                </div>
                <div className="navigation-container">
                    {
                        isUserConnected ? (
                            <div>
                                <div className="category">
                                    <p>Your Profile</p>
                                </div>
                                <div className="map-pool">
                                    <div className="map">
                                        <div className="name">
                                            <img className="pin" src={favPin} alt="SMKD Favorites" />
                                            <span>Favorites Grenades</span>
                                            <img className="rotate-icon" src={arrow} alt="SMKD Rotate icon" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''
                    }
                    <div className="category">
                        <p>Active Duty Map Pool</p>
                    </div>
                    <div className="map-pool">
                        {
                            activeMapPool.map((item, index) => (
                                <div className={item.active ? 'active map' : 'map'} key={item.name} onClick={() => this.toggleChangeMap(index)}>
                                    <div className="name">
                                        <img className="pin" src={item.pin} alt={`SMKD ${ item.name}`} />
                                        <span>{item.name}</span>
                                        <img className="rotate-icon" src={arrow} alt="SMKD Rotate icon" />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="category">
                        <p>Support</p>
                    </div>
                    <div className="map-pool">
                        <div className="map">
                            <div className="name">
                                <img className="pin" src={faqPin} alt={'SMKD faq'} />
                                <span>F.A.Q.</span>
                                <img className="rotate-icon" src={arrow} alt="SMKD Rotate icon" />
                            </div>
                        </div>
                    </div>
                    {
                        user.role === 'ADMIN' && (
                            <div>
                                <div className="category">
                                    <p>Admin</p>
                                </div>
                                <div className="map-pool">
                                    <div className="map">
                                        <CreateGrenadeDialog
                                            user={user}
                                            theme={theme}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </nav>
        );
    }
}

export default Sidebar;
