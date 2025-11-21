import React from 'react';
import Link from 'next/link';
import { get } from 'aws-amplify/api/server';
import { runWithAmplifyServerContext } from '../common/serverconfig';
import {APP_LONG_NAME, HOST_NAME, INDEX_FLAG} from "../common/constants";
import Title from "../components/title";
import Footer from "../components/footer";
import ResponsiveNavigation from "../components/responsivenavigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import {getSessionCookie} from "../common/session";

const pagetitle = APP_LONG_NAME + ' Page Not Found';

function Error({menuList, handleLogout, authenticated, source, index, url}) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
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
    const source = 'error';
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

    // return the data
    return {
        props: {
            menuList,
            source,
            index,
            url
        },
    }
}


export default Error;