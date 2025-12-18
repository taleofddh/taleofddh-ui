import React, {useEffect} from 'react';
import {serverGet} from "../../../../common/server-config";
import {
    PAGE_REVALIDATE_PERIOD,
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

const pageTitle = "Gallery"

function AlbumCollections({menuList, handleLogout, authenticated, historicalAlbumData, category, subCategory, collection, source, index, url}) {
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
                    <PhotoCollection albums={historicalAlbumData} source={source} type={collection} />
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
    //console.log(category, subCategory, collection);
    //console.log(('images/gallery/' + category + '/' + subCategory + '/' + collection + '/').replace(/&/g, 'and').replace(/ /g, '-').toLowerCase());

    const historicalAlbumData = await serverGet('findAlbumHistoricalNames', '/albumHistoricalNames', [category, subCategory, collection]);
    //console.log(historicalAlbumData);
    const hdr = capitalizeFirstLetters(`${params.collection}`.replace(/-/g, ' ').replace(/ and /g, ' & ')) + ' - Galleries | taleofddh';

    // return the data
    return {
        props: {
            menuList,
            historicalAlbumData,
            category,
            subCategory,
            collection,
            source,
            index,
            url,
            hdr
        },
        revalidate: PAGE_REVALIDATE_PERIOD * 48, // In seconds
    }
}

export default AlbumCollections;