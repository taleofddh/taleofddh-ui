import React, {useState} from 'react';
import marked  from "marked";
import ReactHtmlParser  from 'react-html-parser';
import { AWS_CONFIG, MEDIA_HOST} from "../common/constants";
import { getObject } from "../common/common";
import Logo from "../common/logo";
import '../../scss/pages/article.scss';

function Markdown(props) {
    const [markDown, setMarkDown] = useState([]);

    async function loadMdPath(bucket, key) {
        await getObject(bucket, key)
            .then(async response => {
                return await response.Body
            })
            .then(text => {
                setMarkDown(marked(text.toString('utf-8')));
            })
    }

    let content;
    if(props.section.type === 'Logo') {
        const arr = props.section.content.split(',');
        content = arr.map((item, index) => {
            return (<img key={index} className="articlelogocontrol" src={MEDIA_HOST + "/images/" + item}/>)
        });
    } else if (props.section.type === 'Markdown') {
        loadMdPath(AWS_CONFIG.s3.BLOG_BUCKET, props.section.content);
        return (<div className="articlemarkdown">{ReactHtmlParser(markDown)}</div>);
    }

    return (
        <>
            {content}
        </>
    )
}

export default Markdown;