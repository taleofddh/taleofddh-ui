import React, {useEffect} from 'react';
import {serverGet} from "../common/server-config";
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import LoginForm from "../components/login-form";
import {getSessionCookie} from "../common/session";
import ResponsiveNavigation from "../components/responsive-navigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import {HOST_NAME, INDEX_FLAG} from "../common/constants";

const pageTitle = 'Sign in';

function SignIn({ menuList, handleLogout, authenticated, source, index, url }) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip,
                page: 'sign in',
                message: 'Sign in Page Accessed'
            }
        );
    }, [ddhomeCountry])

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="signinframe">
                        <Title message={pageTitle} />
                        <LoginForm />
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticProps = async (context) => {
    const source = 'sign-in';
    const index = INDEX_FLAG;
    const url = HOST_NAME;

    // Call an external API endpoint to get data
    const menuList = await serverGet('findMenuList', '/menuList', [true]);

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

export default SignIn;