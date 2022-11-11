import React, {useState, useEffect} from 'react';
import {API} from "aws-amplify";
import Image from 'next/image';
import {MEDIA_HOST} from "../common/constants";
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
            <Image src={MEDIA_HOST + '/images/' + source + '/' + story.image} alt={story.header} layout='responsive' width='100%' height='100%' />
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
        'findAboutUsList',
        '/aboutUsList',
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

export default AboutUs;