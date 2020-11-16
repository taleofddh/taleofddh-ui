'use strict';

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import { MEDIA_HOST} from "../common/constants";
import {useApi, useFetch, useMediaQuery} from "../common/hook";
import 'scss/components/thumbnail.scss';

function Thumbnail(props) {

    const match = useMediaQuery('(max-width: 820px)');

    return (
        <ul className="thumbnailgroup">
            {props.pictures.map((item, index) => (
                <li className="thumbnailitem">
                    <div className="thumbnail" style ={{backgroundImage: 'url("' + MEDIA_HOST + 'images/thumbnail/' + item.titlePhoto.path + '/' + item.titlePhoto.name + '.jpg")', backgroundPositionX: 'center',
                        backgroundPositionY: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
                        <p className="thumbnaulheader">
                            {item.name}
                        </p>
                    </div>

                </li>
            ))
            }
        </ul>
    )

}

export default Thumbnail;