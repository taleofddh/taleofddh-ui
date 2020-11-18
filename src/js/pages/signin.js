import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import {useApi} from "../common/hook";
import Title from "../components/title";
import MetaTag from "../components/metatag";
import Login from "../components/login";
import '../../scss/pages/signin.scss';

const pagetitle = 'Sign in';
const source = 'sign-in';

function SignIn(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');

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