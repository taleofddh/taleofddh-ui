'use strict';

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useApi} from "../common/hook";
import {getSessionCookie} from "../common/session";
import TypeInput from "../components/typeInput";
import Button from "../components/button";
import '../../scss/components/login.scss';

function Login(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    const [form, setForm] = useState({
        username : '',
        password : ''
    });
    const [errors, setErrors] = useState({
        username : 'Username is not valid',
        password : 'Password is not valid'
    });

    const handleInputChange = (changeEvent) => {
        const name = changeEvent.target.name;
        const value = changeEvent.target.value;
        const usernameRegex = RegExp('^[A-Za-z0-9 ]{1,20}$');
        const passwordRegex = RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
        let formErrors = errors;

        switch (name) {
            case 'username':
                formErrors.username =
                    value.match(usernameRegex)
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

    const submitLogin = (submitEvent) => {
        submitEvent.preventDefault();
        console.log(form.username);
        if(validateForm(errors)) {
            let user = {
                username: form.username,
                password: form.password
            }

            props.history.push('/' + props.source + '-acknowledgement', {
                api: api,
                source: props.source,
                index: index,
                user: user
            });

        } else {
            alert('Invalid Form. Please complete mandatory fields correctly marked with *')
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
                                   type="text"
                                   disabled={false}
                                   required={true}
                                   maxLength={50}
                                   initialValue=""
                                   value={form.username}
                                   placeHolder=""
                                   pattern="^[A-Za-z0-9 ]{1,50}$"
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
                                   pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                   onChange={handleInputChange} />
                    </div>
                </form>
            </div>
            <div className="loginbuttoncontainer">
                <Button name="LoginButton"
                        label="Login"
                        disabled={true}
                        onClick={submitLogin} />
            </div>
        </>
    )
}

export default withRouter(Login);