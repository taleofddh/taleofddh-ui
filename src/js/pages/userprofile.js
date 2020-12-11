import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, {useEffect} from 'react';
import {useApi, usePost} from "../common/hook";
import {getSessionCookie} from "../common/session";
import Title from "../components/title";
import MetaTag from "../components/metatag";
import Profile from "../components/profile";
import Loader from "../components/loader";
import '../../scss/pages/userprofile.scss';
import {postAuditEntry} from "../common/common";

const pagetitle = 'My Profile';
const source = 'my-profile';

function UserProfile(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const [data, loading] = usePost(
        "findUserProfile",
        "/findUserProfile",
        {
            identityId: getSessionCookie("credential").identityId
        }
    );
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
    }, []);

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="boxouter">
                <div className="container">
                    <div className="userprofileframe">
                        <Title message={pagetitle} />
                        {loading ? (
                            <Loader loading={loading} />
                        ) : (
                            <Profile api={props.api} data={data} source={source}/>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfile;