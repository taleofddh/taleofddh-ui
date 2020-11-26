import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {Auth} from "aws-amplify";
import {useApi, usePost, useMediaQuery} from '../common/hook'
import {getSessionCookie, useSessionContext} from "../common/session";
import {onError} from "../common/error";
import MetaTag from "../components/metatag";
import Title from "../components/title";
import Loader from "../components/loader";
import Album from "../components/album";
import '../../scss/pages/gallery.scss';

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
    const [data, loading] = usePost(
        'findPhotoList',
        '/photoList',
        props.location.state.album,
        true
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
                    <div className="container">
                        <div className="galleryframe">
                            <Title message={pagetitle} />
                            {loading ? (
                                <Loader loading={loading} />
                            ) : (
                                <Album pictures={data} onClick={handleClick}/>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )
    )
}



export default Photo;