import React, {useEffect} from 'react';
import Link from 'next/link';
import {serverGet} from "../common/server-config";
import {getSessionCookie} from "../common/session";
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import ResponsiveNavigation from "../components/responsive-navigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import {HOST_NAME, INDEX_FLAG} from "../common/constants";

const pageTitle = 'Frequently Asked Questions'

function FrequentlyAskedQuestions({ menuList, handleLogout, authenticated, data, source, index, url }) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip,
                page: 'home',
                message: 'Frequetly Asked Question Page Accessed'
            }
        );
    }, [ddhomeCountry])

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="faqframe">
                        <Title message={pageTitle} />
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
    const source = 'frequently-asked-questions';
    const index = INDEX_FLAG;
    const url = HOST_NAME;

    // Call an external API endpoint to get data
    const menuList = await serverGet('findMenuList', '/menuList', [true]);

    const data = await serverGet('findFrequentlyAskedQuestionList', '/frequentlyAskedQuestionList');

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

export default FrequentlyAskedQuestions;