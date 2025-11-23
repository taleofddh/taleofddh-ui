import React, {useState, useEffect} from 'react';
import {post} from "aws-amplify/api";
import marked  from "marked";
import ReactHtmlParser  from 'react-html-parser';
import {onError} from "../common/error";

function ObjectDocument(props) {
    const [markDown, setMarkDown] = useState([]);

    useEffect(() => {
        loadMdPath('Technical/spring-log4j2-splunk.md');
    }, []);

    async function loadMdPath(key) {
        try {
            const res = await post({
                apiName: "getArticleDocument",
                path: "/articleDocument",
                options: {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: {prefix: key.substring(0, key.lastIndexOf('/')), file: key.substring(key.lastIndexOf('/') + 1)}
                }
            }).response;
            const text = await res.body.json();
            setMarkDown(marked(text));
        } catch (e) {
            onError(e);
        }
    }

    return (
        <>
            <div className="articlemarkdown">{ReactHtmlParser(markDown)}</div>
        </>
    )
}

export default ObjectDocument;