import React, {useEffect} from 'react';
import {NavLink, withRouter} from "react-router-dom";
import {useIndex, useGet} from '../common/hook'
import {getSessionCookie} from "../common/session";
import {postAuditEntry} from "../common/common";
import Icon from "../common/icon";
import MetaTag from "../components/metatag";
import Title from "../components/title";
import Loader from "../components/loader";
import '../../scss/pages/links.scss';

const pagetitle = 'Useful Links'
const source = 'links';

function Links(props) {
    const index = useIndex(window.location.hostname, window.location.protocol);
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    const [data, loading] = useGet(
        'findLinkList',
        '/linkList/' + true,
        'links'
    );

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
    }, []);

    const handleClick = (clickEvent, object) => {
        clickEvent.preventDefault();
    }

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="boxouter">
                <div className="container">
                    <div className="linksframe">
                        <Title message={pagetitle} />
                        {loading ? (
                            <Loader loading={loading} />
                        ) : (
                            <ul className="linksgroup">
                                {data.map((item, index) => (
                                    <li key={index} className="linkitem">
                                        {item.external ? (
                                            <a href={item.link} target="_blank">
                                                <p className="linktitle">{item.name}</p>
                                                <p className="linkpiccontrol"><Icon name={item.icon} fill="rgb(43, 84, 127)"/></p>
                                                <p className="linktext">{item.summary}</p>
                                            </a>
                                        ) : (
                                            <NavLink to={item.link}>
                                                    <p className="linktitle">{item.name}</p>
                                                    <p className="linkpiccontrol"><Icon name={item.icon} fill="rgb(43, 84, 127)"/></p>
                                                    <p className="linktext">{item.summary}</p>
                                            </NavLink>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}



export default withRouter(Links);