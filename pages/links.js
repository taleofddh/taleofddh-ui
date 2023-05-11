import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {API} from "aws-amplify";
import {useIndex} from '../common/hook'
import {getSessionCookie} from "../common/session";
import {postAuditEntry} from "../common/common";
import Icon from "../common/icon";
import MetaTag from "../components/metatag";
import Title from "../components/title";
import ResponsiveNavigation from "../components/responsivenavigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

const pagetitle = 'Useful Links'
const source = 'links';

function Links({ menuList, handleLogout, data }) {
    const index = useIndex();
    const [url, setUrl] = useState('');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        if(typeof window !== 'undefined'){
            setUrl(window.location.protocol + '//' + window.location.host);
        }
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'links',
                message: 'Links Page Accessed'
            }
        );
    }, [ddhomeCountry]);

    const handleClick = (clickEvent, object) => {
        clickEvent.preventDefault();
    }

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <MetaTag page={source} index={index} url={url} />
            <div className="boxouter">
                <div className="container">
                    <div className="linksframe">
                        <Title message={pagetitle} />
                        <ul className="linksgroup">
                            {data.map((item, index) => (
                                <li key={index} className="linkitem">
                                    {item.external ? (
                                        <a href={item.link} target="_blank" rel="noreferrer">
                                            <p className="linktitle">{item.name}</p>
                                            <p className="linkpiccontrol"><Icon name={item.icon} fill="rgb(97, 137, 47)"/></p>
                                            <p className="linktext">{item.summary}</p>
                                        </a>
                                    ) : (
                                        <Link href={item.link} as={item.link}>
                                            <p className="linktitle">{item.name}</p>
                                            <p className="linkpiccontrol"><Icon name={item.icon} fill="rgb(97, 137, 47)"/></p>
                                            <p className="linktext">{item.summary}</p>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticProps = async (context) => {
    // Call an external API endpoint to get data
    let res = await API.get(
        'findMenuList',
        '/menuList/true',
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );
    const menuList = await res.data;

    res = await API.get(
        'findLinkList',
        '/linkList/' + true,
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );
    const data = await res.data;

    // return the data
    return {
        props: {
            menuList,
            data
        },
    }
}

export default Links;