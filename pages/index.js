import React from 'react';
import {serverGet} from '../common/server-config';
import {INDEX_FLAG, HOST_NAME, PAGE_REVALIDATE_PERIOD} from '../common/constants';
import { getSessionCookie } from "../common/session";
import Header from '../components/header';
import Navigation from '../components/navigation';
import ResponsiveNavigation from "../components/responsive-navigation";
import Footer from "../components/footer";
import BlogSection from "../components/blog-section";
import Banner from "../components/banner";

function Home({geolocationData, menuList, handleLogout, authenticated, promotionData, technicalBlogData, travelBlogData, recipeBlogData, source, index, url}) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="promotionbar">
                <div className="container">
                    <Banner data={promotionData}/>
                </div>
            </div>
            <div className="boxouter">
                <div className="container">
                    <BlogSection category='Technical' blogs={technicalBlogData} />
                    <BlogSection category='Travel' blogs={travelBlogData} />
                    <BlogSection category='Recipe' blogs={recipeBlogData} />
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticProps = async (context) => {
    const source = 'home';
    const index = INDEX_FLAG;
    const url = HOST_NAME;

    // Call an external API endpoint to get data
    const menuList = await serverGet('findMenuList', '/menuList', [true]);

    const promotionData = await serverGet('findPromotionList', '/promotionList', [true]);

    const technicalBlogData = await serverGet('findCategorizedBlogList', '/blogListCategorized', ['Technical', true]);

    const travelBlogData = await serverGet('findCategorizedBlogList', '/blogListCategorized', ['Travel', true]);

    const recipeBlogData = await serverGet('findCategorizedBlogList', '/blogListCategorized', ['Recipe', true]);

    // return the data
    return {
        props: {
            menuList,
            promotionData,
            technicalBlogData,
            travelBlogData,
            recipeBlogData,
            source,
            index,
            url
        },
        revalidate: PAGE_REVALIDATE_PERIOD, // In seconds
    }
}

export default Home;