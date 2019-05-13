import React from 'react';
import loader from './img/loader.svg';

const loaderStyle = {
    width: '150px',
    height: '150px'
};

const Loader = () => <img src={loader} alt="SMKD Loading" style={loaderStyle} />;

export default Loader;
