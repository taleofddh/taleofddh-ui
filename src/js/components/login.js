import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, { useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import CryptoApi from 'crypto-api/src/crypto-api';
import { useApi, useFormFields } from "../common/hook";
import {useSessionContext, getSessionCookie} from "../common/session";
import {onError} from "../common/error";
import TypeInput from "../components/typeInput";
import LoaderButton from "./loaderbutton";
import FacebookButton from "./facebookbutton";
import '../../scss/components/login.scss';

function Login(props) {
    const { userHasAuthenticated } = useSessionContext();
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const hasher = CryptoApi.getHasher('ripemd256');
    const [isLoading, setIsLoading] = useState(false);

    const [fields, handleFieldChange] = useFormFields({
        username : '',
        password : '',
        isRemember: false
    });

    const submitLogin = async (submitEvent) => {
        submitEvent.preventDefault();
        console.log(fields.username);

        setIsLoading(true);
        try {
            await Auth.signIn(fields.username, fields.password);
            userHasAuthenticated(true);
        } catch (e) {
            try {
                hasher.update(fields.password);
                let hashedPassword = CryptoApi.encoder.toHex(hasher.finalize()).toUpperCase();
                //console.log(hashedPassword);
                let headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                };
                let data = {
                    username: fields.username,
                    password: hashedPassword
                }
                let validUser = await fetch(api + '/auth/findUser', { method: 'POST', headers : headers, body: JSON.stringify(data) });
                let json = await validUser.json();
                if(json) {
                    userHasAuthenticated(true);
                } else {
                    throw new Error("Invalid username or password");
                }
            } catch (ex) {
                onError(ex);
                setIsLoading(false);
            }
        }

    }

    const validateForm = () => {
        console.log("fields.username.length", fields.username.length);
        return fields.username.length > 0 && fields.password.length > 0;
    }

    const handleFbLogin = () => {
        userHasAuthenticated(true);
    };

    return (
        <>
            <form key="LoginForm" name="LoginForm" onSubmit={submitLogin}>
                <div className="loginbuttoncontainer">
                    <FacebookButton
                        onLogin={handleFbLogin} />
                </div>
                <hr />
                <div className="logincontainer">
                    <div className="loginfieldcontainer">
                        <TypeInput id="1"
                                   name="username"
                                   label="Username"
                                   type="email"
                                   disabled={false}
                                   required={true}
                                   maxLength={50}
                                   initialValue=""
                                   value={fields.username}
                                   placeHolder=""
                                   pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="loginfieldcontainer">
                        <TypeInput id="2"
                                   name="password"
                                   label="Password"
                                   type="password"
                                   disabled={false}
                                   required={true}
                                   initialValue=""
                                   value={fields.password}
                                   placeHolder=""
                                   pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$"
                                   onChange={handleFieldChange} />
                    </div>
                </div>
                <div className="loginbuttoncontainer">
                    <LoaderButton name="LoginButton"
                                  label="Login"
                                  type="submit"
                                  disabled={!validateForm()}
                                  isLoading={isLoading} />
                </div>
                <div className="signupmessagecontainer">
                    <p className="messagecontainer">
                        <span className="forgotpasswordmessage"><NavLink to="/reset-password">Forgot Password</NavLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span className="signupmessage">Don't have an account yet? Please <NavLink to="/sign-up">Sign-up</NavLink></span>
                    </p>
                </div>
            </form>
        </>
    )
}

export default withRouter(Login);