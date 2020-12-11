import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, {useEffect} from 'react';
import {useApi} from "../common/hook";
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import MetaTag from "../components/metatag";
import Login from "../components/login";
import '../../scss/pages/signin.scss';
import {getSessionCookie} from "../common/session";

const pagetitle = 'Sign in';
const source = 'sign-in';

function SignIn(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'sign in',
                message: 'Sign in Page Accessed'
            }
        );
    })

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="boxouter">
                <div className="container">
                    <div className="signinframe">
                        <Title message={pagetitle} />
                        <Login api={api} source={source} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignIn;