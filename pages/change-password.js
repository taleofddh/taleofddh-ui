import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {runWithAmplifyServerContext} from "../common/server-config";
import {get} from "aws-amplify/api/server";
import {updatePassword} from "aws-amplify/auth";
import {useFormFields} from "../common/hook";
import {postAuditEntry} from "../common/common";
import {getSessionCookie} from "../common/session";
import { onError } from "../common/error";
import TypeInput from "../components/type-input";
import Title from "../components/title";
import LoaderButton from "../components/loader-button";
import Footer from "../components/footer";
import ResponsiveNavigation from "../components/responsive-navigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import {HOST_NAME, INDEX_FLAG} from "../common/constants";

const pageTitle = 'Change Password';

function ChangePassword({ menuList, handleLogout, authenticated, source, index, url }) {
    const router = useRouter();
    const [fields, handleFieldChange] = useFormFields({
        oldPassword: '',
        password: '',
        confirmPassword: '',
    });
    const [isChanging, setIsChanging] = useState(false);
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
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
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="changepasswordframe">
                        <Title message={pageTitle} />
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
    const source = 'change-password';
    const index = INDEX_FLAG;
    const url = HOST_NAME;

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
            source,
            index,
            url
        },
    }
}

export default ChangePassword;
