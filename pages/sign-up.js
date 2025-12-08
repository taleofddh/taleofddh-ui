import React, {useEffect} from 'react';
import {serverGet} from "../common/server-config";
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import Registration from "../components/registration";
import {getSessionCookie} from "../common/session";
import ResponsiveNavigation from "../components/responsive-navigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import {HOST_NAME, INDEX_FLAG} from "../common/constants";

const pageTitle = 'Sign up';

function SignUp({ menuList, handleLogout, authenticated, source, index, url }) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'sign up',
                message: 'Sign up Page Accessed'
            }
        );
    }, [ddhomeCountry]);

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="signupframe">
                        <Title message={pageTitle} />
                        <Registration source={source} />
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticProps = async (context) => {
    const source = 'sign-up';
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

export default SignUp;