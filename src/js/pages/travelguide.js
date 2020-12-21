import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, {useEffect, useState} from 'react';
import {withRouter} from "react-router-dom";
import {useApi, usePost} from '../common/hook'
import {getSessionCookie} from "../common/session";
import {postAuditEntry} from "../common/common";
import MetaTag from "../components/metatag";
import Title from "../components/title";
import Map from "../components/map";
import CollapseFolder from "../components/collapsefolder";
import Loader from "../components/loader";
import '../../scss/pages/travelguide.scss';

const pagetitle = 'Travel Guides - Itinerary, Estimate & Forms'
const source = 'travel-guides';

function TravelGuide(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const[data, loading] = usePost(
        'findTravelDocuments',
        '/documentList',
        {
            prefix: 'Travel'
        }
    );

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'travel guides',
                message: 'Travel Guides Page Accessed'
            }
        );
    }, []);

    const handleChange = async (key) => {
        console.log(key);
    }

    const getContent = (files) => {
        return (
            <ul className="traveldocumentsgroup">
                {files.map((file, index) => (
                    file === '' ? (
                        <>
                        </>
                    ) : (
                        <li key={index} className="traveldocumentitem">
                            <p className="traveldocumenttitle">
                                <span className="travelguidedocumentlogo">
                                    <img src={"/images/logo-" + file.substr(file.lastIndexOf('.') + 1) + ".svg"} />
                                </span>
                                <span className="travelguidedocumenttext">
                                    {file}
                                </span>
                            </p>
                        </li>
                    )
                ))}
            </ul>
        )
    }

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="boxouter">
                <div className="container">
                    <div className="travelguideframe">
                        <Title message={pagetitle} />
                        <div className="travelguidecontainer">
                            <Map/>
                            {loading ? (
                                <Loader loading={loading} />
                            ) : (
                                <ul className="travelguidegroup">
                                    {data.map((item, index) => (
                                        <li key={index} className="travelguideitem">
                                            <div className="travelguidetitle"><CollapseFolder header={item.folder} content={getContent(item.files)} onChange={handleChange}/></div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withRouter(TravelGuide);