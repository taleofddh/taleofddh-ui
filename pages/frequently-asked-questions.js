import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {runWithAmplifyServerContext} from "../common/serverconfig";
import {get} from "aws-amplify/api/server";
import {getSessionCookie} from "../common/session";
import {useIndex} from '../common/hook';
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import MetaTag from "../components/metatag";
import ResponsiveNavigation from "../components/responsivenavigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

const pagetitle = 'Frequently Asked Questions'
const source = 'frequently-asked-questions';

function FrequentlyAskedQuestions({ menuList, handleLogout, data }) {
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
                page: 'home',
                message: 'Frequetly Asked Question Page Accessed'
            }
        );
    }, [ddhomeCountry])

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <MetaTag page={source} index={index} url={url} />
            <div className="boxouter">
                <div className="container">
                    <div className="faqframe">
                        <Title message={pagetitle} />
                        <div className="faqcontainer">
                            {data.map((item, index) => (
                                <FAQ key={index} faq={item} />
                            ))}
                            <div className="faqsection">
                                If you have any further questions, please <Link href='/contact-us' as='/contact-us'>Contact Us</Link>.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

function FAQ(props) {
    let title;
    if(props.faq.section === 'General') {
        title = '';
    } else {
        title = props.faq.section;
    }
    return(
        <div className="faqsection">
            {title !== '' ? (
                <div className="faqtitle">
                    {title}
                </div>
            ) : (
                <>
                </>
            )}
            {props.faq.questionAndAnswerList.map(item => (
                <QAndA key={item.sequence} qAndA={item}/>
            ))}
        </div>
    )
}

function QAndA(props) {
    let qAndAClass;
    let route = '';
    if (props.qAndA.key.indexOf("Route") > -1) {
        route = props.qAndA.key.substring(6, props.qAndA.key.length);
        qAndAClass = "faqdescription";
    } else {
        qAndAClass = 'faqdescription';
    }

    let routerMessage;
    let startmessage = '';
    let endmessage = '';
    if(route !== '') {
        let tempMessage = props.qAndA.answer;
        let linkStart = tempMessage.indexOf('<link>');
        let linkEnd = tempMessage.indexOf('</link>');
        let routeMessage = tempMessage.substring(linkStart + 6, linkEnd);
        if(linkStart> 0) {
            startmessage = tempMessage.substring(0, linkStart);
        }
        if(linkEnd + 8 < tempMessage.length) {
            endmessage = tempMessage.substring(linkEnd + 7, tempMessage.length)
        }
        routerMessage =
            <Link href={route} as={route}>{routeMessage}</Link>;
    } else {
        routerMessage = props.qAndA.answer;
    }

    let message =
        <>
            {startmessage}
            {routerMessage}
            {endmessage}
        </>

    return (
        <div className="faq">
            <p>
                <label className={qAndAClass}>
                    Q. {props.qAndA.question}
                </label>
            </p>
            <p>
                <label className={qAndAClass}>
                    A. {message}
                </label>
            </p>
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
                    apiName: 'findFrequentlyAskedQuestionList',
                    path: '/frequentlyAskedQuestionList',
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
            data
        },
    }
}

export default FrequentlyAskedQuestions;