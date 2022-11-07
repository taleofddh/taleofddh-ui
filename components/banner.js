import React from 'react';
import {getSessionCookie} from "../common/session";

function Banner({country}) {
    let count = 0;
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    let countryCode;
    if(country.country_code !== undefined) {
        countryCode = country.country_code;
    } else if(Object.keys(ddhomeCountry).length !== 0 || ddhomeCountry.constructor !== Object) {
        countryCode = ddhomeCountry.country_code;
    } else {
        let geolocationData = getSessionCookie('geolocation');
        countryCode = geolocationData.country_code;
    }

    return (
        <div className="bannerbar">
            <div className="banner">
                <p>
                    <label className="bannertext">
                        Making every residential property purchase a stress-free experience! Offering select services in <img src="/images/flags/GB.png" />&nbsp;<img src="/images/flags/IN.png" />
                    </label>
                </p>
            </div>
        </div>
    )
}

export default Banner;