'use strict';

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import {useApi} from '../common/hook'
import Title from "../components/title";
import MetaTag from "../components/metatag";
import {NavLink} from "react-router-dom";
import 'scss/pages/error.scss';
const pagetitle = 'Taleofddh Page Not Found';
const source = 'error';

function Error(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="boxouter">
                <div className="container">
                    <div className="errorframe">
                        <Title message={pagetitle} />
                        <div className="errormessage">
                            <p>Your requested page is not available or the application has generated an error.</p>
                            <p>Please visit <NavLink to="/">Taleofddh Home Page</NavLink> to search for features</p>
                            <p>If you have any specific query please <NavLink to="/contact-us">Contact Us</NavLink>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Error;