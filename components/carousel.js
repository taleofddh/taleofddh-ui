import React from 'react';
import {useMediaQuery} from "../common/hook";
import ImageGallery  from 'react-image-gallery';

function Carousel({photos}) {
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
    images = photos.map((item, index) => {
        return {
            ...images,
            thumbnail: item.signedPhotoUrl,
            original: item.signedPhotoUrl,
            originalTitle: item.key,
            originalWidth: 960,
            originalHeight: 640,
            thumbnailWidth: 150,
            thumbnailHeight: 150
        };
    });

    return (
        <ImageGallery items={images}
                      startIndex={0}
        />
    )
}

export default Carousel;