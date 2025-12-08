import React, {useEffect} from 'react';
import {useRouter} from "next/router";
import {serverGet} from "../common/server-config";
import {HOST_NAME, INDEX_FLAG} from "../common/constants";
import {postAuditEntry} from "../common/common";
import {getSessionCookie} from "../common/session";
import ResponsiveNavigation from "../components/responsive-navigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import HistoricalList from "../components/historical-list";

const pageTitle = 'Blogs'

function Blogs({ menuList, handleLogout, authenticated, historicalBlogData, source, index, url }) {
    const router = useRouter();
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'blog',
                message: 'Blogs Page Accessed'
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
                    <HistoricalList source={source} type='Historical' data={historicalBlogData}/>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticProps = async (context) => {
    const source = 'blogs';
    const index = INDEX_FLAG;
    const url = HOST_NAME;

    // Call an external API endpoint to get data
    const menuList = await serverGet('findMenuList', '/menuList', [true]);

    const historicalBlogData = await serverGet('findHistoricalBlogCategories', '/blogHistoricalCategories');

    // return the data
    return {
        props: {
            menuList,
            historicalBlogData,
            source,
            index,
            url
        },
    }
}


export default Blogs;