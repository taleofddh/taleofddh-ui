import React, {useEffect} from 'react';
import {MEDIA_HOST} from "../common/constants";
import {useApi, useGet, useMediaQuery} from '../common/hook';
import {postAuditEntry} from "../common/common";
import {getSessionCookie} from "../common/session";
import Title from "../components/title";
import Loader from "../components/loader";
import MetaTag from "../components/metatag";
import StayConnected from "../components/stayconnected";
import '../../scss/pages/aboutus.scss';

const pagetitle = 'About Us'
const source = 'about-us';

function AboutUs(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const [data, loading] = useGet(
        'findAboutUsList', '/aboutUsList'
    );
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    const matches = useMediaQuery('screen and (max-width: 820px)');

    useEffect(() => {
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
    }, []);

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="boxouter">
                <div className="container">
                    <div className="aboutusframe">
                        <Title message={pagetitle} />
                        {loading ? (
                            <Loader loading={loading} />
                        ) : (
                            <>
                                {data.map((item, index) => (
                                    <Story key={index} story={item} index={index} mobile={matches} />
                                ))}
                                <StayConnected />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

function Story(props) {
    let image =
        <div className="storyimage">
            <img src={MEDIA_HOST + '/images/' + source + '/' + props.story.image} alt={props.story.header} />
        </div>

    let text =
        <div className="story">
            <p className="storytitle">
                <label>
                    {props.story.header}
                </label>
            </p>
            <p className="storydescription">
                <label>
                    {props.story.description}
                </label>
            </p>
        </div>

    return (
        <div className="storycontainer">
            {props.index % 2 === 0 || props.mobile === true ? (
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

export default AboutUs;