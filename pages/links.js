import React, {useEffect} from 'react';
import Link from 'next/link';
import {runWithAmplifyServerContext} from "../common/server-config";
import {get} from "aws-amplify/api/server";
import {getSessionCookie} from "../common/session";
import {postAuditEntry} from "../common/common";
import Icon from "../common/icon";
import Title from "../components/title";
import ResponsiveNavigation from "../components/responsive-navigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import {HOST_NAME, INDEX_FLAG} from "../common/constants";

const pageTitle = 'Useful Links'

function Links({ menuList, handleLogout, authenticated, data, source, index, url }) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
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
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="linksframe">
                        <Title message={pageTitle} />
                        <ul className="linksgroup">
                            {data.map((item, index) => (
                                <li key={index} className="linkitem">
                                    {item.external ? (
                                        <a href={item.link} target="_blank" rel="noreferrer">
                                            <p className="linktitle">{item.name}</p>
                                            <p className="linkpiccontrol"><Icon name={item.icon} fill="rgb(134, 194, 50)"/></p>
                                            <p className="linktext">{item.summary}</p>
                                        </a>
                                    ) : (
                                        <Link href={item.link} as={item.link}>
                                            <p className="linktitle">{item.name}</p>
                                            <p className="linkpiccontrol"><Icon name={item.icon} fill="rgb(134, 194, 50)"/></p>
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
    const source = 'links';
    const index = INDEX_FLAG;
    const url = HOST_NAME;

    // Call an external API endpoint to get data
    const menuList = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findMenuList',
                    path: '/menuList/true',
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                }).response;
                return body.json();
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    });

    const data = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findLinkList',
                    path: '/linkList/true',
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                }).response;
                return body.json();
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    });

    // return the data
    return {
        props: {
            menuList,
            data,
            source,
            index,
            url
        },
    }
}

export default Links;