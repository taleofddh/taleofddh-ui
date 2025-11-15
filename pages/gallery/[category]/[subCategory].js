import React, {useEffect} from 'react';
import {runWithAmplifyServerContext} from "../../../common/serverconfig";
import {get} from "aws-amplify/api/server";
import {PAGE_REVALIDATE_PERIOD, HOST_NAME, INDEX_FLAG} from "../../../common/constants";
import {capitalizeFirstLetters} from "../../../common/common";
import { getSessionCookie } from "../../../common/session";
import Header from '../../../components/header';
import Navigation from '../../../components/navigation';
import ResponsiveNavigation from "../../../components/responsivenavigation";
import Footer from "../../../components/footer";
import {postAuditEntry} from "../../../common/common";
import HistoricalAlbum from "../../../components/historicalalbum";

const pagetitle = "Gallery";

function AlbumSubCategories({menuList, handleLogout, authenticated, /*upcomingEventData,*/ historicalAlbumData, category, subCategory, source, index, url}) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'albums',
                message: subCategory + ' Gallery Page Accessed'
            }
        );
    }, [ddhomeCountry, subCategory]);

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    {/*<UpcomingEvent eventType='Upcoming' events={upcomingEventData} subCategory={subCategory} />*/}
                    <HistoricalAlbum source={source} path={category + '/' + subCategory} type={subCategory} albums={historicalAlbumData} />
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticPaths = async ({context}) => {
    // Call an external API endpoint to get data
    const categorySubCategories = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findAlbumCategorySubCategories',
                    path: '/albumCategorySubCategories',
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
    //console.log("categorySubCategories", categorySubCategories);

    let paths = []
    for(let i = 0; i < categorySubCategories.length; i++) {
        for (let j = 0; j < categorySubCategories[i].subCategories.length; j++) {
            paths = [...paths, {
                params: {
                    category: categorySubCategories[i].category.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase(),
                    subCategory: categorySubCategories[i].subCategories[j].replace(/&/g, 'and').replace(/ /g, '-').toLowerCase()
                }
            }]
        }
    }
    //console.log("paths", paths);

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    // { fallback: 'blocking' } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: 'blocking' }
}

// This function gets called at build time
export const getStaticProps = async ({ context, params }) => {
    const source = 'gallery';
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
    const subCategory = capitalizeFirstLetters(`${params.subCategory}`.replace(/-/g, ' ').replace(/ and /g, ' & '));
    //console.log("category-subCategory", category + "-" + subCategory);

    // Call an external API endpoint to get data
    const historicalAlbumData = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findHistoricalAlbumCollections',
                    path: '/albumHistoricalCollections/' + encodeURI(category) + '/' + encodeURI(subCategory),
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
    //console.log(historicalEventData);
    const hdr = capitalizeFirstLetters(`${params.subCategory}`.replace(/-/g, ' ').replace(/ and /g, ' & ')) + ' - Galleries | taleofddh';

    // return the data
    return {
        props: {
            menuList,
            historicalAlbumData,
            category,
            subCategory,
            source,
            index,
            url,
            hdr
        },
        revalidate: PAGE_REVALIDATE_PERIOD * 48, // In seconds
    }
}

export default AlbumSubCategories;