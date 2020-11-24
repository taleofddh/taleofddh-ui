import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import {useApi} from "../common/hook";
import Title from "../components/title";
import MetaTag from "../components/metatag";
import Registration from "../components/registration";
import '../../scss/pages/signup.scss';

const pagetitle = 'Sign up';
const source = 'sign-up';

function SignUp(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');

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