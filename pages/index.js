import React from 'react';
import { get } from 'aws-amplify/api/server';
import { runWithAmplifyServerContext } from '../common/server-config';
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
                const { body } = await get(contextSpec, {
                    apiName: 'findCategorizedBlogList',
                    path: '/blogListCategorized/Travel/true',
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

    const travelBlogData = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findCategorizedBlogList',
                    path: '/blogListCategorized/Technical/true',
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

    const recipeBlogData = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findCategorizedBlogList',
                    path: '/blogListCategorized/Recipe/true',
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