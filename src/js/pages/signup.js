import React, {useEffect} from 'react';
import {useApi} from "../common/hook";
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import MetaTag from "../components/metatag";
import Registration from "../components/registration";
import '../../scss/pages/signup.scss';
import {getSessionCookie} from "../common/session";

const pagetitle = 'Sign up';
const source = 'sign-up';

function SignUp(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'sign up',
                message: 'Sign up Page Accessed'
            }
        );
    }, []);

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="boxouter">
                <div className="container">
                    <div className="signupframe">
                        <Title message={pagetitle} />
                        <Registration api={api} source={source} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp;