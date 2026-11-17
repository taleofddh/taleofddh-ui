import React, {useState, useEffect} from 'react';
import {renderMarkdown} from "../common/markdown-render";
import ReactHtmlParser  from 'html-react-parser';
import { MEDIA_HOST} from "../common/constants";

function Markdown({data, text, source, path}) {
    const [markDown, setMarkDown] = useState('');
    //console.log(data);

    useEffect(() => {
        // One standard image per file: no mobile/tablet/desktop variants to swap in
        // eslint-disable-next-line react-hooks/set-state-in-effect -- renderMarkdown needs the DOM (DOMPurify); client-only to avoid hydration mismatch
        setMarkDown(renderMarkdown(text));
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