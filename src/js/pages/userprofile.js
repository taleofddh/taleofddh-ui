import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import {useApi, usePost} from "../common/hook";
import {getSessionCookie} from "../common/session";
import Title from "../components/title";
import MetaTag from "../components/metatag";
import Profile from "../components/profile";
import Loader from "../components/loader";
import '../../scss/pages/userprofile.scss';

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