import React, {useEffect} from 'react';
import {serverGet} from "../../common/server-config";
import {hasPermission} from "../../common/permissions";
import NoAccess from "../../components/no-access";
import {getSessionCookie} from "../../common/session";
import Title from "../../components/title";
import {HOST_NAME, INDEX_FLAG} from "../../common/constants";
import ResponsiveNavigation from "../../components/responsive-navigation";
import Header from "../../components/header";
import Navigation from "../../components/navigation";
import {postAuditEntry} from "../../common/common";
import Footer from "../../components/footer";
import EmailAdmin from "../../components/email-admin";
const pageTitle = 'Administration';
// Granted only to admins by the admin service; gallery and blog managers do not get it.
// Keep in step with the Administration entry in MY_ACCOUNT_MENU.
const PERMISSION = 'messages:findMessageList';
function Administration({menuList, handleLogout, authenticated, permissions}) {
    const allowed = hasPermission(permissions, PERMISSION);
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip,
                page: 'administration',
                message: 'Administration Page Accessed by ' + getSessionCookie("credential").sub
            }
        );
    }, [ddhomeCountry]);
    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="adminframe">
                        {!allowed ? (
                            <NoAccess title={pageTitle} />
                        ) : (
                            <>
                                <Title message={pageTitle} />
                                <div className="admincontainer">
                                    <EmailAdmin />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}
// This function gets called at build time
export const getStaticProps = async () => {
    const source = 'my-account';
    const index = INDEX_FLAG;
    const url = HOST_NAME;
    const menuList = await serverGet('findMenuList', '/menuList', [true]);
    return {
        props: {
            menuList,
            source,
            index,
            url
        },
    }
}
export default Administration;
