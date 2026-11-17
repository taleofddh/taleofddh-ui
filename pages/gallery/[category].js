import React, {useEffect} from 'react';
import {serverGet} from "../../common/server-config";
import {HOST_NAME, INDEX_FLAG} from "../../common/constants";
import {capitalizeFirstLetters} from "../../common/common";
import { getSessionCookie } from "../../common/session";
import Header from '../../components/header';
import Navigation from '../../components/navigation';
import ResponsiveNavigation from "../../components/responsive-navigation";
import Footer from "../../components/footer";
import {postAuditEntry} from "../../common/common";
import HistoricalList from "../../components/historical-list";
import {galleryCoverUrl} from "../../common/gallery/urls";
import {getLevelMeta, levelMetadata} from "../../common/gallery/level-meta.server";
import LevelIntro from "../../components/level-intro";

const pageTitle = "Gallery";

function AlbumCategories({menuList, handleLogout, authenticated, /*upcomingEventData,*/ category, historical, intro, source, index, url}) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip,
                page: 'gallery',
                message: category + ' Gallery Page Accessed'
            }
        );
    }, [ddhomeCountry, category]);

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <LevelIntro text={intro} />
                    <HistoricalList source={source} path={category} type={category} data={historical}/>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticPaths = async ({context}) => {
    // Call an external API endpoint to get data
    const galleryCategories = await serverGet('findAlbumCategories', '/albumCategories');

    // Get the paths we want to pre-render based on posts
    const paths = galleryCategories.map((category) => ({
        params: { category: category.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase() },
    }))
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
    //console.log("category", category);

    const historical = await serverGet('findHistoricalAlbumSubCategories', '/albumHistoricalSubCategories', [category]);
    const levelMeta = await getLevelMeta('category', category);
    const meta = levelMetadata(levelMeta, {
        title: category + ' Photo and Video Galleries',
        description: 'Browse ' + category + ' photo and video galleries from taleofddh, from family vacations and short trips to celebrations. Sign in to view each album.'
    }, galleryCoverUrl(category), category + ' Galleries');

    // return the data
    return {
        props: {
            menuList,
            category,
            historical,
            intro: levelMeta ? levelMeta.description : null,
            source,
            index,
            url,
            meta
        },
    }
}

export default AlbumCategories;