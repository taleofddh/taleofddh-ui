import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import { get } from 'aws-amplify/api/server';
import { getUrl } from "aws-amplify/storage/server";
import { runWithAmplifyServerContext } from '../common/serverconfig';
import {HOST_NAME, INDEX_FLAG, MEDIA_HOST, MEDIA_PROTECTED_HOST, PAGE_REVALIDATE_PERIOD} from "../common/constants";
import {useIndex, useMediaQuery} from '../common/hook';
import {postAuditEntry} from "../common/common";
import {getSessionCookie} from "../common/session";
import Title from "../components/title";
import MetaTag from "../components/metatag";
import StayConnected from "../components/stayconnected";
import ResponsiveNavigation from "../components/responsivenavigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

const pagetitle = 'About Us'
const source = 'about-us';

function AboutUs({ menuList, handleLogout, data }) {
    const index = useIndex();
    const [url, setUrl] = useState('');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    const matches = useMediaQuery('screen and (max-width: 820px)');

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
                page: 'about us',
                message: 'About Us Page Accessed'
            }
        );
    }, [ddhomeCountry]);

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <MetaTag page={source} index={index} url={url} />
            <div className="boxouter">
                <div className="container">
                    <div className="aboutusframe">
                        <Title message={pagetitle} />
                        {data.map((item, i) => (
                            <Story key={i} story={item} index={i} mobile={matches} />
                        ))}
                        <StayConnected />
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

function Story({story, index, mobile}) {
    let image =
        <div className="storyimage">
            {/*<Image src={MEDIA_HOST + '/images/' + source + '/' + story.image} alt={story.header} layout='responsive' width={1} height={1}/>*/}
            <img src={story.signedUrl} alt={story.image} />
        </div>

    let text =
        <div className="story">
            <p className="storytitle">
                <label>
                    {story.header}
                </label>
            </p>
            <p className="storydescription">
                <label>
                    {story.description}
                </label>
            </p>
        </div>

    return (
        <div className="storycontainer">
            {index % 2 === 0 || mobile === true ? (
                <>
                    {image}
                    {text}
                </>
            ) : (
                <>
                    {text}
                    {image}
                </>
            )}
        </div>
    )
}

// This function gets called at build time
export const getStaticProps = async (context) => {
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
                    apiName: 'findAboutUsList',
                    path: '/aboutUsList',
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
    console.log(data);

    // return the data
    return {
        props: {
            menuList,
            data
        },
        revalidate: PAGE_REVALIDATE_PERIOD * 2, // In seconds
    }
}

export default AboutUs;