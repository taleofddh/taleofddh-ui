import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import { MEDIA_HOST} from "../common/constants";
import {useApi, useGet, useMediaQuery} from "../common/hook";
import Gallery from 'react-grid-gallery';
import '../../scss/components/thumbnail.scss';

function Thumbnail(props) {
    const match = useMediaQuery('(max-width: 820px)');
    let images = {};
    images = props.pictures.map((item, index) => {
        return {...images,
            src : MEDIA_HOST + '/images/thumbnail/' + item.titlePhoto.path + '/' + item.titlePhoto.name + '.jpg',
            thumbnail : MEDIA_HOST + '/images/thumbnail/' + item.titlePhoto.path + '/' + item.titlePhoto.name + '.jpg',
            thumbnailWidth: (item.titlePhoto.maxWidth) / 6,
            thumbnailHeight: (item.titlePhoto.maxHeight) / 6,
            thumbnailCaption: item.name,
            alt: item.name
        };
    })

    const handleAlbumClick = async (index) => {
        alert(images[index].caption);
    }

    return (
        <div className="thumbnailset">
            <Gallery images={images}
                     rowHeight="180"
                     enableLightbox={false}
                     enableImageSelection={false}
                     showLightboxThumbnails={true}
                     onClickThumbnail={handleAlbumClick} />
        </div>
/*        <ul className="thumbnailgroup">
            {props.pictures.map((item, index) => (
                <li className="thumbnailitem">
                    <div className="thumbnail" style ={{backgroundImage: 'url("' + MEDIA_HOST + '/images/thumbnail/' + item.titlePhoto.path + '/' + item.titlePhoto.name + '.jpg")', backgroundPositionX: 'center',
                        backgroundPositionY: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
                        <p className="thumbnaulheader">
                            {item.name}
                        </p>
                    </div>

                </li>
            ))
            }
        </ul>*/
    )

}

export default Thumbnail;