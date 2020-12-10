import React, {useState} from 'react';
import marked  from "marked";
import ReactHtmlParser  from 'react-html-parser';
import { MEDIA_HOST} from "../common/constants";
import Logo from "../common/logo";
import '../../scss/pages/article.scss';

function MarkedDown(props) {
    const [markDown, setMarkDown] = useState([]);

    async function loadMdPath(mdPath) {
        await fetch(mdPath)
            .then(async response => {
                return await response.text()
            })
            .then(text => {
                setMarkDown(marked(text));
            })
    }

    let content;
    if(props.section.type === 'Logo') {
        const arr = props.section.content.split(',');
        content = arr.map((item, index) => {
            return (<img key={index} className="articlelogocontrol" src={MEDIA_HOST + "/images/" + item}/>)
        });
    } else if (props.section.type === 'Markedown') {
        loadMdPath(MEDIA_HOST + "/" + props.section.content);
        return (<div className="articlemarkdown">{ReactHtmlParser(markDown)}</div>);
    }

    return (
        <>
            {content}
        </>
    )
}

export default MarkedDown;