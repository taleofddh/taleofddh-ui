import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as gtag from '../common/gtag';
import { API, Auth, Hub } from "aws-amplify";
import { configureAmplify } from '../common/config'
import CookieConsent from "react-cookie-consent";
import { AWS_CONFIG, GEOLOCATION_URL, GTAG_TRACKING_ID, GOOGLE_MAP_API_URL, GOOGLE_MAP_API_KEY } from "../common/constants";
import countries from "../common/countries";
import {
    SessionContext,
    getSessionCookie,
    setSessionCookie,
    removeSessionCookie
} from "../common/session";
//import { useFetch, useGet } from "../common/hook";
import { onError } from '../common/error';
//Global Styles
import '../styles/globals.scss';
//Common Styles
import '../styles/common/icon.scss';
//Component Styles
import '../styles/components/banner.scss';
import '../styles/components/blogsection.scss';
import '../styles/components/button.scss';
import '../styles/components/carousel.scss';
import '../styles/components/checkbox.scss';
import '../styles/components/collapsefolder.scss';
import '../styles/components/collapsetext.scss';
import '../styles/components/collection.scss';
import '../styles/components/comment.scss';
import '../styles/components/emailadmin.scss';
import '../styles/components/enquiry.scss';
import '../styles/components/fileupload.scss';
import '../styles/components/flagselect.scss';
import '../styles/components/footer.scss';
import '../styles/components/header.scss';
import '../styles/components/label.scss';
import '../styles/components/loader.scss';
import '../styles/components/loaderbutton.scss';
import '../styles/components/login.scss';
import '../styles/components/navigation.scss';
import '../styles/components/popup.scss';
import '../styles/components/profile.scss';
import '../styles/components/responsivenavigation.scss';
import '../styles/components/radio.scss';
import '../styles/components/registration.scss';
import '../styles/components/select.scss';
import '../styles/components/share.scss';
import '../styles/components/slider.scss';
import '../styles/components/stayconnected.scss';
import '../styles/components/step.scss';
import '../styles/components/switch.scss';
import '../styles/components/textarea.scss';
import '../styles/components/tile.scss';
import '../styles/components/title.scss';
import '../styles/components/typeinput.scss';
import '../styles/components/visit.scss';
//Page Styles
import '../styles/pages/admin.scss';
import '../styles/pages/album.scss';
import '../styles/pages/aboutus.scss';
import '../styles/pages/acknowledgement.scss';
import '../styles/pages/article.scss';
import '../styles/pages/blog.scss';
import "../styles/pages/changepassword.scss";
import '../styles/pages/contactus.scss';
import '../styles/pages/error.scss';
import '../styles/pages/frequentlyaskedquestions.scss';
import '../styles/pages/gallery.scss';
import '../styles/pages/home.scss';
import '../styles/pages/links.scss';
import '../styles/pages/privacypolicy.scss';
import "../styles/pages/resetpassword.scss";
import '../styles/pages/signin.scss';
import '../styles/pages/signup.scss';
import '../styles/pages/termsandcondition.scss';
import '../styles/pages/travelguide.scss';
import '../styles/pages/userprofile.scss';
//Third Party Styles
import 'react-tabs/style/react-tabs.css';

configureAmplify();

