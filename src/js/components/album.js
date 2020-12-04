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
            <AlbumGallery photos={images} targetRowHeight={180} onClick={handleAlbumClick} renderImage={props => <Thumbnail {...props} />}/>
        </div>
    )
}

const Thumbnail = ({ index, onClick, photo, margin, direction, top, left }) => {
    const imgStyle = { margin: margin, cursor: "pointer" };
    if (direction === "column") {
        imgStyle.position = "absolute";
        imgStyle.left = left;
        imgStyle.top = top;
    }

    const handleClick = (event) => {
        onClick(event, { photo, index });
    };

    return (
        <div className="thumbnail">
            <img className="thumbnailpiccontrol"
                style={imgStyle}
                {...photo}
                onClick={onClick ? handleClick : null}
                alt={photo.alt}
            />
            <p className="thumbnailheader">{photo.caption}</p>
        </div>
    );
};

export default Album;