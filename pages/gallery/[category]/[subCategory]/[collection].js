import React, {useEffect} from 'react';
import {serverGet} from "../../../../common/server-config";
import {
    HOST_NAME,
    INDEX_FLAG
} from "../../../../common/constants";
import {capitalizeFirstLetters} from "../../../../common/common";
import { getSessionCookie } from "../../../../common/session";
import Header from '../../../../components/header';
import Navigation from '../../../../components/navigation';
import ResponsiveNavigation from "../../../../components/responsive-navigation";
import Footer from "../../../../components/footer";
import {postAuditEntry} from "../../../../common/common";
import PhotoCollection from "../../../../components/photo-collection";
import {galleryCoverUrl} from "../../../../common/gallery/urls";
import {getLevelMeta, levelMetadata} from "../../../../common/gallery/level-meta.server";
import LevelIntro from "../../../../components/level-intro";

const pageTitle = "Gallery"

function AlbumCollections({menuList, handleLogout, authenticated, category, subCategory, collection, historical, intro, source, index, url}) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip,
                page: 'gallery',
                message: collection + ' Gallery Page Accessed'
            }
        );
    }, [ddhomeCountry, collection]);

    const handleClick = (clickEvent, object) => {
        /*if(isAuthenticated) {
            //alert(object.photo.caption);
            let album = object.photo;
            router.push('/albums/' + album.caption,
                '/albums/' + album.caption,
                {
                    index: index,
                    album: album
                });
        } else {
            alert("Not Authorised. Please login");
        }*/

    }

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    {/*<HistoricalList source={source} path={category + '/' + subCategory + '/' + collection} type={collection} data={historicalAlbumData} />*/}
                    <LevelIntro text={intro} />
                    <PhotoCollection albums={historical} source={source} type={collection} />
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticPaths = async ({context}) => {
    // Call an external API endpoint to get data
    const categorySubCategoryCollections = await serverGet('findAlbumCategorySubCategoryCollections', '/albumCategorySubCategoryCollections');
    //console.log("categorySubCategoryCollections", categorySubCategoryCollections);

    let paths = []
    for(let i = 0; i < categorySubCategoryCollections.length; i++) {
        for (let j = 0; j < categorySubCategoryCollections[i].length; j++) {
            for (let k = 0; k < categorySubCategoryCollections[i][j].collections.length; k++) {
                paths = [...paths, {
                    params: {
                        category: categorySubCategoryCollections[i][j].category.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase(),
                        subCategory: categorySubCategoryCollections[i][j].subCategory.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase(),
                        collection: categorySubCategoryCollections[i][j].collections[k].replace(/&/g, 'and').replace(/ /g, '-').toLowerCase()
                    }
                }]
            }
        }
    }
    //console.log("paths", paths);

    // We'll pre-render only these paths at build time.
    // Static export: only these paths are built. Any other path returns 404
    // until the next build (rebuilds run on commit or via the Amplify webhook).
    return { paths, fallback: false }
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
    //console.log(category, subCategory, collection);
    //console.log(('images/gallery/' + category + '/' + subCategory + '/' + collection + '/').replace(/&/g, 'and').replace(/ /g, '-').toLowerCase());

    const historical = await serverGet('findAlbumHistoricalNames', '/albumHistoricalNames', [category, subCategory, collection]);
    const levelMeta = await getLevelMeta('collection', category, subCategory, collection);
    const meta = levelMetadata(levelMeta, {
        title: collection + ' Albums: ' + subCategory + ', ' + category,
        description: 'Photo and video albums from ' + collection + ', part of ' + subCategory + ' in our ' + category + ' galleries at taleofddh. Sign in to view each album.'
    }, galleryCoverUrl(category, subCategory, collection), collection + ' Albums');

    // return the data
    return {
        props: {
            menuList,
            category,
            subCategory,
            collection,
            historical,
            intro: levelMeta ? levelMeta.description : null,
            source,
            index,
            url,
            meta
        },
    }
}

export default AlbumCollections;