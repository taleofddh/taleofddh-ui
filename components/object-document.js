import React, {useState, useEffect} from 'react';
import {post} from "aws-amplify/api";
import marked  from "marked";
import ReactHtmlParser  from 'html-react-parser';
import {onError} from "../common/error";

function ObjectDocument(props) {
    const [markDown, setMarkDown] = useState([]);

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

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- loads the document on mount; state is set after the async fetch
        loadMdPath('Technical/spring-log4j2-splunk.md');
    }, []);

    return (
        <>
            <div className="articlemarkdown">{ReactHtmlParser(markDown)}</div>
        </>
    )
}

export default ObjectDocument;