import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import { get } from 'aws-amplify/api/server';
import { runWithAmplifyServerContext } from '../common/serverconfig';
import {APP_LONG_NAME, HOST_NAME, INDEX_FLAG} from "../common/constants";
import {useIndex} from '../common/hook'
import Title from "../components/title";
import MetaTag from "../components/metatag";
import Footer from "../components/footer";
import ResponsiveNavigation from "../components/responsivenavigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import {getSessionCookie} from "../common/session";

const pagetitle = APP_LONG_NAME + ' Page Not Found';
const source = 'error';

function Error({menuList, handleLogout}) {
    const index = useIndex();
    const [url, setUrl] = useState('');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    useEffect( () => {
        if(typeof window !== 'undefined'){
            setUrl(window.location.protocol + '//' + window.location.host);
        }
    }, []);

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <MetaTag page={source} index={index} url={url} />
            <div className="boxouter">
                <div className="container">
                    <div className="errorframe">
                        <Title message={pagetitle} />
                        <div className="errormessage">
                            <p>Your requested page is not available or the application has generated an error.</p>
                            <p>Please visit <Link href="/home" as="/">Tale of DDH Home Page</Link> to search for services</p>
                            <p>If you have any specific query please <Link href="/contact-us" as="/contactus">Contact Us</Link>.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticProps = async ({context}) => {
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

    // return the data
    return {
        props: {
            menuList,
        },
    }
}


export default Error;