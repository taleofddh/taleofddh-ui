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
import GalleryForm from "../../components/gallery-form";

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
                    ipAddress: ddhomeCountry.ip,
                    page: 'user profile',
                    message: 'Gallery Management Page Accessed by ' + getSessionCookie("credential").sub
                }
        );
    }, [ddhomeCountry]);


    useEffect(() => {
        const onLoad = async () => {
            try {
                const {tokens} = await fetchAuthSession({ forceRefresh: true });
                if(tokens) {
                    const res = await get({
                        apiName: 'findAlbums',
                        path: '/albums',
                        options: {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            }
                        }
                    }).response;
                    setData(await res.body.json());
                }
                isLoading(false);
            }
            catch(e) {
                if (e !== 'No current user') {
                    onError(e);
                }
                isLoading(false);
            }
        }
        onLoad();
    }, []);

    return (
            <>
                <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} />
                <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
                <Navigation menus={menuList} />
                <div className="boxouter">
                    <div className="container">
                        <div className="contactusframe">
                            <Title message={pageTitle} />
                            {loading ? (
                                    <Loader loading={loading} />
                            ) : (
                                <div className="contactuscontainer">
                                    <GalleryForm data={data} source={source} />
                                </div>
                            )}
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