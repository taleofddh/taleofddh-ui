import React, {useState, useEffect} from 'react';
import { marked }  from "marked";
import ReactHtmlParser  from 'react-html-parser';
import { MEDIA_HOST} from "../common/constants";

function Markdown({data, text, source, path}) {
    const [markDown, setMarkDown] = useState('');
    //console.log(data);

    useEffect(() => {
        // One standard image per file: no mobile/tablet/desktop variants to swap in
        setMarkDown(marked.parse(text.toString()).toString());
    }, [text])

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