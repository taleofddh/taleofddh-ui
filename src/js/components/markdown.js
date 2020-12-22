import React, {useState} from 'react';
import {API} from 'aws-amplify';
import marked  from "marked";
import ReactHtmlParser  from 'react-html-parser';
import { MEDIA_HOST} from "../common/constants";
import Logo from "../common/logo";
import '../../scss/pages/article.scss';

function Markdown(props) {
    const [markDown, setMarkDown] = useState([]);

    async function loadMdText(key) {
        await API.post(
            'getArticleDocument',
            '/articleDocument',
            {
                response: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: {prefix: key.substring(0, key.lastIndexOf('/')), file: key.substring(key.lastIndexOf('/') + 1)}
            }
        )
            .then(async response => {
            return await response.data
        })
            .then(text => {
                setMarkDown(marked(text));
            });
    }

    let content;
    if(props.section.type === 'Logo') {
        const arr = props.section.content.split(',');
        content = arr.map((item, index) => {
            return (<img key={index} className="articlelogocontrol" src={MEDIA_HOST + "/images/" + item}/>)
        });
    } else if (props.section.type === 'Markdown') {
        loadMdText(props.section.content);
        return (<div className="articlemarkdown">{ReactHtmlParser(markDown)}</div>);
    }

    return (
        <>
            {content}
        </>
    )
}

export default Markdown;