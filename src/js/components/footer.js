import React, { useState } from 'react';
import {NavLink, Link} from "react-router-dom";
import '../../scss/components/footer.scss'

function Footer(props) {
    const [showTermsAndConditionsPopup, setTermsAndConditionsPopup] = useState(false);

    const toggleTermsAndConditionsPopup = () => {
        setTermsAndConditionsPopup(!showTermsAndConditionsPopup);
    }

    let count = 0;
    let menus = props.menus.map((item) => {
        let separator = '   |   ';
        if(item.position === 'Footer') {
            count++
            return (
                <div key={count} className="footermenu">
                    <NavLink key={item.id} to={item.link}>
                        {item.name}
                    </NavLink>
                </div>
            )
        }
    });

    return (
        <div className="footerbar">
            <div className="container">
                <div className="footer">
                    {menus}
                    <div className="socialmedia">
                        <a href="https://www.facebook.com/devadyuti.das" target="_blank"><img src="/images/icon-facebook.png" className="socialmediapiccontrol" alt="Facebook" /></a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <a href="https://twitter.com/ServEase_io/" target="_blank"><img src="/images/icon-twitter.png" className="socialmediapiccontrol" alt="Twitter" /></a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <a href="https://www.linkedin.com/in/devadyuti-das-48955012/" target="_blank"><img src="/images/icon-linkedin.png" className="socialmediapiccontrol" alt="LinkedIn" /></a>
                    </div>
                    <div className="copyright">
                        &copy; 2020 taleofddh.com All rights reserved.
                    </div>
                    <div className="copyright">
                        Release v3.0.0
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;