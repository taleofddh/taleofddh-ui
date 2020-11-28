import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, {useEffect, useState} from 'react';
import {NavLink, useHistory} from "react-router-dom";
import {Auth} from "aws-amplify";
import {useApi, usePost, useMediaQuery} from '../common/hook'
import {getSessionCookie, useSessionContext} from "../common/session";
import {onError} from "../common/error";
import MetaTag from "../components/metatag";
import Title from "../components/title";
import Loader from "../components/loader";
import Carousel from "../components/carousel";
import '../../scss/pages/photo.scss';

const pagetitle = 'Album'
const source = 'album';

function Photo(props) {
    const history = useHistory();
    const { isAuthenticated, userHasAuthenticated } = useSessionContext();
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const user = getSessionCookie('user');
    let restrictedFlag = false;
    if(user.roleList !== undefined) {
        if(user.roleList.name === 'Friend' || user.roleList.name === 'Family') {
            restrictedFlag = true;
        }
    }
    let albumUri = '/gallery';
    if(restrictedFlag) {
        albumUri = albumUri + '/photoListRestricted';
    } else {
        albumUri = albumUri + '/photoList'
    }
    let albumName;
    let album;
    let startIndex = 0;
    if(props.match.params.albumName) {
        albumName = props.match.params.albumName;
        if(props.match.params.startIndex) {
            startIndex = parseInt(props.match.params.startIndex);
        }
    } else {
        albumName = (props.location.state && props.location.state !== undefined) ? props.location.state.album.albumName : '';
    }
    album = {
        albumName: albumName
    }
    const [data, loading] = usePost(
        'findPhotoList',
        '/photoList',
        album
    );

    const matches = useMediaQuery('(max-width: 820px)');

    useEffect(() => {
        onLoad();
    }, [])

    async function onLoad() {
        try {
            await Auth.currentSession();
            userHasAuthenticated(true);
        }
        catch(e) {
            if (e !== 'No current user') {
                onError(e);
            }
        }
        setIsAuthenticating(false);
    }

    const handleClick = (clickEvent, object) => {
        if(isAuthenticated) {
            //alert(object.photo.caption);
            let albumName = {
                albumName: object.photo.caption
            }
            props.history.push('/photo', {
                api: api,
                index: index,
                albumName: albumName
            });
        } else {
            alert("Not Authorised. Please login");
        }
    }

    return (
        !isAuthenticating && (
            <>
                <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
                <div className="boxouter">
                    {isAuthenticated ? (
                        <div className="container" style={{width: '100%', backgroundColor: 'rgb(34, 38, 41)'}}>
                            <div className="photoframe">
                                <Title message={pagetitle + ' - ' + albumName} />
                                    {loading ? (
                                        <Loader loading={loading} />
                                    ) : (
                                        <Carousel pictures={data} startIndex={startIndex} onClick={handleClick}/>
                                    )}
                            </div>
                        </div>
                    ) : (
                        <div className="container">
                            <div className="errorframe">
                                <Title message={pagetitle + ' Not Found'} />
                                <div className="errormessage">
                                    <p>Your requested page is not available or the application has generated an error.</p>
                                    <p>Please visit <NavLink to="/">Taleofddh Home Page</NavLink>  or <NavLink to="/sign-in">Sign-in</NavLink> to search for features</p>
                                    <p>If you have any specific query please <NavLink to="/contact-us">Contact Us</NavLink>.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </>
        )
    )
}

export default Photo;