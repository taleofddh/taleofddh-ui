import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import { MEDIA_HOST} from "../common/constants";
import {useMediaQuery} from "../common/hook";
import ImageGallery  from 'react-image-gallery';
import '../../scss/components/carousel.scss';

function Carousel(props) {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const isTablet = useMediaQuery('(max-width: 800px)');
    const isDesktop = useMediaQuery('(max-width: 1200px)');
    let originalPath = 'desktop'
    if(isMobile) {
        originalPath = 'mobile';
    } else if (isTablet) {
        originalPath = 'tablet';
    } else if (isDesktop) {
        originalPath = 'desktop';
    }

    let images = {};
    images = props.pictures.map((item, index) => {
        return {
            ...images,
            thumbnail: MEDIA_HOST + '/images/thumbnail/' + item.path + '/' + item.name + '.jpg',
            original: MEDIA_HOST + '/images/' + originalPath + '/' + item.path + '/' + item.name + '.jpg',
            originalTitle: item.description,
            description: item.description
        };
    });

    const handleAlbumClick = (clickEvent, obj) => {
        props.onClick && props.onClick(clickEvent, obj);
    }

    return (
        <ImageGallery  items={images} startIndex={props.startIndex} />
    )
}

export default Carousel;