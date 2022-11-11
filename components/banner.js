import React from 'react';
import Image from 'next/image';
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
                        Making every residential property purchase a stress-free experience! Offering select services in <Image src="/images/flags/GB.png" alt='GB.png' layout='responsive' width='100%' height='100%' />&nbsp;<Image src="/images/flags/IN.png" alt='IN.png' layout='responsive' width='100%' height='100%' />
                    </label>
                </p>
            </div>
        </div>
    )
}

export default Banner;