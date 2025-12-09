import React, {useEffect} from 'react';
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import Enquiry from "../components/enquiry";
import {getSessionCookie} from "../common/session";
import ResponsiveNavigation from "../components/responsive-navigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import {HOST_NAME, INDEX_FLAG} from "../common/constants";
import Footer from "../components/footer";
import {serverGet} from "../common/server-config";

const pageTitle = 'Contact Us';

function ContactUs({handleLogout, authenticated, menuList, source, index, url}) {
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
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="contactusframe">
                        <Title message={pageTitle} />
                        <div className="contactuscontainer">
                            <div className="enquirycontainer">
                                <p className="contactus"><label>Want to get in touch?</label></p>
                                <p className="contactus"><label>Please use the form below or you can email us at <a href="mailto:helpdesk@taleofddh.com" target="blank">helpdesk@taleofddh.com</a></label></p>
                            </div>
                            <Enquiry type="GEQ" source={source} />
                        </div>
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


export default ContactUs;