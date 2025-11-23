import React, {useEffect} from 'react';
import {runWithAmplifyServerContext} from "../common/server-config";
import {get} from "aws-amplify/api/server";
import {getSessionCookie} from "../common/session";
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import ResponsiveNavigation from "../components/responsive-navigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import {HOST_NAME, INDEX_FLAG} from "../common/constants";

const pageTitle = 'Privacy Policy';

function PrivacyPolicy({ menuList, handleLogout, authenticated, data, source, index, url }) {
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
    }, [ddhomeCountry])

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="privacypolicyframe">
                        <Title message={pageTitle} />
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
    const source = 'privacy-policy';
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

    const data = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: 'findPrivacyPolicyList',
                    path: '/privacyPolicyList',
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
            data,
            source,
            index,
            url
        },
    }
}

export default PrivacyPolicy;