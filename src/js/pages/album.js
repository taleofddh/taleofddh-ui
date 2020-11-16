'use strict';

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import {useApi, useFetch, useMediaQuery} from '../common/hook'
import {getSessionCookie} from "../common/session";
import MetaTag from "../components/metatag";
import Title from "../components/title";
import Loader from "../components/loader";
import Thumbnail from "../components/thumbnail";
import '../../scss/pages/album.scss';

const pagetitle = 'Album'
const source = 'album';

function Album(props) {
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
    if(!restrictedFlag) {
        albumUri = albumUri + '/' + restrictedFlag;
    }
    const [data, loading] = useFetch(
        api + albumUri, 'albums'
    );

    const matches = useMediaQuery('(max-width: 820px)');

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="boxouter">
                <div className="container">
                    <div className="albumframe">
                        <Title message={pagetitle} />
                        {loading ? (
                            <Loader loading={loading} />
                        ) : (
                            <Thumbnail pictures={data} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )

}

export default Album;