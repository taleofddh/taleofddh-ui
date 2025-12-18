import React, { useState, useEffect } from 'react';
import {useRouter} from "next/router";
import Link from 'next/link';
import {signIn} from 'aws-amplify/auth';
import 'aws-amplify/auth/enable-oauth-listener';
import {useFormFields} from "../common/hook";
import {getSessionCookie} from "../common/session";
import {onError} from "../common/error";
import TypeInput from "./type-input";
import LoaderButton from "./loader-button";
import FacebookButton from "./facebook-button";
import GoogleButton from "./google-button";

function Login() {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const router = useRouter();
    const [redirect, setRedirect] = useState('');
    const [resetPwdProp, setResetPwdProp] = useState({});
    const [signUpProp, setSignUpProp] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        username : '',
        password : '',
        confirmationCode: ''
    });

    useEffect(() => {
        if(!router.isReady) return;
        const params = router.query;
        const redirectValue = params.redirect ? params.redirect.toString() : '';
        //console.log(redirectValue);
        if(redirectValue && redirectValue.length > 0) {
            setRedirect(redirectValue);
            const resetPwdValue = {
                href: {
                    pathname: '/reset-password',
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
                    pathname: '/sign-up',
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
                    pathname: '/reset-password'
                },
                as: {
                    pathname: '/reset-password'
                }
            }
            setResetPwdProp({...resetPwdValue});
            const signUpValue = {
                href: {
                    pathname: '/sign-up'
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
        setIsLoading(true);
        try {
            const {
                isSignedIn,
                nextStep
            } = await signIn({
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
        return fields.username.length > 0 && fields.password.length > 0;
    }

    const handleFederatedLogin = async (response) => {
        //userHasAuthenticated(true);
        console.log(response);
    };

    return (
        <>
            <form key="Login" name="LoginForm" onSubmit={submitLogin}>
                <div className="loginbuttoncontainer">
                    <FacebookButton route={redirect && redirect.length > 0 ? redirect : '/'} />
                </div>
                <div className="loginbuttoncontainer">
                    <GoogleButton route={redirect && redirect.length > 0 ? redirect : '/'} />
                </div>
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
                                    Forgot Password
                                </Link>
                            </p>
                            <p className="signupmessage">
                                <Link {...signUpProp}>
                                    New User Sign-up
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