function App({ Component, pageProps }) {
    //console.log(GEOLOCATION_URL);
    //const [geolocationData, geolocationLoading] = useFetch(GEOLOCATION_URL, 'geolocation');
    const [geolocationData, setGeoLocationData] = useState({});
    const [ddhomeCountry, setDdhomeCountry] = useState({
        country_code : '',
        country_name : ''
    });
    const validCountries = ['GB', 'IN'];
    const [isAuthenticated, userHasAuthenticated] =  useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [session] = useState(getSessionCookie);
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url) => {
            console.log(router);
            gtag.pageview(url)
        }
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router])

    useEffect(async () => {
        let geolocation = getSessionCookie('geolocation');
        if(Object.keys(geolocation).length === 0 && geolocation.constructor === Object) {
            const response = await fetch(GEOLOCATION_URL);
            console.log(response);
            geolocation = await response.json();
            setSessionCookie('geolocation', geolocation);
        }
        setGeoLocationData(geolocationData => ({...geolocationData, geolocation}));
        let ddhomeCountryDetails = getSessionCookie('ddhomeCountry');
        if(Object.keys(ddhomeCountryDetails).length === 0 && ddhomeCountryDetails.constructor === Object) {
            let countryMatch = false;
            for(let i in validCountries) {
                if(geolocation.country_code === validCountries[i]) {
                    countryMatch = true;
                }
            }   
            if(countryMatch) {
                setDdhomeCountry(ddhomeCountry => ({...ddhomeCountry, country_code: geolocation.country_code, country_name: geolocation.country_name}));
                setSessionCookie('ddhomeCountry', {country_code: geolocation.country_code, country_name: geolocation.country_name});
            } else {
                setDdhomeCountry(ddhomeCountry => ({...ddhomeCountry, country_code: 'GB', country_name: countries['GB']}));
                setSessionCookie('ddhomeCountry', {country_code: 'GB', country_name: countries['GB']});
            }
        } else {
            setDdhomeCountry(ddhomeCountry => ({...ddhomeCountry, country_code: ddhomeCountryDetails.country_code, country_name: ddhomeCountryDetails.country_name}));
        }
        await onLoad();
    }, [])

    const onLoad = async () => {
        Hub.listen('auth', ({payload: {event, data}}) => {
            let route = '';
            let user = '';
            switch (event) {
                case 'signIn':
                    user = data;
                    console.log('user: ', user);
                    break;

                case 'customOAuthState':
                    route = JSON.parse(data);
                    console.log('route: ', route);
                    if(route && route !== undefined)
                        router.push(route.replace(/-/g, ''),
                            route
                        );
                    break;

                default:
                    //router.push('/home', '/');
            }
        });
        try {
            await Auth.currentSession();
            const user = await Auth.currentAuthenticatedUser();
            console.log('user: ', user);
            const email = user.attributes.email;
            userHasAuthenticated(true);
            const credentials = await Auth.currentUserCredentials();
            setSessionCookie("credential", {identityId: credentials.identityId});
            await API.put("updateUserProfile", "/updateUserProfile", {
                response: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: {email: email, identityId: credentials.identityId, updatedAt: new Date(), lastLogin: new Date()},
            });
        }
        catch(e) {
            //console.error(e);
            if (e !== undefined && e !== 'No current user') {
                onError(e);
            }
        }
        setIsAuthenticating(false);
    }

    const getDdhomeCountry = (ddhomeCountryCallBack) => {
        if(ddhomeCountryCallBack.country_code !== ddhomeCountry.country_code) {
            setDdhomeCountry({...ddhomeCountry, country_code: ddhomeCountryCallBack.country_code, country_name: ddhomeCountryCallBack.country_name});

            setSessionCookie('ddhomeCountry', ddhomeCountryCallBack);
        }
    }

    const handleLogout = async () => {
        await Auth.signOut();
        userHasAuthenticated(false);
        removeSessionCookie("credential");
        await router.push("/signin",
            "/sign-in"
        );
    }

    return (
        !isAuthenticating && (
            <>
                <SessionContext.Provider value={{session, isAuthenticated, userHasAuthenticated}}>
                    <CookieConsent
                        location="bottom"
                        buttonText="Accept"
                        declineButtonText="Decline"
                        cookieName="DDHomeCookie"
                        containerClasses="cookieconsentcontainer"
                        contentClasses="cookieconsentcontent"
                        buttonClasses="cookieconsentbutton"
                        declineButtonClasses="cookiedeclinebutton"
                        expires={30}
                        enableDeclineButton={false}
                        onDecline={() => {
                            console.log("User has declined to cookies");
                        }}>
                        <p>
                            This website stores cookies on your device. These cookies are used to collect information about how you interact with our website and allow us to remember you.
                            We use this information in order to improve and customize your browsing experience and for analytics and metrics about our visitors both on this website and other media. To find out more about the cookies we use, see our Privacy Policy.</p>
                        <p>
                            If you decline, your information won’t be tracked when you visit this website. A single cookie will be used in your browser to remember your preference not to be tracked.
                        </p>
                    </CookieConsent>
                    <Component {...pageProps} ddhomeCountryCallBack={getDdhomeCountry} geolocationData={geolocationData} countryName={ddhomeCountry.country_name} countryCode={ddhomeCountry.country_code} handleLogout={handleLogout} />
                </SessionContext.Provider>
            </>
        )
    )
}

/*// This function gets called at build time
export const getInitialProps = async (context) => {
    const appContext = App.getInitialProps(context);
    console.log(appContext);
    // Call an external API endpoint to get data
    // return the data
    return {
        props: {
            appContext,
        },
    }
}*/

export default App;
