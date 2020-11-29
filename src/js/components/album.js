import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import { MEDIA_HOST} from "../common/constants";
import AlbumGallery from 'react-photo-gallery';
import '../../scss/components/album.scss';

function Album(props) {
    let images = {};
    images = props.pictures.map((item, index) => {
        return {
            ...images,
            src: MEDIA_HOST + '/images/thumbnail/' + item.titlePhoto.path + '/' + item.titlePhoto.name + '.jpg',
            width: 3,
            height: 2,
            caption: item.name,
            alt: item.name,
            description: item.description
        };
    });

    const handleAlbumClick = (clickEvent, obj) => {
        props.onClick && props.onClick(clickEvent, obj);
    }

    return (
        <div>
            <AlbumGallery photos={images} targetRowHeight={180} onClick={handleAlbumClick}/>
        </div>
    )
}

export default Album;