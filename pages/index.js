import React, {useEffect, useState} from 'react';
import {API} from "aws-amplify";
import Link from "next/link";
import { useIndex } from '../common/hook';
import { getSessionCookie } from "../common/session";
import Header from '../components/header';
import Navigation from '../components/navigation';
import ResponsiveNavigation from "../components/responsivenavigation";
import Footer from "../components/footer";
import MetaTag from "../components/metatag";
import CollapseText from "../components/collapsetext";
import StayConnected from '../components/stayconnected';
import BlogSection from "../components/blogsection";
import Promotion from "../components/promotion";

const source = 'home';

function Home({geolocationData, ddhomeCountryCallBack, menuList, handleLogout, promotionData, technicalBlogData, travelBlogData, recipeBlogData}) {
    const index = useIndex();
    const [url, setUrl] = useState('');
    useEffect(() => {
        if(typeof window !== 'undefined'){
            setUrl(window.location.protocol + '//' + window.location.host);
        }
    }, []);
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const message = 'We are currently offering select services in the United Kingdom and India. Over the coming months we aim to include more services and countries. ';
    const message2 = 'If you have any particular service requirement, that is not currently covered, please ';
    const message3 = 'We\'d be delighted to keep you informed about our roadmap and plan of launching new services. Please stay in touch with us.';

    const defaultMessage =
        <div className="messagecontainer">
            <div className="defaultmessage">
                <p>{message}</p>
                <p>{message2}<Link href="/contact-us">Contact Us</Link>.</p>
                <p>{message3}</p>
            </div>
            <StayConnected />
        </div>

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <MetaTag page={source} index={index} url={url} />
            <div className="promotionbar">
                <div className="container">
                    <Promotion data={promotionData}/>
                </div>
            </div>
            <div className="boxouter">
                <div className="container">
                    <BlogSection category='Technical' blogs={technicalBlogData} />
                    <BlogSection category='Travel' blogs={travelBlogData} />
                    <BlogSection category='Recipe' blogs={recipeBlogData} />
                    <div className="collapseframe">
                        <CollapseText header='Looking for something else?' content={defaultMessage}/>
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticProps = async (context) => {
    // Call an external API endpoint to get data
    let res = await API.get(
        'findMenuList',
        '/menuList/true',
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );
    const menuList = await res.data;

    res = await API.get(
        'findPromotionList',
        '/promotionList/true',
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );
    const promotionData = await res.data;

    res = await API.post(
        'findCategorizedBlogList',
        '/blogListCategorized',
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: {
                category: 'Technical',
                homePageFlag: true
            },
        }
    );
    const technicalBlogData = await res.data;

    res = await API.post(
        'findCategorizedBlogList',
        '/blogListCategorized',
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: {
                category: 'Travel',
                homePageFlag: true
            },
        }
    );
    const travelBlogData = await res.data;

    res = await API.post(
        'findCategorizedBlogList',
        '/blogListCategorized',
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: {
                category: 'Recipe',
                homePageFlag: true
            },
        }
    );
    const recipeBlogData = await res.data;

    // return the data
    return {
        props: {
            menuList,
            promotionData,
            technicalBlogData,
            travelBlogData,
            recipeBlogData
        },
    }
}

export default Home;