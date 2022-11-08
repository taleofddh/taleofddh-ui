import React, { useState } from 'react';
import Link from 'next/link';
import Icon from "../common/icon";

function Footer({menus}) {
    const [showTermsAndConditionsPopup, setTermsAndConditionsPopup] = useState(false);

    const toggleTermsAndConditionsPopup = () => {
        setTermsAndConditionsPopup(!showTermsAndConditionsPopup);
    }

    let count = 0;
    let menuList = menus.map((item) => {
        if(item.position === 'Footer') {
            count++
            return (
                <div key={count} className="footermenu">
                    <Link key={item.id} href={item.link} as={item.link}>
                        <a>{item.name}</a>
                    </Link>
                </div>
            )
        }
    });

    let date = new Date();
    let year = date.getFullYear();

    return (
        <div className="footerbar">
            <div className="container">
                <div className="footer">
                    {menuList}
                    <div className="socialmedia">
                        <a href="https://www.facebook.com/devadyuti.das" target="_blank" rel="noreferrer"><Icon name="facebook" fill="#FFFFFF" /></a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <a href="https://twitter.com/ServEase_io/" target="_blank" rel="noreferrer"><Icon name="twitter" fill="#FFFFFF" /></a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <a href="https://www.linkedin.com/in/devadyuti-das-48955012/" target="_blank" rel="noreferrer"><Icon name="linkedin" fill="#FFFFFF" /></a>
                    </div>
                    <div className="copyright">
                        &copy; {year} taleofddh.com All rights reserved.
                    </div>
                    <div className="copyright">
                        Release v4.0.0
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;