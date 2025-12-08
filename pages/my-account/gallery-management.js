import React, {useState, useEffect} from 'react';
import {serverGet} from "../../common/server-config";
import {get} from "aws-amplify/api";
import {fetchAuthSession, fetchUserAttributes} from "aws-amplify/auth";
import {getSessionCookie, useSessionContext} from "../../common/session";
import Title from "../../components/title";
import {HOST_NAME, INDEX_FLAG} from "../../common/constants";
import ResponsiveNavigation from "../../components/responsive-navigation";
import Header from "../../components/header";
import Navigation from "../../components/navigation";
import Loader from "../../components/loader";
import {postAuditEntry} from "../../common/common";
import Footer from "../../components/footer";

const pageTitle = 'Gallery Management';

function GalleryManagement({menuList, handleLogout, authenticated, source, index, url}) {
    const [data, setData] = useState({});
    const [loading, isLoading] = useState(true);
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
                {
                    date: new Date(),
                    hostName: window.location.hostname,
                    countryCode: ddhomeCountry.country_code,
                    ipAddress: ddhomeCountry.ip_address,
                    page: 'user profile',
                    message: 'Gallery Management Page Accessed by ' + getSessionCookie("credential").sub
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
                        <div className="userprofileframe">
                            <Title message={pageTitle} />
                        </div>
                    </div>
                </div>
                <Footer menus={menuList} />
            </>
    )
}

// This function gets called at build time
export const getStaticProps = async ({ params }) => {
    const source = 'my-account';
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

export default GalleryManagement;