import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {runWithAmplifyServerContext} from "../common/serverconfig";
import {get} from "aws-amplify/api/server";
import {updatePassword} from "aws-amplify/auth";
import {useIndex, useFormFields} from "../common/hook";
import {postAuditEntry} from "../common/common";
import {getSessionCookie} from "../common/session";
import { onError } from "../common/error";
import TypeInput from "../components/typeInput";
import MetaTag from "../components/metatag";
import Title from "../components/title";
import LoaderButton from "../components/loaderbutton";
import Footer from "../components/footer";
import ResponsiveNavigation from "../components/responsivenavigation";
import Header from "../components/header";
import Navigation from "../components/navigation";

const pagetitle = 'Change Password';
const source = 'change-password';

function ChangePassword({ menuList, handleLogout }) {
    const router = useRouter();
    const index = useIndex();
    const [url, setUrl] = useState('');
    const [fields, handleFieldChange] = useFormFields({
        oldPassword: '',
        password: '',
        confirmPassword: '',
    });
    const [isChanging, setIsChanging] = useState(false);
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        if(typeof window !== 'undefined'){
            setUrl(window.location.protocol + '//' + window.location.host);
        }
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'change password',
                message: 'Change Password Page Accessed by ' + getSessionCookie("credential").identityId
            }
        );
    }, [ddhomeCountry])

    const handleChangeClick = async (event) => {
        event.preventDefault();
        setIsChanging(true);
        try {
            await updatePassword({
                oldPassword: fields.oldPassword,
                newPassword: fields.password
            });
            alert("Password has been successfully changed");
            await router.push("/user-profile",
                "/user-profile"
            );
            setIsChanging(true);
        } catch (error) {
            onError(error);
            setIsChanging(false);
        }
    }

    const validateForm = () => {
        return (
            fields.oldPassword.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <MetaTag page={source} index={index} url={url} />
            <div className="boxouter">
                <div className="container">
                    <div className="changepasswordframe">
                        <Title message={pagetitle} />
                        <form key="ChangePasswordForm" name="ChangePasswordForm" onSubmit={handleChangeClick}>
                            <div className="changepasswordcontainer">
                                <div className="changepasswordfieldcontainer">
                                    <TypeInput id="1"
                                               name="oldPassword"
                                               label="Old Password"
                                               type="password"
                                               disabled={false}
                                               required={true}
                                               initialValue=""
                                               value={fields.oldPassword}
                                               placeHolder=""
                                               pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$"
                                               onChange={handleFieldChange} />
                                </div>
                                <div className="changepasswordfieldcontainer">
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
                                <div className="changepasswordfieldcontainer">
                                    <TypeInput id="3"
                                               name="confirmPassword"
                                               label="Confirm Password"
                                               type="password"
                                               disabled={false}
                                               required={true}
                                               initialValue=""
                                               value={fields.confirmPassword}
                                               placeHolder=""
                                               pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$"
                                               onChange={handleFieldChange} />
                                </div>
                            </div>
                            <div className="changepasswordbuttoncontainer">
                                <LoaderButton name="ChangeButton"
                                              type="submit"
                                              label="Change"
                                              disabled={!validateForm()}
                                              isLoading={isChanging} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    );
}

// This function gets called at build time
export const getStaticProps = async (context) => {
    // Call an external API endpoint to get data
    const menuList = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findMenuList',
                    path: '/menuList/true',
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                }).response;
                return body.json();
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    });

    // return the data
    return {
        props: {
            menuList,
        },
    }
}

export default ChangePassword;
