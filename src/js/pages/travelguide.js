import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, {useEffect} from 'react';
import {withRouter} from "react-router-dom";
import {useApi, useGet, usePost} from '../common/hook'
import {getSessionCookie} from "../common/session";
import {base64ToBlob, postAuditEntry} from "../common/common";
import MetaTag from "../components/metatag";
import Title from "../components/title";
import CollapseFolder from "../components/collapsefolder";
import Loader from "../components/loader";
import '../../scss/pages/travelguide.scss';
import {API} from "aws-amplify";
import Visit from "../components/visit";

const pagetitle = 'Travel Guides - Itinerary, Estimate & Forms'
const source = 'travel-guides';

function TravelGuide(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const[visitData, visitDataLoading] = useGet(
        'findCountryVisitStatus',
        '/countryVisitStatus',
        'countryVisitStatus'
    )
    const[travelDocumentData, travelDocumentDataLoading] = usePost(
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

    const handleDownload = async (folder, file, clickEvent) => {
        clickEvent.preventDefault();
        console.log(folder + '/' + file);
        await API.post(
            'getTravelDocument',
            '/travelDocument',
            {
                response: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: {
                    prefix: 'Travel' + '/' + folder,
                    file: file
                }
            }
        )
            .then(async (response) => {
                return base64ToBlob(await response.data, response.headers['content-type'])
            })
            .then((blob) => {
                const blobUrl = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = blobUrl;
                a.download = file;
                a.click();
            })

    }

    const getContent = (folder, files) => {
        return (
            <ul className="traveldocumentsgroup">
                {files.map((file, idx) => (
                    file === '' ? (
                        <li key={idx} className="traveldocumentblank">
                        </li>
                    ) : (
                        <li key={idx} className="traveldocumentitem" onClick={(e) => handleDownload(folder, file, e)}>
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
                            {visitDataLoading || travelDocumentDataLoading ? (
                                <Loader loading={visitDataLoading || travelDocumentDataLoading} />
                            ) : (
                                <>
                                    <Visit data={visitData} />
                                    <ul className="travelguidegroup">
                                        {travelDocumentData.map((item, index) => (
                                            <li key={index} className="travelguideitem">
                                                <div className="travelguidetitle">
                                                    <CollapseFolder header={item.folder} content={getContent(item.folder, item.files)} onChange={handleChange}/>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withRouter(TravelGuide);