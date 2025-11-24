import React, {useEffect} from 'react';
import {runWithAmplifyServerContext} from "../../common/server-config";
import {get} from "aws-amplify/api/server";
import {get as clientGet} from "aws-amplify/api";
import {getSessionCookie} from "../../common/session";
import {base64ToBlob, postAuditEntry} from "../../common/common";
import Title from "../../components/title";
import Collapse from "../../components/collapse";
import Visit from "../../components/visit";
import ResponsiveNavigation from "../../components/responsive-navigation";
import Header from "../../components/header";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import {onError} from "../../common/error";
import {HOST_NAME, INDEX_FLAG} from "../../common/constants";

const pageTitle = 'Travel Guides - Itinerary, Estimate & Forms';

function TravelGuides({ menuList, handleLogout, authenticated, visitData, travelDocumentData, source, index, url }) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

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
    }, [ddhomeCountry]);

    const handleChange = async (key) => {
        console.log(key);
    }

    const handleDownload = async (folder, file, clickEvent) => {
        clickEvent.preventDefault();
        console.log(folder + '/' + file);

        try {
            const res = await clientGet({
                apiName: "getTravelDocument",
                path: "/travelDocument/Travel/" + folder + "/" + file,
                options: {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            }).response;

            const blob = base64ToBlob(await res.body.json(), res.headers['content-type']);

            const blobUrl = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = blobUrl;
            a.download = file;
            a.click();
        } catch (error) {
            onError(error);
        }
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
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="travelguideframe">
                        <Title message={pageTitle} />
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
    const source = 'travel-guides';
    const index = INDEX_FLAG;
    const url = HOST_NAME;

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

    const visitData = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findCountryVisitStatus',
                    path: '/countryVisitStatus',
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

    const travelDocumentData = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findTravelDocuments',
                    path: '/documentList/Travel',
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
            visitData,
            travelDocumentData,
            source,
            index,
            url
        },
    }
}

export default TravelGuides;