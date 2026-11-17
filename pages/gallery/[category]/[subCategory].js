import React, {useEffect} from 'react';
import {serverGet} from "../../../common/server-config";
import {HOST_NAME, INDEX_FLAG} from "../../../common/constants";
import {capitalizeFirstLetters} from "../../../common/common";
import { getSessionCookie } from "../../../common/session";
import Header from '../../../components/header';
import Navigation from '../../../components/navigation';
import ResponsiveNavigation from "../../../components/responsive-navigation";
import Footer from "../../../components/footer";
import {postAuditEntry} from "../../../common/common";
import HistoricalList from "../../../components/historical-list";
import {galleryCoverUrl} from "../../../common/gallery/urls";
import {getLevelMeta, levelMetadata} from "../../../common/gallery/level-meta.server";
import LevelIntro from "../../../components/level-intro";

const pageTitle = "Gallery";

function AlbumSubCategories({menuList, handleLogout, authenticated, /*upcomingEventData,*/ category, subCategory, historical, intro, source, index, url}) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip,
                page: 'gallery',
                message: subCategory + ' Gallery Page Accessed'
            }
        );
    }, [ddhomeCountry, subCategory]);

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    {/*<UpcomingEvent eventType='Upcoming' events={upcomingEventData} subCategory={subCategory} />*/}
                    <LevelIntro text={intro} />
                    <HistoricalList source={source} path={category + '/' + subCategory} type={subCategory} data={historical} />
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticPaths = async ({context}) => {
    // Call an external API endpoint to get data
    const categorySubCategories = await serverGet('findAlbumCategorySubCategories', '/albumCategorySubCategories');
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
    //console.log("category-subCategory", category + "-" + subCategory);

    const historical = await serverGet('findHistoricalAlbumCollections', '/albumHistoricalCollections', [category, subCategory]);
    const levelMeta = await getLevelMeta('subCategory', category, subCategory);
    const meta = levelMetadata(levelMeta, {
        title: subCategory + ' ' + category + ' Galleries',
        description: 'Photo and video galleries for ' + subCategory + ' in our ' + category + ' collection at taleofddh. Browse the collections and sign in to view the albums.'
    }, galleryCoverUrl(category, subCategory), subCategory + ' ' + category + ' Galleries');

    // return the data
    return {
        props: {
            menuList,
            category,
            subCategory,
            historical,
            intro: levelMeta ? levelMeta.description : null,
            source,
            index,
            url,
            meta
        },
    }
}

export default AlbumSubCategories;