import React, {useState, useEffect} from 'react';
import { marked }  from "marked";
import ReactHtmlParser  from 'react-html-parser';
import { MEDIA_HOST} from "../common/constants";
import {useMediaQuery} from "../common/hook";

function Markdown({data, text, source, path}) {
    const [markDown, setMarkDown] = useState('');
    const isMobile = useMediaQuery('(max-width: 600px)');
    const isTablet = useMediaQuery('(max-width: 1200px)');
    const originalPath = '/desktop/'
    console.log(data);

    useEffect(() => {
        if (isMobile) {
            text = text.toString().replace(originalPath, '/mobile/');
        } else if (isTablet) {
            text = text.toString().replace(originalPath, '/tablet/');
        } else {
            text = text.toString();
        }
        setMarkDown(marked.parse(text).toString());

    }, [isMobile, isTablet, text])

    return (
        <>
            {data.images.map((item, index) => (
                <img key={index} className="articlelogocontrol" src={MEDIA_HOST + "/images/" + source + '/' + path + '/' + item} alt={item} />
            ))}
            <div className="articlemarkdown">{ReactHtmlParser(markDown)}</div>
        </>
    )
}

export default Markdown;