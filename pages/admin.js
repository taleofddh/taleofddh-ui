import React, {useEffect, useState} from 'react';
import {
    NavLink
} from "react-router-dom";
import {get} from "aws-amplify/api";
import {fetchAuthSession} from "aws-amplify/auth";
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

function Admin(props) {
    const { isAuthenticated, userHasAuthenticated } = useSessionContext();
    const index = useIndex();
    const [url, setUrl] = useState('');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const [isAdmin, setAdmin] = useState(false);
    const [data, setData] = useState([]);
    const [loading, isLoading] = useState(true);

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'user profile',
                message: 'User Profile Page Accessed by ' + getSessionCookie("credential").identityId
            }
        );
    }, [ddhomeCountry]);

    useEffect(() => {
        if(typeof window !== 'undefined'){
            setUrl(window.location.protocol + '//' + window.location.host);
        }
        const onLoad = async () => {
            try {
                let res = await get({
                    apiName: 'findUserRole',
                    path: '/findUserRole',
                    options: {
                        response: true,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    }
                }).response;
                setData(await res.body.json());

                const {identityId} = await fetchAuthSession({ forceRefresh: true });
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
                isLoading(false);
            }
            catch(e) {
                if (e !== 'No current user') {
                    onError(e);
                }
                isLoading(false);
            }
        }
        onLoad();
    }, [isAuthenticated, userHasAuthenticated]);

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