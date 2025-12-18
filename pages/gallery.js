import React, {useEffect} from 'react';
import {serverGet} from "../common/server-config";
import 'aws-amplify/auth/enable-oauth-listener';
import {PAGE_REVALIDATE_PERIOD, HOST_NAME, INDEX_FLAG} from "../common/constants";
import { getSessionCookie } from "../common/session";
import Header from '../components/header';
import Navigation from '../components/navigation';
import ResponsiveNavigation from "../components/responsive-navigation";
import Footer from "../components/footer";
import {postAuditEntry} from "../common/common";
import PhotoCollection from "../components/photo-collection";
import HistoricalList from "../components/historical-list";

const pageTitle = "Gallery";

function Gallery({menuList, handleLogout, authenticated, recentAlbumData, historicalAlbumData, source, index, url}) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {

        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip,
                page: 'albums',
                message: 'Gallery Page Accessed'
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
                    <PhotoCollection albums={recentAlbumData} source={source} type='Recent' />
                    <HistoricalList source={source} type='Historical' data={historicalAlbumData}/>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticProps = async ({context}) => {
    const source = 'gallery';
    const index = INDEX_FLAG;
    const url = HOST_NAME;

    // Call an external API endpoint to get data
    const menuList = await serverGet('findMenuList', '/menuList', [true]);

    const recentAlbumData = await serverGet('findRecentAlbumNames', '/albumRecentNames');

    const historicalAlbumData = await serverGet('findHistoricalAlbumCategories', '/albumHistoricalCategories');

    // return the data
    return {
        props: {
            menuList,
            recentAlbumData,
            historicalAlbumData,
            source,
            index,
            url
        },
        revalidate: PAGE_REVALIDATE_PERIOD, // In seconds
    }
}

export default Gallery;