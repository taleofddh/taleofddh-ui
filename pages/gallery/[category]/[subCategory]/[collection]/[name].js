import React, {useEffect, useState} from 'react';
import {serverGet} from "../../../../../common/server-config";
import {
    PAGE_REVALIDATE_PERIOD,
    HOST_NAME,
    INDEX_FLAG
} from "../../../../../common/constants";
import {capitalizeFirstLetters} from "../../../../../common/common";
import { getSessionCookie } from "../../../../../common/session";
import Header from '../../../../../components/header';
import Navigation from '../../../../../components/navigation';
import ResponsiveNavigation from "../../../../../components/responsive-navigation";
import Footer from "../../../../../components/footer";
import {postAuditEntry} from "../../../../../common/common";
import PhotoAlbum from "../../../../../components/photo-album";
import {put} from "aws-amplify/api";
import {onError} from "../../../../../common/error";

const pageTitle = "Gallery"

function AlbumName({menuList, handleLogout, authenticated, albumData, category, subCategory, collection, name, source, index, url, }) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const path = (category + '/' + subCategory + '/' + collection + '/' + name).replace(/&/g, 'and').replace(/ /g, '-').toLowerCase();

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip,
                page: 'gallery',
                message: name + ' Gallery Page Accessed'
            }
        );
    }, [ddhomeCountry, name]);

    useEffect(() => {
        const onLoad = async () => {
            try {
                await put({
                    apiName: 'updateAlbumViewCount',
                    path: '/albumViewCount',
                    options: {
                        response: true,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: {
                            name: name,
                            startDateTime: albumData.startDateTime
                        }
                    }
                }).response;
            }
            catch(e) {
                if (e !== 'No current user') {
                    onError(e);
                }
            }
        }
        onLoad();
    }, [name, albumData]);

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <PhotoAlbum source={source} path={path} type={name} album={albumData} photos={albumData.photoList} videos={albumData.videoList}/>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticPaths = async ({context}) => {
    // Call an external API endpoint to get data
    const categorySubCategoryCollectionNames = await serverGet('findAlbumCategorySubCategoryCollectionNames', '/albumCategorySubCategoryCollectionNames');
    //console.log("categorySubCategoryCollectionNames", JSON.stringify(categorySubCategoryCollectionNames));

    let paths = []
    for(let i = 0; i < categorySubCategoryCollectionNames.length; i++) {
        for (let j = 0; j < categorySubCategoryCollectionNames[i].length; j++) {
            for (let k = 0; k < categorySubCategoryCollectionNames[i][j].length; k++) {
                for (let l = 0; l < categorySubCategoryCollectionNames[i][j][k].names.length; l++) {
                    paths = [...paths, {
                        params: {
                            category: categorySubCategoryCollectionNames[i][j][k].category.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase(),
                            subCategory: categorySubCategoryCollectionNames[i][j][k].subCategory.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase(),
                            collection: categorySubCategoryCollectionNames[i][j][k].collection.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase(),
                            name: categorySubCategoryCollectionNames[i][j][k].names[l].replace(/&/g, 'and').replace(/ /g, '-').toLowerCase()
                        }
                    }]
                }
            }
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
    const menuList = await serverGet('findMenuList', '/menuList', [true]);

    const category = capitalizeFirstLetters(`${params.category}`.replace(/-/g, ' ').replace(/ and /g, ' & '));
    const subCategory = capitalizeFirstLetters(`${params.subCategory}`.replace(/-/g, ' ').replace(/ and /g, ' & '));
    const collection = capitalizeFirstLetters(`${params.collection}`.replace(/-/g, ' ').replace(/ and /g, ' & '));
    const name = capitalizeFirstLetters(`${params.name}`.replace(/-/g, ' ').replace(/ and /g, ' & '));
    //console.log(category, subCategory, collection, name);
    //console.log(('images/albums/' + category + '/' + subCategory + '/' + collection + '/' + name + '/').replace(/&/g, 'and').replace(/ /g, '-').toLowerCase());

    const albumData = await serverGet('findAlbumWithMedia', '/albumWithMedia', [category, subCategory, collection, name]);
    //console.log(JSON.stringify(albumData));
    const hdr = capitalizeFirstLetters(`${params.name}`.replace(/-/g, ' ').replace(/ and /g, ' & ')) + ' - Gallery | taleofddh';
    const desc = albumData.description;
    const img = albumData.signedUrl;

    // return the data
    return {
        props: {
            menuList,
            albumData,
            category,
            subCategory,
            collection,
            name,
            source,
            index,
            url,
            hdr,
            desc,
            img
        },
        revalidate: PAGE_REVALIDATE_PERIOD * 48, // In seconds
    }
}

export default AlbumName;