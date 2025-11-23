import React from 'react';
import ReactHtmlParser  from 'react-html-parser';
import { marked }  from "marked";
import Title from './title';
import Carousel from "./carousel";
import ReactPlayer from "react-player";

function PhotoAlbum({ source, path, type, album, photos, videos }) {
    return (
        <div className="photoalbumframe">
            <Title message={album.name} />
            <ul className="photoalbumgroup">
                <li className="photoalbumimagecontainer">
                    <div className="photoalbumimage">
                        <img src={album.signedUrl} alt={album.titlePhoto} />
                    </div>
                </li>
                <li className="photoalbumtextcontainer">
                    <div className="photoalbumdescription">
                        {ReactHtmlParser(marked(album.description.toString()))}
                    </div>
                </li>
                <li className="photoalbumgallerycontainer">
                    <div className="photoalbumdescription">
                        <Carousel source={source} path={path} photos={photos} />
                    </div>
                </li>
                <li className="photoalbumgallerycontainer">
                    <div className="photoalbumdescription">
                        {videos.map((item, index) => (
                            <ReactPlayer key={index} src={item}  width='100%' height='100%' controls={true}/>
                        ))}
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default PhotoAlbum;