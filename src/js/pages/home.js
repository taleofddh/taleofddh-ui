import React, {useEffect} from 'react';
import { NavLink } from "react-router-dom";
import {getSessionCookie} from "../common/session";
import {useIndex} from "../common/hook";
import {postAuditEntry} from "../common/common";
import MetaTag from "../components/metatag";
import CollapseText from "../components/collapsetext";
import Promotion from "../components/promotion";
import StayConnected from "../components/stayconnected";
import BlogSection from "../components/blogsection";
import '../../scss/pages/home.scss';

const source = 'home';

function Home(props) {
    const index = useIndex(window.location.hostname, window.location.protocol);
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    const message = 'We are currently offering select services in the United Kingdom and India. Over the coming months we aim to include more services and countries. ';
    const message2 = 'If you have any particular service requirement, that is not currently covered, please ';
    const message3 = 'We\'d be delighted to keep you informed about our roadmap and plan of launching new services. Please stay in touch with us.';

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'home',
                message: 'Home Page Accessed'
            }
        );
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
                    <BlogSection category="Technical"/>
                    <BlogSection category="Travel"/>
                    <BlogSection category="Recipe"/>
                    <div className="collapseframe">
                        <CollapseText header='Looking for something else?' content={defaultMessage}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;