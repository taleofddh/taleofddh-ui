import React, { useState, useEffect } from 'react';
import {useRouter} from "next/router";
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import { useFormFields } from "../common/hook";
import { getSessionCookie } from "../common/session";
import { onError } from "../common/error";
import TypeInput from "./type-input";
import LoaderButton from "./loader-button";
import FacebookButton from "./facebook-button";
import GoogleButton from "./google-button";

function Registration() {
    const router = useRouter();
    const [redirect, setRedirect] = useState('');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const [isLoading, setIsLoading] = useState(false);
    const [newUser, setNewUser] = useState(null);

    const [fields, handleFieldChange] = useFormFields({
        username : '',
        password : '',
        confirmPassword: '',
        confirmationCode: ''
    });

    useEffect(() => {
        if(!router.isReady) return;
        const params = router.query;
        const redirectValue = params.redirect ? params.redirect.toString() : '';
        if(redirectValue && redirectValue.length > 0) {
            setRedirect(redirectValue);
        }
    }, [router]);

    const submitRegistration = async (submitEvent) => {
        submitEvent.preventDefault();
        console.log(fields.username);

        setIsLoading(true);
        try {
            const newUser = await signUp({
                username: fields.username,
                password: fields.password,
                attributes : {
                    email: fields.username
                }
            });
            setIsLoading(false);
            setNewUser(newUser);
        } catch (e) {
            if (e.name === 'UsernameExistsException') {
                alert (e.message);
            } else {
                onError(e);
            }
            setIsLoading(false);
        }
    }

    const submitConfirmation = async (submitEvent) => {
        submitEvent.preventDefault();
        setIsLoading(true);
        try {
            await confirmSignUp({
                username: fields.username,
                confirmationCode: fields.confirmationCode
            });
            await signIn({
                username: fields.username,
                password: fields.password
            });
            setIsLoading(false);
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    const validateForm = () => {
        const emailRegex = RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');
        const passwordRegex = RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w\\s]).{8,}$');
        return fields.username.match(emailRegex)
            && fields.password.match(passwordRegex)
            && fields.password === fields.confirmPassword;
    }

    const validateConfirmationForm = () => {
        return fields.confirmationCode.length > 0;
    }

    const renderForm = () => {
        return (
            <form key="RegistrationForm" name="RegistrationForm" onSubmit={submitRegistration}>
                <div className="registrationbuttoncontainer">
                    <FacebookButton route={redirect && redirect.length > 0 ? redirect : '/'} />
                </div>
                <div className="registrationbuttoncontainer">
                    <GoogleButton route={redirect && redirect.length > 0 ? redirect : '/'} />
                </div>
                <hr />
                <div className="registrationcontainer">
                    <div className="registrationfieldcontainer">
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
                                   title="Username must be a valid email id like user@domain"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="registrationfieldcontainer">
                        <TypeInput id="2"
                                   name="password"
                                   label="Password"
                                   type="password"
                                   disabled={false}
                                   required={true}
                                   initialValue=""
                                   value={fields.password}
                                   maxLength={15}
                                   placeHolder=""
                                   pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$"
                                   title="Password must be 8-15 characters with uppercase letters, lowercase letters, special characters, numbers"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="registrationfieldcontainer">
                        <TypeInput id="3"
                                   name="confirmPassword"
                                   label="Confirm Password"
                                   type="password"
                                   disabled={false}
                                   required={true}
                                   initialValue=""
                                   value={fields.confirmPassword}
                                   placeHolder=""
                                   pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$"
                                   onChange={handleFieldChange} />
                    </div>
                </div>
                <div className="registrationbuttoncontainer">
                    <LoaderButton name="RegisterButton"
                                  type="submit"
                                  label="Register"
                                  disabled={!validateForm()}
                                  isLoading={isLoading}
                                  onClick={submitRegistration} />
                </div>
            </form>
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
                                      isLoading={isLoading}
                                      onClick={submitConfirmation} />
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

export default Registration;