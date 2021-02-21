import React, {useEffect} from 'react';
import {NavLink} from "react-router-dom";
import {Auth} from "aws-amplify";
import {useIndex, usePost, usePut} from '../common/hook';
import {postAuditEntry} from "../common/common";
import {getSessionCookie, useSessionContext} from "../common/session";
import {onError} from "../common/error";
import MetaTag from "../components/metatag";
import Title from "../components/title";
import Loader from "../components/loader";
import Carousel from "../components/carousel";
import Share from "../components/share";
import '../../scss/pages/photo.scss';

const pagetitle = 'Album'
const source = 'album';

function Photo(props) {
    const { isAuthenticated, userHasAuthenticated } = useSessionContext();
    const index = useIndex(window.location.hostname, window.location.protocol);
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const user = getSessionCookie('user');
    let restrictedFlag = false;
    if(user.roleList !== undefined) {
        if(user.roleList.name === 'Friend' || user.roleList.name === 'Family') {
            restrictedFlag = true;
        }
    }
    let albumName;

    let startIndex = 0;
    if(props.match.params.albumName) {
        albumName = props.match.params.albumName;
        if(props.match.params.startIndex) {
            startIndex = parseInt(props.match.params.startIndex);
        }
    } else {
        albumName = (props.location.state && props.location.state !== undefined) ? props.location.state.album.caption : '';
    }
    let album = {
        albumName: albumName
    }
    const [countUpdate, countUpdateLoading] = usePut(
        'updateAlbumViewCount',
        '/albumViewCount',
        album
    );

    const [data, loading] = usePost(
        'findAlbumPhotoList',
        '/albumPhotoList',
        album
    );

    useEffect(() => {
        onLoad();
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'album',
                message: 'Album Page ' + albumName + ' Accessed by ' + getSessionCookie("credential").identityId
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
    }

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
        loading || countUpdateLoading ? (
            <Loader loading={loading || countUpdateLoading} />
        ) : (
            <>
                <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} description={data.description}/>
                <div className="boxouter">
                    {isAuthenticated ? (
                        <div className="container" style={{width: '100%', backgroundColor: 'rgb(34, 38, 41)'}}>
                            <div className="photoframe">
                                <Title message={data.description} />
                                <div className="photoshare">
                                    <Share name={albumName} subject={data.description} url={'https://www.taleofddh.com/gallery/photo/' + albumName} image={data.titlePhoto.path + '/' + data.titlePhoto.name + '.jpg'}/>
                                </div>
                                <Carousel pictures={data.photos} startIndex={startIndex} onClick={handleClick}/>
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