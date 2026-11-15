import React, {useEffect, useState} from 'react';
import {
    NavLink
} from "react-router-dom";
import {hasPermission} from "../common/permissions";
import {
    getSessionCookie,
    useSessionContext
} from "../common/session";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {useIndex} from "../common/hook";
import {postAuditEntry} from "../common/common";
import MetaTag from "../components/metatag";
import Loader from "../components/loader";
import Title from "../components/title";
import {onError} from "../common/error";
import EmailAdmin from "../components/email-admin";

const pageTitle = 'Administration';
const source = 'admin';

function Admin({permissions}) {
    const { isAuthenticated } = useSessionContext();
    const index = useIndex();
    const [url, setUrl] = useState('');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const [loading, isLoading] = useState(true);
    const isAdmin = hasPermission(permissions, 'messages:findMessageList');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip,
                page: 'user profile',
                message: 'User Profile Page Accessed by ' + getSessionCookie("credential").identityId
            }
        );
    }, [ddhomeCountry]);

    useEffect(() => {
        if(typeof window !== 'undefined'){
            setUrl(window.location.protocol + '//' + window.location.host);
        }
        isLoading(false);
    }, []);

    return (
        <>
            {loading ? (
                <Loader loading={loading} />
            ) : (
                <>
                    <MetaTag page={source} index={index} url={url} />
                    <div className="boxouter">
                        {isAuthenticated && isAdmin ? (
                            <div className="container" style={{width: '100%'}}>
                                <div className="adminframe">
                                    <Title message={pageTitle} />
                                    <div className="admincontainer">
                                        <Tabs>
                                            <TabList>
                                                <Tab>Email</Tab>
                                                <Tab>Gallery</Tab>
                                                <Tab>Blog</Tab>
                                            </TabList>
                                            <TabPanel>
                                                <EmailAdmin />
                                            </TabPanel>
                                            <TabPanel>
                                                <h2>Any content 2</h2>
                                            </TabPanel>
                                            <TabPanel>
                                                <h2>Any content 3</h2>
                                            </TabPanel>
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="container">
                                <div className="adminframe">
                                    <Title message={pageTitle + ' Not Found'} />
                                    <div className="errormessage">
                                        <p>You don&apos;t have access</p>
                                        <p>Please visit <NavLink to="/">Taleofddh Home Page</NavLink>  or <NavLink to="/sign-in">Sign-in</NavLink> to search for features</p>
                                        <p>If you have any specific query please <NavLink to="/contact-us">Contact Us</NavLink>.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

        </>
    )
}

export default Admin;