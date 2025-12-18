import React, {useEffect} from 'react';
import {serverGet} from '../common/server-config';
import {HOST_NAME, INDEX_FLAG, PAGE_REVALIDATE_PERIOD} from "../common/constants";
import {useMediaQuery} from '../common/hook';
import {postAuditEntry} from "../common/common";
import {getSessionCookie} from "../common/session";
import Title from "../components/title";
import StayConnected from "../components/stay-connected";
import ResponsiveNavigation from "../components/responsive-navigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

const pageTitle = 'About Us'

function AboutUs({ menuList, handleLogout, authenticated, data, source, index, url }) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    const matches = useMediaQuery('screen and (max-width: 820px)');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip,
                page: 'about us',
                message: 'About Us Page Accessed'
            }
        );
    }, [ddhomeCountry]);

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="aboutusframe">
                        <Title message={pageTitle} />
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
    const source = 'about-us';
    const index = INDEX_FLAG;
    const url = HOST_NAME;

    // Call an external API endpoint to get data
    const menuList = await serverGet('findMenuList', '/menuList', [true]);

    const data = await serverGet('findAboutUsList', '/aboutUsList');
    //console.log(data);

    // return the data
    return {
        props: {
            menuList,
            data,
            source,
            index,
            url
        },
        revalidate: PAGE_REVALIDATE_PERIOD * 2, // In seconds
    }
}

export default AboutUs;