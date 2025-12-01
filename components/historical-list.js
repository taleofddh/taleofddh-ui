import React from 'react';
import Title from './title';
import ListModule from "./list-module";
import ReactHtmlParser from "react-html-parser";
import {marked} from "marked";

function HistoricalList({ source, path, type, data, intro }) {
    return (
        <div className="galleryframe">
            <Title message={type + ' ' + source} />
            {intro ? (
                <div className="gallerycontainer">
                    <div className="galleryintro">
                        {ReactHtmlParser(marked(intro.toString()))}
                    </div>
                </div>
            ) : (
                <></>
            )}
            <ListModule source={source} path={path} list={data} />
        </div>
    )
}

export default HistoricalList;