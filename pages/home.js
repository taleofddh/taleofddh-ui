import React, {useEffect, useState} from 'react';
import { get, post } from 'aws-amplify/api/server';
import { runWithAmplifyServerContext } from '../common/serverconfig';
import {INDEX_FLAG, HOST_NAME, PAGE_REVALIDATE_PERIOD} from '../common/constants';
import Link from "next/link";
import { useIndex } from '../common/hook';
import { getSessionCookie } from "../common/session";
import Header from '../components/header';
import Navigation from '../components/navigation';
import ResponsiveNavigation from "../components/responsivenavigation";
import Footer from "../components/footer";
import MetaTag from "../components/metatag";
import Collapse from "../components/collapse";
import StayConnected from '../components/stayconnected';
import BlogSection from "../components/blogsection";
import Banner from "../components/banner";

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
    /*const message = 'We are currently offering select services in the United Kingdom and India. Over the coming months we aim to include more services and countries. ';
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

    const text = 'Looking for something else?';*/

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <MetaTag page={source} index={index} url={url} />
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
                    {/*<div className="collapseframe">
                        <Collapse header={text} content={defaultMessage} />
                    </div>*/}
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticProps = async (context) => {
    // Call an external API endpoint to get data
    const menuList = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findMenuList',
                    path: '/menuList/true',
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                }).response;
                return body.json();
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    });

    const promotionData = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findPromotionList',
                    path: '/promotionList/true',
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                }).response;
                return body.json();
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    });

    const technicalBlogData = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await post(contextSpec, {
                    apiName: 'findCategorizedBlogList',
                    path: '/blogListCategorized',
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: {
                            category: 'Technical',
                            homePageFlag: true
                        },
                    }
                }).response;
                return body.json();
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    });

    const travelBlogData = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await post(contextSpec, {
                    apiName: 'findCategorizedBlogList',
                    path: '/blogListCategorized',
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: {
                            category: 'Travel',
                            homePageFlag: true
                        },
                    }
                }).response;
                return body.json();
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    });

    const recipeBlogData = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await post(contextSpec, {
                    apiName: 'findCategorizedBlogList',
                    path: '/blogListCategorized',
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: {
                            category: 'Recipe',
                            homePageFlag: true
                        },
                    }
                }).response;
                return body.json();
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    });

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