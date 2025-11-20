import React, {useEffect} from 'react';
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import Enquiry from "../components/enquiry";
import {getSessionCookie} from "../common/session";
import ResponsiveNavigation from "../components/responsivenavigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import {HOST_NAME, INDEX_FLAG} from "../common/constants";
import Footer from "../components/footer";
import {runWithAmplifyServerContext} from "../common/serverconfig";
import {get} from "aws-amplify/api/server";

const pagetitle = 'Contact Us';

function ContactUs({handleLogout, menuList, source, index, url}) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'contact us',
                message: 'Contact Us Page Accessed'
            }
        );
    }, [ddhomeCountry]);

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="contactusframe">
                        <Title message={pagetitle} />
                        <div className="contactuscontainer">
                            <div className="fieldcontainer">
                                <p className="contactus"><label>Want to get in touch?</label></p>
                                <p className="contactus"><label>Please use the form below or you can email us at <a href="mailto:helpdesk@taleofddh.com" target="blank">helpdesk@taleofddh.com</a></label></p>
                            </div>
                        </div>
                        <Enquiry type="GEQ" source={source} />
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticProps = async (context) => {
    const source = 'contact-us';
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


export default ContactUs;