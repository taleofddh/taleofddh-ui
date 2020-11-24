import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, { useState } from 'react';
import { NavLink, withRouter, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import CryptoApi from 'crypto-api/src/crypto-api';
import { useApi, useFormFields } from "../common/hook";
import {useSessionContext, getSessionCookie} from "../common/session";
import {onError} from "../common/error";
import TypeInput from "../components/typeInput";
import CheckBox from "./checkbox";
import LoaderButton from "./loaderbutton";
import '../../scss/components/login.scss';

function Login(props) {
    const history = useHistory();
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
        if(validateForm()) {
            setIsLoading(true);
            try {
                await Auth.signIn(fields.username, fields.password);
                userHasAuthenticated(true);
                history.push("/");
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
                        history.push("/");
                    } else {
                        throw new Error("Invalid username or password");
                    }
                } catch (ex) {
                    onError(ex);
                    setIsLoading(false);
                }
            }
        } else {
            alert('Please check your username and password requirement')
        }
    }

    const validateForm = () => {
        return fields.username.length > 0 && fields.password.length > 0;
    }

    return (
        <>
            <div className="logincontainer">
                <form key="LoginForm" name="LoginForm" onSubmit={submitLogin}>
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
                    <div className="remembermecontainer">
                        <CheckBox id="3"
                                  name="isRemember"
                                  label="Remember Me"
                                  value={fields.isRemember}
                                  disabled={false}
                                  required={false}
                                  initialState={false}
                                  onChange={handleFieldChange} />
                    </div>
                    <div className="forgotpasswordcontainer">
                        <NavLink to="/forgot-password">Forgot Password</NavLink>
                    </div>
                </form>
            </div>
            <div className="loginbuttoncontainer">
                <LoaderButton name="LoginButton"
                          label="Login"
                          disabled={!validateForm}
                          isLoading={isLoading}
                          onClick={submitLogin} />
            </div>
            <div className="signupmessagecontainer">
                <p className="signupmessage">
                    Don't have an account yet? Please <NavLink to="/sign-up">Sign-up</NavLink>
                </p>
            </div>
        </>
    )
}

export default withRouter(Login);