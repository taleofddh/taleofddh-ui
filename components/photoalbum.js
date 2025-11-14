import React from 'react';
import Link from "next/link";
import { MEDIA_HOST} from "../common/constants";
import {RowsPhotoAlbum} from 'react-photo-album';
import Icon from "../common/icon";
import Title from "./title";

function PhotoAlbum({ source, path, type, albums, onClick }) {
    const photos = albums.map((item, index) => {
        return {
            src: item.signedUrl,
            width: 3,
            height: 2,
            title: item.name,
            alt: item.name,
            href: '/' + source + (path ? '/' + path.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase() : '') + '/' + item.name.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase(),
            count: item.photoCount,
            views: item.viewCount
        };
    });

    const handleAlbumClick = (clickEvent, obj) => {
        onClick && onClick(clickEvent, obj);
    }

    return (
        <div className="galleryframe">
            <Title message={type + ' ' + source} />
            <RowsPhotoAlbum photos={photos}
                            spacing={0}
                            padding={5}
                            targetRowHeight={180}
                            rowConstraints={{ singleRowMaxHeight: 250 }}
                            render={{
                                extras: (_, { photo, index }) => (
                                    <Caption
                                        photo={photo}
                                        index={index} />
                                ),

                            }}
                            onClick={handleAlbumClick} />
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
            <p className="thumbnailheader">{photo.title}</p>
            {/*<p className="thumbnailstats">
                <label style={{width: '50%', padding: '0px', margin: '0 auto', display: 'inline-block'}}><span><Icon name="view" fill="#FFFFFF" />&nbsp;{photo.views}</span></label>
                <label style={{width: '50%', padding: '0px', margin: '0 auto', display: 'inline-block'}}><span><Icon name="photo" fill="#FFFFFF" />&nbsp;{photo.count}</span></label>
            </p>*/}
        </div>
    );
};

const Caption = ({ photo, index }) => {
    return (
        <div className="thumbnail">
            <p className="thumbnailheader">{photo.title}</p>
            <p className="thumbnailstats">
                <label style={{width: '50%', padding: '0px', margin: '0 auto', display: 'inline-block'}}><span><Icon name="view" fill="#FFFFFF" />&nbsp;{photo.views}</span></label>
                <label style={{width: '50%', padding: '0px', margin: '0 auto', display: 'inline-block'}}><span><Icon name="photo" fill="#FFFFFF" />&nbsp;{photo.count}</span></label>
            </p>
        </div>
    );
};


export default PhotoAlbum;