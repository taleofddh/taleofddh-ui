import React, {useEffect} from 'react';
import {serverGet} from "../../common/server-config";
import {HOST_NAME, INDEX_FLAG} from "../../common/constants";
import {capitalizeFirstLetters} from "../../common/common";
import { getSessionCookie } from "../../common/session";
import {useClientGet} from "../../common/hook";
import Header from '../../components/header';
import Navigation from '../../components/navigation';
import ResponsiveNavigation from "../../components/responsive-navigation";
import Footer from "../../components/footer";
import {postAuditEntry} from "../../common/common";
import HistoricalList from "../../components/historical-list";
import Loader from "../../components/loader";

const pageTitle = "Gallery";

function AlbumCategories({menuList, handleLogout, authenticated, /*upcomingEventData,*/ category, source, index, url}) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    // Sub-category data carries presigned URLs, so it is fetched in the browser on every visit
    const historical = useClientGet('findHistoricalAlbumSubCategories', '/albumHistoricalSubCategories', [category]);

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
                    {historical.loading ? (
                        <Loader loading={true} />
                    ) : (
                        <HistoricalList source={source} path={category} type={category} data={historical.data}/>
                    )}
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

    const hdr = capitalizeFirstLetters(`${params.category}`.replace(/-/g, ' ').replace(/ and /g, ' & ')) + ' - Galleries | taleofddh';

    // return the data
    return {
        props: {
            menuList,
            category,
            source,
            index,
            url,
            hdr
        },
    }
}

export default AlbumCategories;