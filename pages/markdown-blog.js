import React, {useEffect, useState} from 'react';
import {useIndex} from '../common/hook'
import MetaTag from "../components/metatag";
import Title from "../components/title";
import ObjectDocument from "../components/objectdocument";

const pagetitle = 'Blog'
const source = 'blog';

function MarkdownBlog(props) {
    const index = useIndex();
    const [url, setUrl] = useState('');

    useEffect(() => {
        if(typeof window !== 'undefined'){
            setUrl(window.location.protocol + '//' + window.location.host);
        }
    }, [])

    return (
        <>
            <MetaTag page={source} index={index} url={url} description="Spring Integration with Splunk & Log4J2"/>
            <div className="boxouter">
                <div className="container">
                    <div className="articleframe">
                        <Title message={'Spring Integration with Splunk & Log4J2'} />
                        <div className="articlettitle">{pagetitle + ' by Devadyuti Das on 10 Dec, 2020'}</div>
                        <div className="articlecontainer">
                            <ObjectDocument />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MarkdownBlog;