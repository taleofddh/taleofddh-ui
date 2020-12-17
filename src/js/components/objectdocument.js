import React, {useState, useEffect} from 'react';
import marked  from "marked";
import ReactHtmlParser  from 'react-html-parser';
import {AWS_CONFIG} from "../common/constants";
import {getObject} from "../common/common";
import '../../scss/pages/article.scss';

function ObjectDocument(props) {
    const [markDown, setMarkDown] = useState([]);

    useEffect(() => {
        loadMdPath(AWS_CONFIG.s3.BLOG_BUCKET, 'technical/spring-log4j2-splunk.md');
    }, []);

    async function loadMdPath(bucket, key) {
        await getObject(bucket, key)
            .then(async response => {
                return await response.Body
            })
            .then(text => {
                setMarkDown(marked(text.toString('utf-8')));
            })
    }

    return (
        <>
            <div className="articlemarkdown">{ReactHtmlParser(markDown)}</div>
        </>
    )
}

export default ObjectDocument;