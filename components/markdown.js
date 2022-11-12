import React, {useState, useEffect} from 'react';
import {API} from 'aws-amplify';
import { marked }  from "marked";
import ReactHtmlParser  from 'react-html-parser';
import { MEDIA_HOST} from "../common/constants";
import Logo from "../common/logo";
import {useMediaQuery} from "../common/hook";

function Markdown({section}) {
    const [markDown, setMarkDown] = useState([]);
    const isMobile = useMediaQuery('(max-width: 600px)');
    const isTablet = useMediaQuery('(max-width: 1200px)');
    const originalPath = '/desktop/'

    useEffect(() => {
        const loadMdText = async () => {
            const key = section.content;
            if (section.type === 'Markdown') {
                await API.post(
                    'getArticleDocument',
                    '/articleDocument',
                    {
                        response: true,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: {
                            prefix: key.substring(0, key.lastIndexOf('/')),
                            file: key.substring(key.lastIndexOf('/') + 1)
                        }
                    }
                )
                    .then(async response => {
                        return await response.data
                    })
                    .then(async text => {
                        if (isMobile) {
                            text = text.toString().replace(originalPath, '/mobile/');
                        } else if (isTablet) {
                            text = text.toString().replace(originalPath, '/tablet/');
                        }
                        setMarkDown(marked(text.toString()));
                    });
            }
        }
        loadMdText();
    }, [isMobile, isTablet, section])

    let content;
    if(section.type === 'Logo') {
        const arr = section.content.split(',');
        content = arr.map((item, index) => {
            return (<img key={index} className={section.styleClass} src={MEDIA_HOST + "/images/" + item} alt={item} />)
        });
    } else if (section.type === 'Markdown') {
        content = <div className={section.styleClass}>{ReactHtmlParser(markDown)}</div>;
    }

    return (
        <>
            {content}
        </>
    )
}

export default Markdown;