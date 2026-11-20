import React, {useState, useEffect} from 'react';
import {serverGet} from "../../common/server-config";
import {adminGet, isForbidden} from "../../common/admin-api";
import {hasPermission} from "../../common/permissions";
import {onError} from "../../common/error";
import NoAccess from "../../components/no-access";
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

function GalleryManagement({menuList, handleLogout, authenticated, permissions, source, index, url}) {
    const [data, setData] = useState({});
    const [loading, isLoading] = useState(true);
    const [forbidden, setForbidden] = useState(false);
    const allowed = hasPermission(permissions, 'gallery:findAlbums') && !forbidden;
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
                if (hasPermission(permissions, 'gallery:findAlbums')) {
                    const res = await adminGet('findAlbums', '/albums');
                    setData(await res.body.json());
                }
                isLoading(false);
            }
            catch(e) {
                if (isForbidden(e)) {
                    setForbidden(true);
                } else if (e !== 'No current user') {
                    onError(e);
                }
                isLoading(false);
            }
        }
        onLoad();
    }, [permissions]);

    return (
            <>
                <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
                <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
                <Navigation menus={menuList} />
                <div className="boxouter">
                    <div className="container">
                        <div className="contactusframe">
                            {!allowed ? (
                                <NoAccess title={pageTitle} />
                            ) : loading ? (
                                <>
                                    <Title message={pageTitle} />
                                    <Loader loading={loading} />
                                </>
                            ) : (
                                <>
                                <Title message={pageTitle} />
                                <div className="contactuscontainer">
                                    <GalleryForm data={data} source={source} permissions={permissions} />
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