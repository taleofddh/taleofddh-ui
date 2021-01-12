import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { useState } from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import { Auth, API } from 'aws-amplify';
import CryptoApi from 'crypto-api/src/crypto-api';
import {useApi, useFormFields} from "../common/hook";
import {useSessionContext, getSessionCookie, setSessionCookie} from "../common/session";
import {onError} from "../common/error";
import TypeInput from "../components/typeInput";
import LoaderButton from "./loaderbutton";
import FacebookButton from "./facebookbutton";
import '../../scss/components/login.scss';

function Login(props) {
    const { userHasAuthenticated } = useSessionContext();
    const history = useHistory();
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const hasher = CryptoApi.getHasher('ripemd256');
    const [isLoading, setIsLoading] = useState(false);
    const [newUser, setNewUser] = useState(null);

    const [fields, handleFieldChange] = useFormFields({
        username : '',
        password : '',
        confirmationCode: ''
    });

    const submitLogin = async (submitEvent) => {
        submitEvent.preventDefault();
        console.log(fields.username);

        setIsLoading(true);
        try {
            await Auth.signIn(fields.username, fields.password);
            userHasAuthenticated(true);
            const credentials = await Auth.currentUserCredentials();
            setSessionCookie("credential", {identityId: credentials.identityId});
            await API.put("updateUserProfile", "/updateUserProfile", {
                response: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: {identityId: credentials.identityId, lastLogin: new Date()},
            });
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
                let validUser = await API.post(
                    "findUser",
                    "/findUser",
                    {
                        response: true,
                        headers : headers,
                        body: data
                    }
                );
                console.log(validUser);
                let json = await validUser.data;
                if(json) {
                    const newUser = await Auth.signUp({
                        username: fields.username,
                        password: fields.password,
                    });
                    setIsLoading(false);
                    setNewUser(newUser);
                } else {
                    throw new Error("Invalid username or password");
                }
            } catch (ex) {
                onError(ex);
                setIsLoading(false);
            }
        }
    }

    const submitConfirmation = async (submitEvent) => {
        submitEvent.preventDefault();
        setIsLoading(true);
        try {
            await Auth.confirmSignUp(fields.username, fields.confirmationCode);
            await Auth.signIn(fields.username, fields.password);
            userHasAuthenticated(true);
            const credentials = await Auth.currentUserCredentials();
            setSessionCookie("credential", {identityId: credentials.identityId});
            await API.post("createUserProfile", "/createUserProfile", {
                response: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: {email: fields.username, identityId: credentials.identityId, updatedAt: new Date(), lastLogin: new Date()},
            });
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    const validateForm = () => {
        return fields.username.length > 0 && fields.password.length > 0;
    }

    const validateConfirmationForm = () => {
        return fields.confirmationCode.length > 0;
    }

    const handleFbLogin = async () => {
        userHasAuthenticated(true);
    };

    const renderForm = () => {
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

    const renderConfirmationForm = () => {
        return (
            <>
                <form key="RegistrationForm" name="RegistrationForm" onSubmit={submitConfirmation}>
                    <div className="registrationcontainer">
                        <div className="registrationfieldcontainer">
                            <TypeInput id="1"
                                       name="confirmationCode"
                                       label="Confirmation Code"
                                       type="number"
                                       disabled={false}
                                       required={true}
                                       maxLength={20}
                                       initialValue=""
                                       value={fields.confirmationCode}
                                       placeHolder=""
                                       pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                       onChange={handleFieldChange} />
                        </div>
                    </div>
                    <div className="registrationbuttoncontainer">
                        <LoaderButton name="ConfirmCodeButton"
                                      type="submit"
                                      label="Confirm Code"
                                      disabled={!validateConfirmationForm()}
                                      isLoading={isLoading} />
                    </div>
                </form>
            </>
        )
    }

    return (
        <>
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </>
    )
}

export default Login;