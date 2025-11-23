import React, {useEffect, useState} from 'react';
import {runWithAmplifyServerContext} from "../common/server-config";
import {get} from "aws-amplify/api/server";
import {PAGE_REVALIDATE_PERIOD, HOST_NAME, INDEX_FLAG} from "../common/constants";
import { getSessionCookie } from "../common/session";
import Header from '../components/header';
import Navigation from '../components/navigation';
import ResponsiveNavigation from "../components/responsive-navigation";
import Footer from "../components/footer";
import {postAuditEntry} from "../common/common";
import HistoricalAlbum from "../components/historical-album";

const pageTitle = "Gallery";

function Gallery({menuList, handleLogout, authenticated, historicalAlbumData, source, index, url}) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {

        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'albums',
                message: 'Gallery Page Accessed'
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
                    <HistoricalAlbum source={source} type='Historical' albums={historicalAlbumData}/>
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

    const historicalAlbumData = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findHistoricalAlbumCategories',
                    path: '/albumHistoricalCategories',
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
            historicalAlbumData,
            source,
            index,
            url
        },
        revalidate: PAGE_REVALIDATE_PERIOD, // In seconds
    }
}

export default Gallery;