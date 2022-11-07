import React, {useEffect, useState} from 'react';
import {
    NavLink
} from "react-router-dom";
import {
    getSessionCookie,
    useSessionContext
} from "../common/session";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {useIndex, useGet} from "../common/hook";
import {postAuditEntry} from "../common/common";
import MetaTag from "../components/metatag";
import Loader from "../components/loader";
import Title from "../components/title";
import {Auth} from "aws-amplify";
import {onError} from "../common/error";
import EmailAdmin from "../components/emailadmin";

const pagetitle = 'Administration';
const source = 'admin';

function Admin(props) {
    const { isAuthenticated, userHasAuthenticated } = useSessionContext();
    const index = useIndex(window.location.hostname, window.location.protocol);
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const [isAdmin, setAdmin] = useState(false);
    const [data, loading] = useGet(
        'findUserRole',
        '/findUserRole'
    )

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'admin',
                message: 'Admin Page Accessed'
            }
        );
    }, []);

    useEffect(() => {
        onLoad();
    }, [data]);

    async function onLoad() {
        try {
            await Auth.currentSession();
            userHasAuthenticated(true);
            if(isAuthenticated) {
                let admin = false;
                data.roleList.map((item) => {
                    if(item.name === 'Administrator') {
                        admin = true;
                    }
                });
                setAdmin(admin);
            }
        }
        catch(e) {
            if (e !== 'No current user') {
                onError(e);
            }
        }
    }

    return (
        <>
            {loading ? (
                <Loader loading={loading} />
            ) : (
                <>
                    <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
                    <div className="boxouter">
                        {isAuthenticated && isAdmin ? (
                            <div className="container" style={{width: '100%'}}>
                                <div className="adminframe">
                                    <Title message={pagetitle} />
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
                                    <Title message={pagetitle + ' Not Found'} />
                                    <div className="errormessage">
                                        <p>Your are not authorised to access the page. This page is only available for selected users.</p>
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