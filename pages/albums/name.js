import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {runWithAmplifyServerContext} from "../../common/serverconfig";
import {get, post} from "aws-amplify/api/server";
import {put} from "aws-amplify/api";
import {fetchAuthSession} from "aws-amplify/auth";
import {useIndex} from '../../common/hook';
import {postAuditEntry} from "../../common/common";
import {getSessionCookie, useSessionContext} from "../../common/session";
import {onError} from "../../common/error";
import MetaTag from "../../components/metatag";
import Title from "../../components/title";
import Loader from "../../components/loader";
import Carousel from "../../components/carousel";
import Share from "../../components/share";
import ResponsiveNavigation from "../../components/responsivenavigation";
import Header from "../../components/header";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";

const pagetitle = 'Album';
const source = 'album';

function Album({ menuList, handleLogout, data, albumName }) {
    const { isAuthenticated, userHasAuthenticated } = useSessionContext();
    const index = useIndex();
    const [url, setUrl] = useState('');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const [countUpdateLoading, setCountUpdateLoading] = useState(true);
    const user = getSessionCookie('user');
    let restrictedFlag = false;
    if(user.roleList !== undefined) {
        if(user.roleList.name === 'Friend' || user.roleList.name === 'Family') {
            restrictedFlag = true;
        }
    }

    useEffect(() => {
        if(typeof window !== 'undefined'){
            setUrl(window.location.protocol + '//' + window.location.host);
        }
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'user profile',
                message: 'User Profile Page Accessed by ' + getSessionCookie("credential").identityId
            }
        );
    }, [ddhomeCountry]);

    useEffect(() => {
        const onLoad = async () => {
            try {
                await fetchAuthSession({ forceRefresh: true });
                await put({
                    apiName: 'updateAlbumViewCount',
                    path: '/albumViewCount',
                    options: {
                        response: true,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    },
                    body: {
                        albumName: albumName
                    },
                }).response;
                userHasAuthenticated(true);
                setCountUpdateLoading(false);
            }
            catch(e) {
                if (e !== 'No current user') {
                    onError(e);
                }
                setCountUpdateLoading(false);
            }
        }
        onLoad();
    }, [albumName, userHasAuthenticated]);

    const handleClick = (clickEvent, object) => {
        if(isAuthenticated) {
            //alert(object.photo.caption);
            let albumName = {
                albumName: object.photo.caption
            }
            props.history.push('/photo', {
                index: index,
                albumName: albumName
            });
        } else {
            alert("Not Authorised. Please login");
        }
    }

    return (
        countUpdateLoading ? (
            <Loader loading={countUpdateLoading} />
        ) : (
            <>
                <ResponsiveNavigation menus={menuList} />
                <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
                <Navigation menus={menuList} />
                <MetaTag page={source} index={index} url={url} desc={data.description} img={data.titlePhoto.path + '/' + data.titlePhoto.name + '.jpg'}/>
                <div className="boxouter">
                    {isAuthenticated ? (
                        <div className="container" style={{width: '100%', backgroundColor: 'rgb(34, 38, 41)'}}>
                            <div className="photoframe">
                                <Title message={data.description} />
                                <div className="photoshare">
                                    <Share name={albumName} subject={data.description} url={'https://www.taleofddh.com/albums/' + albumName} image={data.titlePhoto.path + '/' + data.titlePhoto.name + '.jpg'}/>
                                </div>
                                <Carousel pictures={data.photos} onClick={handleClick}/>
                            </div>
                        </div>
                    ) : (
                        <div className="container">
                            <div className="errorframe">
                                <Title message={pagetitle + ' Not Found'} />
                                <div className="errormessage">
                                    <p>Your requested page is not available or the application has generated an error.</p>
                                    <p>Please visit <Link href="/" as="/">Taleofddh Home Page</Link>  or <Link href="/sign-in" as="/sign-in">Sign-in</Link> to search for features</p>
                                    <p>If you have any specific query please <Link href="/contact-us" as="/contact-us">Contact Us</Link>.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <Footer menus={menuList} />
            </>
        )

    )
}

// This function gets called at build time
export const getStaticPaths = async () => {
    // Call an external API endpoint to get data
    const albums = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findAlbumList',
                    path: '/albumList',
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
    const paths = albums.map((album) => ({
        params: { name: album.name },
    }))

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
}

// This function gets called at build time
export const getStaticProps = async ({ params }) => {
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

    const albumName = `${params.name}`;

    const data = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await post(contextSpec, {
                    apiName: 'findAlbumPhotoList',
                    path: '/albumPhotoList',
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: {
                            albumName: albumName
                        }
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
            data,
            albumName
        },
    }
}

export default Album;