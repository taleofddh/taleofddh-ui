import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, {useEffect} from 'react';
import {NavLink, Link} from "react-router-dom";
import {useApi, useGet} from '../common/hook';
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import Loader from "../components/loader";
import MetaTag from "../components/metatag";
import '../../scss/pages/frequentlyaskedquestion.scss';
import {getSessionCookie} from "../common/session";

const pagetitle = 'Frequently Asked Questions'
const source = 'frequently-asked-questions';

function FrequentlyAskedQuestion(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const [data, loading] = useGet(
        'findFrequentlyAskedQuestionList', '/frequentlyAskedQuestionList'
    );
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
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
    }, [])

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="boxouter">
                <div className="container">
                    <div className="faqframe">
                        <Title message={pagetitle} />
                        <div className="faqcontainer">
                            {loading ? (
                                <Loader loading={loading} />
                            ) : (
                                <>
                                    {data.map((item, index) => (
                                        <FAQ key={index} faq={item} />
                                    ))}
                                    <div className="faqsection">
                                        If you have any further questions, please <NavLink to='/contact-us'>Contact Us</NavLink>.
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
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
            <NavLink to={route}>{routeMessage}</NavLink>;
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

export default FrequentlyAskedQuestion;