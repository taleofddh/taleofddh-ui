import React, {useEffect} from 'react';
import {runWithAmplifyServerContext} from "../../common/serverconfig";
import {get} from "aws-amplify/api/server";
import {PAGE_REVALIDATE_PERIOD, HOST_NAME, INDEX_FLAG} from "../../common/constants";
import {capitalizeFirstLetters} from "../../common/common";
import { getSessionCookie } from "../../common/session";
import Header from '../../components/header';
import Navigation from '../../components/navigation';
import ResponsiveNavigation from "../../components/responsivenavigation";
import Footer from "../../components/footer";
import {postAuditEntry} from "../../common/common";
import HistoricalAlbum from "../../components/historicalalbum";
import MetaTag from "../../components/metatag";

const pagetitle = "Albums";

function AlbumCategories({menuList, handleLogout, authenticated, /*upcomingEventData,*/ historicalAlbumData, category, source, index, url}) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'albums',
                message: category + ' Albums Page Accessed'
            }
        );
    }, [ddhomeCountry, category]);

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <MetaTag page={source} index={index} url={url} />
            <div className="boxouter">
                <div className="container">
                    <HistoricalAlbum source={source} path={category} type={category} albums={historicalAlbumData}/>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticPaths = async ({context}) => {
    // Call an external API endpoint to get data
    const historicalEventCategories = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findAlbumCategories',
                    path: '/albumCategories',
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

    // Get the paths we want to pre-render based on posts
    const paths = historicalEventCategories.map((category) => ({
        params: { category: category.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase() },
    }))
    //console.log("paths", paths);

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    // { fallback: 'blocking' } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: 'blocking' }
}

// This function gets called at build time
export const getStaticProps = async ({ context, params }) => {
    const source = 'albums';
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

    const category = capitalizeFirstLetters(`${params.category}`.replace(/-/g, ' ').replace(/ and /g, ' & '));
    //console.log("category", category);

    // Call an external API endpoint to get data
    const historicalAlbumData = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findHistoricalAlbumSubCategories',
                    path: '/albumHistoricalSubCategories/' + encodeURI(category),
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
    //console.log(historicalAlbumData);

    // return the data
    return {
        props: {
            menuList,
            historicalAlbumData,
            category,
            source,
            index,
            url
        },
        revalidate: PAGE_REVALIDATE_PERIOD * 48, // In seconds
    }
}

export default AlbumCategories;