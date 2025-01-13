import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {runWithAmplifyServerContext} from "../common/serverconfig";
import {get} from "aws-amplify/api/server";
import {useIndex} from '../common/hook'
import {getSessionCookie, useSessionContext} from "../common/session";
import {onError} from "../common/error";
import {postAuditEntry} from "../common/common";
import MetaTag from "../components/metatag";
import Title from "../components/title";
import Collection from "../components/collection";
import ResponsiveNavigation from "../components/responsivenavigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import {fetchAuthSession} from "aws-amplify/auth";

const pagetitle = 'Gallery'
const source = 'gallery';

function Gallery({ menuList, handleLogout, data }) {
    const router = useRouter();
    const { isAuthenticated, userHasAuthenticated } = useSessionContext();
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const index = useIndex();
    const [url, setUrl] = useState('');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const user = getSessionCookie('user');
    let restrictedFlag = false;
    if(user.roleList !== undefined) {
        if(user.roleList.name === 'Friend' || user.roleList.name === 'Family') {
            restrictedFlag = true;
        }
    }
    let albumUri = '/gallery/albumList';
    if(restrictedFlag) {
        albumUri = albumUri + '/' + restrictedFlag;
    }

    useEffect(() => {
        if(typeof window !== 'undefined'){
            setUrl(window.location.protocol + '//' + window.location.host);
        }
        const onLoad = async () => {
            try {
                await fetchAuthSession({ forceRefresh: true });
                userHasAuthenticated(true);
            }
            catch(e) {
                if (e !== 'No current user') {
                    onError(e);
                }
            }
            setIsAuthenticating(false);
        }
        onLoad();
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'gallery',
                message: 'Gallery Page Accessed'
            }
        );
    }, [userHasAuthenticated, ddhomeCountry]);

    const handleClick = (clickEvent, object) => {
        if(isAuthenticated) {
            //alert(object.photo.caption);
            let album = object.photo;
            setSessionStorage('index', index);
            setSessionStorage('album', album);
            router.push('/albums/' + album.caption,
                '/albums/' + album.caption,
    {
                index: index,
                album: album
            });
        } else {
            alert("Not Authorised. Please login");
        }

    }

    return (
        !isAuthenticating && (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <MetaTag page={source} index={index} url={url} />
            <div className="boxouter">
                <div className="container">
                    <div className="galleryframe">
                        <Title message={pagetitle} />
                        <Collection pictures={data} onClick={handleClick}/>
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
        )
    )
}

// This function gets called at build time
export const getStaticProps = async (context) => {
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

    const data = await runWithAmplifyServerContext({
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

    // return the data
    return {
        props: {
            menuList,
            data
        },
    }
}

export default Gallery;