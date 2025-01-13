import React, {useState, useEffect} from 'react';
import {runWithAmplifyServerContext} from "../common/serverconfig";
import {get} from "aws-amplify/api/server";
import {get as clientGet} from "aws-amplify/api";
import {fetchAuthSession, fetchUserAttributes} from "aws-amplify/auth";
import {useIndex} from "../common/hook";
import {getSessionCookie, useSessionContext} from "../common/session";
import Title from "../components/title";
import MetaTag from "../components/metatag";
import Profile from "../components/profile";
import Loader from "../components/loader";
import {postAuditEntry} from "../common/common";
import ResponsiveNavigation from "../components/responsivenavigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import {onError} from "../common/error";

const pagetitle = 'My Profile';
const source = 'my-profile';

function UserProfile({menuList, handleLogout}) {
    const { userHasAuthenticated } = useSessionContext();
    const index = useIndex();
    const [url, setUrl] = useState('');
    const [data, setData] = useState({});
    const [loading, isLoading] = useState(true);
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

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
                const {identityId} = await fetchAuthSession({ forceRefresh: true });
                const attributes = await fetchUserAttributes();
                const email = attributes.email;

                const res = await clientGet({
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
                setData(await res.body.json());
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
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <MetaTag page={source} index={index} url={url} />
            <div className="boxouter">
                <div className="container">
                    <div className="userprofileframe">
                        <Title message={pagetitle} />
                        {loading ? (
                            <Loader loading={loading} />
                        ) : (
                            <Profile data={data} source={source}/>
                        )}
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticProps = async ({ params }) => {
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

    // return the data
    return {
        props: {
            menuList
        },
    }
}
export default UserProfile;