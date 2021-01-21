import React, {useEffect} from 'react';
import {useApi, useGet} from '../common/hook';
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import Loader from "../components/loader";
import MetaTag from "../components/metatag";
import '../../scss/pages/privacypolicy.scss';
import {getSessionCookie} from "../common/session";

const pagetitle = 'Privacy Policy';
const source = 'privacy-policy';

function PrivacyPolicy(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const [data, loading] = useGet(
        'findPrivacyPolicyList', '/privacyPolicyList'
    );
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'privacy policy',
                message: 'Privacy Policy Page Accessed'
            }
        );
    })

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="boxouter">
                <div className="container">
                    <div className="privacypolicyframe">
                        <Title message={pagetitle} />
                        <div className="policycontainer">
                            {loading ? (
                                <Loader loading={loading} />
                            ) : (
                                <>
                                    {data.map((item, index) => {
                                        return (
                                            <Policies key={index} policy={item} />
                                        )
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function Policies(props) {
    let data = props.policy.content;
    let policyDetails = data.map((item, index) => {
        return (
            <Policy key={index} content={item} />
        )
    });
    return (
        <div className="policy">
            <p>
                <label className="policyheader">
                    {props.policy.header}
                </label>
            </p>
            {policyDetails}
        </div>
    )
}

function Policy(props) {
    return (
        <p>
            <label className="policydescription">
                {props.content}
            </label>
        </p>
    )
}

export default PrivacyPolicy;