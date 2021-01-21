import React, {useEffect, useState} from 'react';
import {useHistory, withRouter} from "react-router-dom";
import {Auth} from "aws-amplify";
import {useApi, useGet} from '../common/hook'
import {getSessionCookie, useSessionContext} from "../common/session";
import {onError} from "../common/error";
import {postAuditEntry} from "../common/common";
import MetaTag from "../components/metatag";
import Title from "../components/title";
import Loader from "../components/loader";
import Album from "../components/album";
import '../../scss/pages/gallery.scss';

const pagetitle = 'Gallery'
const source = 'gallery';

function Gallery(props) {
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
    let albumUri = '/gallery/albumList';
    if(restrictedFlag) {
        albumUri = albumUri + '/' + restrictedFlag;
    }
    const [data, loading] = useGet(
        'findAlbumList',
        '/albumList'
    );

    useEffect(() => {
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
    }, []);

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
            let album = object.photo;
            props.history.push('/gallery/photo/' + album.caption, {
                api: api,
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



export default withRouter(Gallery);