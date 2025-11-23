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

const pageTitle = 'Terms & Conditions';

function TermsAndConditions({ menuList, handleLogout, authenticated, data, source, index, url }) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'terms and conditions',
                message: 'Terms and Conditions Page Accessed'
            }
        );
    }, [ddhomeCountry])

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="termsandconditionsframe">
                        <Title message={pageTitle} />
                        <div className="termcontainer">
                            {data.map((item, index) => {
                                return (
                                    <Terms key={index} term={item} />
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

function Terms(props) {
    let data = props.term.content;
    let termdetails = data.map((item, index) => {
        return (
            <Term key={index} content={item} />
        )
    });
    return (
        <div key={props.term.id} className="term">
            <p>
                <label className="termheader">
                    {props.term.header}
                </label>
            </p>
            {termdetails}
        </div>
    )
}

function Term(props) {
    return (
        <p key={props.seq}>
            <label className="termdescription">
                {props.content}
            </label>
        </p>
    )
}

// This function gets called at build time
export const getStaticProps = async (context) => {
    const source = 'terms-and-conditions';
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
                    apiName: 'findTermsAndConditionsList',
                    path: '/termsAndConditionsList',
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

export default TermsAndConditions;