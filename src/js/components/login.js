import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, { useState } from 'react';
import { NavLink, withRouter, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import CryptoApi from 'crypto-api/src/crypto-api';
import { useApi, usePost} from "../common/hook";
import {useSessionContext, getSessionCookie} from "../common/session";
import {onError} from "../common/error";
import TypeInput from "../components/typeInput";
import CheckBox from "./checkbox";
import Button from "../components/button";
import Loader from "./loader";
import '../../scss/components/login.scss';
import LoaderButton from "./loaderbutton";

function Login(props) {
    const history = useHistory();
    const { userHasAuthenticated } = useSessionContext();
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const hasher = CryptoApi.getHasher('ripemd256');
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        username : '',
        password : '',
        isRemember: false
    });
    const [errors, setErrors] = useState({
        username : 'Email is not valid',
        password : 'Password is not valid'
    });

    const handleInputChange = (changeEvent) => {
        const name = changeEvent.target.name;
        const value = changeEvent.target.type === 'checkbox' ? changeEvent.target.checked : changeEvent.target.value;
        const emailRegex = RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');
        const passwordRegex = RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w\\s]).{8,}$');
        let formErrors = errors;

        switch (name) {
            case 'username':
                formErrors.username =
                    value.match(emailRegex)
                        ? ''
                        : 'Username is not valid';
                break;
            case 'password':
                formErrors.password =
                    value.match(passwordRegex)
                        ? ''
                        : 'Password is not Valid';
                break;
            default:
                break;
        }

        setForm({...form, [name] : value});
        setErrors(formErrors);
    }

    const submitLogin = async (submitEvent) => {
        submitEvent.preventDefault();
        console.log(form.username);
        if(validateForm(errors)) {
            /*let user = {
                username: form.username,
                password: form.password
            }

            props.history.push('/' + props.source + '-acknowledgement', {
                api: api,
                source: props.source,
                index: index,
                user: user
            });*/
            setIsLoading(true);
            try {
                await Auth.signIn(form.username, form.password);
                userHasAuthenticated(true);
                history.push("/");
            } catch (e) {
                try {
                    hasher.update(form.password);
                    let hashedPassword = CryptoApi.encoder.toHex(hasher.finalize()).toUpperCase();
                    console.log(hashedPassword);
                    let headers = {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    };
                    let data = {
                        username: form.username,
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
            alert('Invalid Form. Please check your username and password requirement')
        }
    }

    const validateForm = (errors) => {
        let valid = true;
        Object.values(errors).forEach(
            // if we have an error string set valid to false
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
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
                                   value={form.username}
                                   placeHolder=""
                                   pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                   onChange={handleInputChange} />
                    </div>
                    <div className="loginfieldcontainer">
                        <TypeInput id="2"
                                   name="password"
                                   label="Password"
                                   type="password"
                                   disabled={false}
                                   required={true}
                                   initialValue=""
                                   value={form.password}
                                   placeHolder=""
                                   pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$"
                                   onChange={handleInputChange} />
                    </div>
                    <div className="remembermecontainer">
                        <CheckBox id="3"
                                  name="isRemember"
                                  label="Remember Me"
                                  value={form.isRemember}
                                  disabled={false}
                                  required={false}
                                  initialState={false}
                                  onChange={handleInputChange} />
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