import React, { useState, useEffect } from 'react';
import {useRouter} from "next/router";
import { Auth, API } from 'aws-amplify';
import { useFormFields } from "../common/hook";
import { useSessionContext, getSessionCookie, setSessionCookie } from "../common/session";
import { onError } from "../common/error";
import TypeInput from "./typeInput";
import LoaderButton from "./loaderbutton";
import FacebookButton from "./facebookbutton";
import GoogleButton from "./googlebutton";

function Registration() {
    const router = useRouter();
    const { userHasAuthenticated } = useSessionContext();
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
        const redirectValue = params.redirect;
        setRedirect(redirectValue);
    }, [router]);

    const submitRegistration = async (submitEvent) => {
        submitEvent.preventDefault();
        console.log(fields.username);

        setIsLoading(true);
        try {
            const newUser = await Auth.signUp({
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
            if(redirect && redirect !== undefined && redirect.length > 0) {
                await router.push(redirect,
                    redirect
                );
            } else {
                await router.push('/home',
                    '/'
                );
            }
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

    const handleFederatedLogin = async (response) => {
        //userHasAuthenticated(true);
        console.log(response);
    };

    const renderForm = () => {
        return (
            <form key="LoginForm" name="LoginForm" onSubmit={submitRegistration}>
                <div className="registrationbuttoncontainer">
                    <FacebookButton
                        onLogin={handleFederatedLogin} />
                </div>
                <div className="registrationbuttoncontainer">
                    <GoogleButton
                        onLogin={handleFederatedLogin} />
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