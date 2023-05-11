import React, {useEffect, useState} from 'react';
import {API} from "aws-amplify";
import {getSessionCookie} from "../common/session";
import {base64ToBlob, postAuditEntry} from "../common/common";
import {useIndex} from '../common/hook'
import MetaTag from "../components/metatag";
import Title from "../components/title";
import Collapse from "../components/collapse";
import Visit from "../components/visit";
import ResponsiveNavigation from "../components/responsivenavigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

const pagetitle = 'Travel Guides - Itinerary, Estimate & Forms';
const source = 'travel-guides';

function TravelGuides({ menuList, handleLogout, visitData, travelDocumentData }) {
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
                page: 'travel guides',
                message: 'Travel Guides Page Accessed'
            }
        );
    }, [ddhomeCountry]);

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
                    prefix: 'Travel/' + folder,
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
                                    <img src={"/images/logo-" + file.substring(file.lastIndexOf('.') + 1) + ".svg"} alt={file} />
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

    /*let items = {};
    items = travelDocumentData.map((item, index) => {
        let content = getContent(item.folder, item.files);
        return {...items, label: item.folder, children: content, key: '' + (index + 1)}
    });*/

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <MetaTag page={source} index={index} url={url} />
            <div className="boxouter">
                <div className="container">
                    <div className="travelguideframe">
                        <Title message={pagetitle} />
                        <div className="travelguidecontainer">
                            <Visit data={visitData} />
                            {/*<CollapseFolder items={items} />*/}
                            <ul className="travelguidegroup">
                                {travelDocumentData.map((item, index) => (
                                    <li key={index} className="travelguideitem">
                                        <div className="travelguidetitle">
                                            <Collapse header={item.folder} content={getContent(item.folder, item.files)} iconOpen="folderopen" iconClose="folderclose" onChange={handleChange}/>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
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
        'findCountryVisitStatus',
        '/countryVisitStatus',
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );
    const visitData = await res.data;

    res = await API.post(
        'findTravelDocuments',
        '/documentList',
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: {
                    prefix: 'Travel'
            }
        }
    );
    const travelDocumentData = await res.data;

    // return the data
    return {
        props: {
            menuList,
            visitData,
            travelDocumentData
        },
    }
}

export default TravelGuides;