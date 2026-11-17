import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import {serverGet} from "../../../../../common/server-config";
import {
    HOST_NAME,
    INDEX_FLAG
} from "../../../../../common/constants";
import {capitalizeFirstLetters} from "../../../../../common/common";
import {getAlbumTeaser} from "../../../../../common/gallery/album-teaser.server";
import {toDescription} from "../../../../../common/seo";
import AlbumTeaser from "../../../../../components/album-teaser";
import { getSessionCookie } from "../../../../../common/session";
import Header from '../../../../../components/header';
import Navigation from '../../../../../components/navigation';
import ResponsiveNavigation from "../../../../../components/responsive-navigation";
import Footer from "../../../../../components/footer";
import {postAuditEntry} from "../../../../../common/common";
import PhotoAlbum from "../../../../../components/photo-album";
import {put} from "aws-amplify/api";
import {onError} from "../../../../../common/error";
import {useClientGet} from "../../../../../common/hook";
import Loader from "../../../../../components/loader";

const pageTitle = "Gallery"

// Public teaser, gated media: the static page carries only public text and the cover image (see
// getAlbumTeaser). Photos and videos are fetched in the browser once the user is signed in, and
// signed-out visitors see the teaser with a sign-in button instead of being redirected.
function AlbumName({menuList, handleLogout, authenticated, authenticating, teaser, category, subCategory, collection, name, source, index, url, }) {
    const router = useRouter();
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const path = (category + '/' + subCategory + '/' + collection + '/' + name).replace(/&/g, 'and').replace(/ /g, '-').toLowerCase();
    const album = useClientGet('findAlbumWithMedia', '/albumWithMedia', [category, subCategory, collection, name], {}, authenticated);
    const albumData = album.data;
    const albumLoaded = !album.loading && albumData && albumData.name;

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
        // Only count a view once the album has actually been loaded for a signed-in user
        if (!albumLoaded) return;
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
    }, [name, albumLoaded, albumData.startDateTime]);

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    {!authenticated ? (
                        <AlbumTeaser
                            name={name}
                            teaser={teaser}
                            authenticating={authenticating}
                            signInHref={'/sign-in/?redirect=' + encodeURIComponent(router.asPath)} />
                    ) : albumLoaded ? (
                        <PhotoAlbum source={source} path={path} type={name} album={albumData} photos={albumData.photoList || []} videos={albumData.videoList || []}/>
                    ) : album.loading ? (
                        <Loader loading={true} />
                    ) : (
                        <p>This album could not be loaded.</p>
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
    const name = capitalizeFirstLetters(`${params.name}`.replace(/-/g, ' ').replace(/ and /g, ' & '));
    //console.log(category, subCategory, collection, name);
    //console.log(('images/albums/' + category + '/' + subCategory + '/' + collection + '/' + name + '/').replace(/&/g, 'and').replace(/ /g, '-').toLowerCase());

    // Only the public teaser is fetched here (explicit allow-list, see getAlbumTeaser). Album media is
    // deliberately NOT fetched: anything returned from getStaticProps is written into public HTML/JSON.
    const teaser = await getAlbumTeaser(category, subCategory, collection, name);
    const meta = {
        title: name + ' Photo Album: ' + collection + ', ' + subCategory,
        description: (teaser && (teaser.summary || toDescription(teaser.description)))
            || name + ' photo and video album from ' + collection + ' in our ' + subCategory + ' ' + category + ' galleries at taleofddh. Sign in to view the full album.',
        image: teaser ? teaser.coverUrl : null,
        imageAlt: teaser && teaser.coverAlt ? teaser.coverAlt : name + ' album cover',
        // An album that is not in the public list is not indexed
        noindex: !teaser,
        gallery: {
            name,
            dateCreated: teaser ? teaser.dateCreated : null,
            locationCreated: teaser ? teaser.locationLabel : null,
            gated: '.photoalbumgated'
        }
    };
    // return the data
    return {
        props: {
            menuList,
            category,
            subCategory,
            collection,
            name,
            teaser,
            source,
            index,
            url,
            meta
        },
    }
}

export default AlbumName;