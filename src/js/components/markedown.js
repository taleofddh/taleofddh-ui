import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, {useState, useEffect} from 'react';
import marked  from "marked";
import ReactHtmlParser  from 'react-html-parser';
import { MEDIA_HOST} from "../common/constants";
import Loader from "./loader";

function MarkedDown(props) {
    const [markDown, setMarkDown] = useState([]);
    const mdPath = MEDIA_HOST + "/blogs/technical/spring-log4j2-splunk.md";
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        onLoad();
    }, []);

    async function onLoad() {
        await fetch(mdPath)
            .then(async response => {
                return await response.text()
            })
            .then(text => {
                setMarkDown(marked(text));
            })
        setIsLoading(false);
    }

    return (
        <>
            {isLoading ? (
                <Loader loading={isLoading} />
            ) : (
                <div className="articlecontainer">
                    <div style={{padding: '0px 10px'}}>{ReactHtmlParser(markDown)}</div>
                </div>
            )}

        </>
    )
}

export default MarkedDown;