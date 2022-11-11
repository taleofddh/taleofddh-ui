import React, {useState, useEffect} from 'react';
import {postAuditEntry} from "../common/common";
import Title from "../components/title";
import Enquiry from "../components/enquiry";
import MetaTag from "../components/metatag";
import {useIndex} from "../common/hook";
import {getSessionCookie} from "../common/session";
import ResponsiveNavigation from "../components/responsivenavigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import {API} from "aws-amplify";
import Footer from "../components/footer";

const pagetitle = 'Contact Us';
const source = 'contact-us';

function ContactUs({handleLogout, menuList}) {
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
            <MetaTag page={source} index={index} url={url} />
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

    // return the data
    return {
        props: {
            menuList
        },
    }
}


export default ContactUs;