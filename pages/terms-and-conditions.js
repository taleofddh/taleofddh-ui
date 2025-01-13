import React, {useState, useEffect} from 'react';
import {runWithAmplifyServerContext} from "../common/serverconfig";
import {get} from "aws-amplify/api/server";
import {getSessionCookie} from "../common/session";
import {useIndex} from '../common/hook';
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import MetaTag from "../components/metatag";
import ResponsiveNavigation from "../components/responsivenavigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

const pagetitle = 'Terms & Conditions';
const source = 'terms-conditions';

function TermsAndConditions({ menuList, handleLogout, data }) {
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
            <MetaTag page={source} index={index} url={url} />
            <div className="boxouter">
                <div className="container">
                    <div className="termsandconditionsframe">
                        <Title message={pagetitle} />
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
            data
        },
    }
}

export default TermsAndConditions;