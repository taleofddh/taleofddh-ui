import React, { useState, useEffect } from 'react';
import {useRouter} from "next/router";
import Link from 'next/link';
import { Auth, API } from 'aws-amplify';
import {useFormFields} from "../common/hook";
import {useSessionContext, getSessionCookie, setSessionCookie} from "../common/session";
import {onError} from "../common/error";
import TypeInput from "./typeInput";
import LoaderButton from "./loaderbutton";
import FacebookButton from "./facebookbutton";
import GoogleButton from "./googlebutton";

function Login() {
    const router = useRouter();
    const { userHasAuthenticated } = useSessionContext();
    const [redirect, setRedirect] = useState('');
    const [resetPwdProp, setResetPwdProp] = useState({});
    const [signUpProp, setSignUpProp] = useState({});
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const [isLoading, setIsLoading] = useState(false);
    const [newUser, setNewUser] = useState(null);
    const [fields, handleFieldChange] = useFormFields({
        username : '',
        password : '',
        confirmationCode: ''
    });

    useEffect(() => {
        if(!router.isReady) return;
        const params = router.query;
        const redirectValue = params.redirect;
        if(redirectValue !== undefined && redirectValue.length > 0) {
            setRedirect(redirectValue);
            const resetPwdValue = {
                href: {
                    pathname: '/resetpassword',
                    query: { redirect: redirectValue}
                },
                as: {
                    pathname: '/reset-password',
                    query: { redirect: redirectValue}
                }
            }
            setResetPwdProp({...resetPwdValue});
            const signUpValue = {
                href: {
                    pathname: '/signup',
                    query: { redirect: redirectValue}
                },
                as: {
                    pathname: '/sign-up',
                    query: { redirect: redirectValue}
                }
            }
            setSignUpProp({...signUpValue});
        } else {
            const resetPwdValue = {
                href: {
                    pathname: '/resetpassword'
                },
                as: {
                    pathname: '/reset-password'
                }
            }
            setResetPwdProp({...resetPwdValue});
            const signUpValue = {
                href: {
                    pathname: '/signup'
                },
                as: {
                    pathname: '/sign-up'
                }
            }
            setSignUpProp({...signUpValue});
        }
    }, [router]);

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
            setIsLoading(false);
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
        return fields.username.length > 0 && fields.password.length > 0;
    }

    const handleFederatedLogin = async (response) => {
        //userHasAuthenticated(true);
        console.log(response);
    };

    return (
        <>
            <form key="LoginForm" name="LoginForm" onSubmit={submitLogin}>
                <div className="loginbuttoncontainer">
                    <FacebookButton
                        onLogin={handleFederatedLogin} route={redirect.length > 0 ? redirect : '/'} />
                </div>
                <div className="loginbuttoncontainer">
                    <GoogleButton
                        onLogin={handleFederatedLogin} route={redirect.length > 0 ? redirect : '/'} />
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
                                   title="Username must be a valid email id like user@domain"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="loginfieldcontainer">
                        <TypeInput id="2"
                                   name="password"
                                   label="Password"
                                   type="password"
                                   disabled={false}
                                   required={true}
                                   maxLength={15}
                                   initialValue=""
                                   value={fields.password}
                                   placeHolder=""
                                   pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$"
                                   title="Password must be 8-15 characters with uppercase letters, lowercase letters, special characters, numbers"
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
                {Object.keys(resetPwdProp).length !== 0 && Object.keys(signUpProp).length !== 0 ? (
                    <div className="signinmessagecontainer">
                        <div className="loginmessagecontainer">
                            <p className="forgotpasswordmessage">
                                <Link {...resetPwdProp}>
                                    <a>Forgot Password</a>
                                </Link>
                            </p>
                            <p className="signupmessage">
                                <Link {...signUpProp}>
                                    <a>New User Sign-up</a>
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </form>
        </>
    )
}

export default Login;