'use strict';

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, {useEffect, useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink
} from "react-router-dom";
import {SessionContext, getSessionCookie, setSessionCookie, getSessionStorage} from "../common/session";
import {useApi, useFetch} from "../common/hook";
import Title from "../components/title";
import Loader from "../components/loader";
import MetaTag from "../components/metatag";
import CollapseText from "../components/collapsetext";
import Navigation from "../components/navigation";
import Banner from "../components/banner";
import Promotion from "../components/promotion";
import StayConnected from "../components/stayconnected";
import 'scss/pages/home.scss';

const source = 'home';

function Home(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    const message = 'We are currently offering select services in the United Kingdom and India. Over the coming months we aim to include more services and countries. ';
    const message2 = 'If you have any particular service requirement, that is not currently covered, please ';
    const message3 = 'We\'d be delighted to keep you informed about our roadmap and plan of launching new services. Please stay in touch with us.';

    useEffect(() => {
    }, []);


    const defaultMessage =
        <div className="messagecontainer">
            <div className="defaultmessage">
                <p>{message}</p>
                <p>{message2}<NavLink to="/contact-us">Contact Us</NavLink>.</p>
                <p>{message3}</p>
            </div>
            <StayConnected />
        </div>

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="promotionbar">
                <div className="container">
                    <Promotion />
                </div>
            </div>
            <div className="boxouter">
                <div className="container">
                    <CollapseText header='Looking for something else?' content={defaultMessage}/>
                </div>
            </div>
        </>
    )
}

function Brand() {
    return (
        <div className="brandframe">
            <div className="serveasemap">
                <img src="/images/servease-map.png"  alt="ServEase Map" className="brandpiccontrol"/>
            </div>
            <div className="serveasebrand">
                <p>
                    <label className="serveasebrandtext">
                        ServEase offers easy access of local and cross-border services to expatriates, global diaspora, and people on the move!
                    </label>
                </p>
            </div>
        </div>
    )
}

export default Home