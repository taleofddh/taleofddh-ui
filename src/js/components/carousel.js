import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import { MEDIA_HOST} from "../common/constants";
import ImageGallery  from 'react-image-gallery';
import '../../scss/components/carousel.scss';

function Carousel(props) {
    let images = {};
    images = props.pictures.map((item, index) => {
        return {
            ...images,
            thumbnail: MEDIA_HOST + '/images/thumbnail/' + item.path + '/' + item.name + '.jpg',
            original: MEDIA_HOST + '/images/desktop/' + item.path + '/' + item.name + '.jpg',
            originalTitle: item.description,
            description: item.description
        };
    });

    const handleAlbumClick = (clickEvent, obj) => {
        props.onClick && props.onClick(clickEvent, obj);
    }

    return (
        <ImageGallery  items={images} />
    )
}

export default Carousel;