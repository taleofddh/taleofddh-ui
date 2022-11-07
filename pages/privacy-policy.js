import React, {useState, useEffect} from 'react';
import {API} from "aws-amplify";
import {getSessionCookie} from "../common/session";
import {useIndex} from '../common/hook';
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import MetaTag from "../components/metatag";
import ResponsiveNavigation from "../components/responsivenavigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

const pagetitle = 'Privacy Policy';
const source = 'privacy-policy';

function PrivacyPolicy({ menuList, handleLogout, data }) {
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
                page: 'privacy policy',
                message: 'Privacy Policy Page Accessed'
            }
        );
    })

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <MetaTag page={source} index={index} url={url} />
            <div className="boxouter">
                <div className="container">
                    <div className="privacypolicyframe">
                        <Title message={pagetitle} />
                        <div className="policycontainer">
                            {data.map((item, index) => {
                                return (
                                    <Policies key={index} policy={item} />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
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
        'findPrivacyPolicyList',
        '/privacyPolicyList',
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );
    const data = await res.data;

    // return the data
    return {
        props: {
            menuList,
            data
        },
    }
}

export default PrivacyPolicy;