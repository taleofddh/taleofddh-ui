import React from 'react';
import {put} from "aws-amplify/api";
import { MEDIA_HOST} from "../common/constants";
import {useMediaQuery} from "../common/hook";
import ImageGallery  from 'react-image-gallery';
//import '../styles/components/carousel.scss';

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
            sequence: item.sequence,
            thumbnail: MEDIA_HOST + '/images/thumbnail/' + item.path + '/' + item.name + '.jpg',
            original: MEDIA_HOST + '/images/' + originalPath + '/' + item.path + '/' + item.name + '.jpg',
            originalTitle: item.description,
            albumName: item.albumName,
            name: item.name,
            description: item.description,
            viewCount: item.viewCount
        };
    });

    const handleThumbnailClick = async (clickEvent, index) => {
        const res = await put({
            apiName: "updatePhotoViewCount",
            path: "/photoViewCount",
            options: {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: {
                    albumName: images[index].albumName,
                    name: images[index].name
                }
            }
        }).response;

        console.log(await res.body.json());
        //props.onClick && props.onClick(clickEvent, obj);
    }

    const handleSlideMove = async (index) => {
        const res = await put({
            apiName: "updatePhotoViewCount",
            path: "/photoViewCount",
            options: {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: {
                    albumName: images[index].albumName,
                    name: images[index].name
                }
            }
        }).response;

        console.log(await res.body.json());
    }

    return (
        <ImageGallery  items={images}
                       startIndex={props.startIndex}
                       onThumbnailClick={handleThumbnailClick}
                       onSlide={handleSlideMove}
        />
    )
}

export default Carousel;