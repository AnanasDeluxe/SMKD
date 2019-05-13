import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import arrow from './style/img/arrow.png';

class Loader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleCheckboxChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    render() {
        const { user } = this.props;

        return (
            <div className="filters">
                <h2>Filters</h2>
                <div className="filter-category">
                    <h3>
                        <img src={arrow} alt="SMKD Arrow" />
                        {'Type'}
                    </h3>
                    {
                        user.filters && (
                            <ul>
                                <li>
                                    <Checkbox
                                        value="smokeChecked"
                                        color="primary"
                                        checked={user.filters.includes('smoke')}
                                        onChange={this.handleCheckboxChange('smokeChecked')}
                                    />
                                    <p>Smoke</p>
                                </li>
                                <li>
                                    <Checkbox
                                        value="flashChecked"
                                        color="primary"
                                        checked={user.filters.includes('flash')}
                                        onChange={this.handleCheckboxChange('flashChecked')}
                                    />
                                    <p>Flash</p>
                                </li>
                                <li>
                                    <Checkbox
                                        value="moloChecked"
                                        color="primary"
                                        checked={user.filters.includes('molo')}
                                        onChange={this.handleCheckboxChange('moloChecked')}
                                    />
                                    <p>Molotov</p>
                                </li>
                                <li>
                                    <Checkbox
                                        value="heChecked"
                                        color="primary"
                                        checked={user.filters.includes('he')}
                                        onChange={this.handleCheckboxChange('heChecked')}
                                    />
                                    <p>Explosive</p>
                                </li>
                                <li>
                                    <Checkbox
                                        value="boostChecked"
                                        color="primary"
                                        checked={user.filters.includes('boost')}
                                        onChange={this.handleCheckboxChange('boostChecked')}
                                    />
                                    <p>Boosts</p>
                                </li>
                            </ul>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default Loader;


