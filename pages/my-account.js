import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {serverGet} from "../common/server-config";
import {get, post} from 'aws-amplify/api';
import {fetchAuthSession, fetchUserAttributes} from "aws-amplify/auth";
import {getSessionCookie} from "../common/session";
import Header from '../components/header';
import Navigation from '../components/navigation';
import ResponsiveNavigation from "../components/responsive-navigation";
import Footer from "../components/footer";
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import {onError} from "../common/error";
import Loader from "../components/loader";
import Icon from "../common/icon"
import {HOST_NAME, INDEX_FLAG} from "../common/constants";
import Family from "../components/family";

const pagetitle = "My Account"

function MyAccount({menuList, handleLogout, authenticated, family, source, index, url}) {
    const [data, setData] = useState([]);
    const [loading, isLoading] = useState(true);
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip,
                page: 'my-account',
                message: 'My Account Page Accessed by ' + getSessionCookie("credential").sub
            }
        );
    }, [ddhomeCountry]);

    useEffect(() => {
        const onLoad = async () => {
            try {
                const {identityId} = await fetchAuthSession({ forceRefresh: true });
                const attributes = await fetchUserAttributes();

                await post({
                    apiName: "createOrUpdateUserProfile",
                    path: "/createOrUpdateUserProfile",
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: {userId: attributes.sub, identityId: identityId, email: attributes.email, updatedAt: new Date(), lastLogin: new Date(), family: family},
                    }
                }).response;

                let res = await get({
                    apiName: 'findUserProfile',
                    path: '/findUserProfile',
                    options: {
                        response: true,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    }
                }).response;
                const profile = await res.body.json();
                const roles = profile.roles.map((item) => {
                    return item.code;
                })
                //console.log(profile);
                res = await post({
                    apiName: 'findRoleBasedMenuList',
                    path: '/roleBasedMenuList',
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body : {
                            active: 'true',
                            roles: roles
                        }
                    }
                }).response;
                setData(await res.body.json());
                //console.log(data);
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
    }, []);

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="myaccountframe">
                        <Title message={pagetitle} />
                        {loading ? (
                            <Loader loading={loading} />
                        ) : (
                            <div className="myaccountcontainer">
                                {Object.keys(family).length === 0 && family.constructor === Object? (
                                    <></>
                                ) : (
                                    <Family source={source} type="people" family={family} />
                                )}
                                <ul className="myaccountgroup">
                                    {data.map((item, index) => (
                                        <li key={index} className="myaccountitem">
                                            <div className="myaccountmenu">
                                                <Link href={{
                                                    pathname: item.link,
                                                    query: {
                                                        communityCode: family ? family.communityCode : ''
                                                    }
                                                }} as={item.link}>
                                                    <Icon name={item.icon} fill='rgb(134, 194, 50)' />&nbsp;{item.name}
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticProps = async ({context}) => {
    const source = 'my-account';
    const index = INDEX_FLAG;
    const url = HOST_NAME;

    // Call an external API endpoint to get data
    const menuList = await serverGet('findMenuList', '/menuList', [true]);

    // return the data
    return {
        props: {
            menuList,
            source,
            index,
            url
        },
    }
}

export default MyAccount;