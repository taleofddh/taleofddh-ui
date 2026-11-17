import React from 'react';
import ReactHtmlParser from 'html-react-parser';
import {marked} from 'marked';

// Public intro text for a gallery category, sub-category or collection (markdown from the API).
function LevelIntro({text}) {
    if (!text) return null;
    return (
        <div className="photoalbumframe">
            <div className="photoalbumdescription">
                {ReactHtmlParser(marked(text))}
            </div>
        </div>
    )
}
export default LevelIntro;
