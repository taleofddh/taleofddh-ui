'use strict';

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import Title from "../components/title";
import Enquiry from "../components/enquiry";
import MetaTag from "../components/metatag";
import '../../scss/pages/contactus.scss';
import {useApi} from "../common/hook";

const pagetitle = 'Contact Us';
const source = 'contact-us';

function ContactUs(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');

    return (
        <>
            <MetaTag page={source} index={index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="boxouter">
                <div className="container">
                    <div className="contactusframe">
                        <Title message={pagetitle} />
                        <div className="contactuscontainer">
                            <div className="fieldcontainer">
                                <p className="contactus"><label>Want to get in touch?</label></p>
                                <p className="contactus"><label>Please use the form below or you can email us at <a href="mailto:helpdesk@taleofddh.in" target="blank">helpdesk@taleofddh.in</a></label></p>
                            </div>
                        </div>
                        <Enquiry api={api} type="GEQ" source={source} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactUs;