import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as gtag from '../common/gtag';
import {Hub} from 'aws-amplify/utils';
import {get, post} from 'aws-amplify/api';
import {fetchAuthSession, getCurrentUser, signOut, fetchUserAttributes} from 'aws-amplify/auth';
import 'aws-amplify/auth/enable-oauth-listener';
import { configureAmplify } from '../common/config'
import CookieConsent from "react-cookie-consent";
import { GEOLOCATION_URL, MEASUREMENT_FLAG } from "../common/constants";
import countries from "../common/countries";
import {
    setCookieStorage,
    SessionContext,
    getSessionCookie,
    setSessionCookie,
    removeSessionCookie
} from "../common/session";
//import { useFetch, useGet } from "../common/hook";
import { onError } from '../common/error';
import MetaTag from "../components/metatag";
//Global Styles
import '../styles/globals.scss';
//Common Styles
import '../styles/common/icon.scss';
//Component Styles
import '../styles/components/architecture.scss';
import '../styles/components/article.scss';
import '../styles/components/autocomplete-input.scss';
import '../styles/components/banner.scss';
import '../styles/components/blog-section.scss';
import '../styles/components/button.scss';
import '../styles/components/carousel.scss';
import '../styles/components/checkbox.scss';
import '../styles/components/collapse.scss';
import '../styles/components/comment.scss';
import '../styles/components/email-admin.scss';
import '../styles/components/enquiry.scss';
import '../styles/components/family.scss';
import '../styles/components/file-upload.scss';
import '../styles/components/footer.scss';
import '../styles/components/header.scss';
import '../styles/components/label.scss';
import '../styles/components/list-module.scss'
import '../styles/components/loader.scss';
import '../styles/components/loader-button.scss';
import '../styles/components/login.scss';
import '../styles/components/navigation.scss';
import '../styles/components/photo-album.scss'
import '../styles/components/photo-collection.scss';
import '../styles/components/popup.scss';
import '../styles/components/profile.scss';
import '../styles/components/responsive-navigation.scss';
import '../styles/components/radio.scss';
import '../styles/components/registration.scss';
import '../styles/components/select.scss';
import '../styles/components/share.scss';
import '../styles/components/slider.scss';
import '../styles/components/stay-connected.scss';
import '../styles/components/step.scss';
import '../styles/components/switch.scss';
import '../styles/components/textarea.scss';
import '../styles/components/tile.scss';
import '../styles/components/title.scss';
import '../styles/components/type-input.scss';
import '../styles/components/visit.scss';
//Page Styles
import '../styles/pages/admin.scss';
import '../styles/pages/about-us.scss';
import '../styles/pages/acknowledgement.scss';
import '../styles/pages/blogs.scss';
import "../styles/pages/change-password.scss";
import '../styles/pages/contact-us.scss';
import '../styles/pages/error.scss';
import '../styles/pages/frequently-asked-questions.scss';
import '../styles/pages/gallery.scss';
import '../styles/pages/home.scss';
import '../styles/pages/links.scss';
import '../styles/pages/my-account.scss';
import '../styles/pages/privacy-policy.scss';
import "../styles/pages/reset-password.scss";
import '../styles/pages/sign-in.scss';
import '../styles/pages/sign-up.scss';
import '../styles/pages/terms-and-condition.scss';
import '../styles/pages/travel-guide.scss';
import '../styles/pages/user-profile.scss';
//Third Party Styles
import 'react-tabs/style/react-tabs.css';
import "react-photo-album/columns.css";
import "react-photo-album/rows.css";
import "react-photo-album/styles.css";

configureAmplify();

function App({ Component, pageProps }) {
    const [geolocationData, setGeoLocationData] = useState({});
    const [ddhomeCountry, setDdhomeCountry] = useState({
        country_code : '',
        country_name : ''
    });
    const [error, setError] = useState(null);
    const [isAuthenticated, userHasAuthenticated] =  useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true)
    const [family, setFamily] = useState({});
    const [session] = useState(getSessionCookie);
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url) => {
            //console.log(router);
            if (MEASUREMENT_FLAG) gtag.pageview(url);
        }
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router])

    useEffect(() => {
        const validCountries = ['GB', 'IN'];
        const getLocationData = async () => {
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
        }
        getLocationData();
    }, []);

    useEffect(() => {
        const onLoad = async () => {
            let user = null;
            let route = '';
            Hub.listen('auth', async ({ payload}) => {
                console.log('payload: ', payload);
                switch (payload.event) {
                    case "signInWithRedirect":
                        console.log('signInWithRedirect inside OAuth flow.');
                        break;
                    case "signInWithRedirect_failure":
                        setError("signInWithRedirect error has occurred during the OAuth flow.");
                        break;
                    case "signedIn":
                        console.log('signedIn successful');
                        if(payload.data) {
                            user = payload.data;
                        }
                        await updateUserLoginAndRoute(route);
                        break;
                    case 'customOAuthState':
                        if(payload.data) {
                            route = JSON.parse(payload.data);
                        }
                        break;
                    case 'signedOut':
                        console.log('signedOut successful');
                        break;
                    case 'tokenRefresh':
                        console.log('Auth Token Refreshed');
                        break;
                    default:
                        console.log('No Sign in Event');
                        break;
                }
            });
        }

        onLoad();
    }, []);

    const updateUserLoginAndRoute = async (route) => {
        try {
            console.log('Inside updateUserLoginAndRoute');
            const {
                tokens,
                identityId
            } = await fetchAuthSession({ forceRefresh: true });
            if (tokens) {
                const attributes = await fetchUserAttributes();
                //console.log('attributes: ', attributes);
                const email = attributes.email;
                userHasAuthenticated(true);
                setSessionCookie("credential", {identityId: identityId, sub: attributes.sub});

                //update or create a user profile after sign-in
                const profile = {
                    identityId: identityId,
                    useId: attributes.sub,
                    email: email,
                    lastLogin: new Date()
                }
                await post({
                    apiName: "createOrUpdateUserProfile",
                    path: "/createOrUpdateUserProfile",
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: profile,
                    }
                }).response;
                console.log('Profile updated successfully');

                if(pageProps.hasOwnProperty('family') && pageProps.family && pageProps.family.hasOwnProperty('members')) {
                    setFamily({...family, ...pageProps.family});
                } else {
                    let res = await get({
                        apiName: 'findFamilyByEmail',
                        path: '/familyByEmail/' + encodeURI(email) + '/true',
                        options: {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }
                    }).response;
                    //console.log(await res.body.json());
                    const familyData = await res.body.json();
                    setFamily({...family, ...familyData});
                }
                console.log('Community updated successfully');

                console.log('route', route);
                // Check if the user needs to be redirected to a specific route after sign-in.
                if(route && route.length > 0) {
                    await router.push(route, route);
                } else {
                    await router.push('/', '/');
                }
                console.log('Redirected to appropriate page successfully');
            }
            setIsAuthenticating(false);
        }
        catch(e) {
            //console.error(e);
            if (e !== undefined && e !== 'No current user') {
                onError(e);
            }
        }
    }

    const handleLogout = async () => {
        await signOut();
        userHasAuthenticated(false);
        removeSessionCookie("credential");
        await router.push("/sign-in",
            "/sign-in"
        );
    }

    return (
        <React.Fragment>
            <MetaTag page={pageProps.source} index={pageProps.index} url={pageProps.url} hdr={pageProps.hdr} desc={pageProps.desc} img={pageProps.img} />
            {!isAuthenticating && (
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
                        enableDeclineButton={true}
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
                </SessionContext.Provider>
            )}
            <Component
                {...pageProps}
                geolocationData={geolocationData}
                countryName={ddhomeCountry.country_name}
                countryCode={ddhomeCountry.country_code}
                handleLogout={handleLogout}
                authenticated={isAuthenticated}
                family={family}
            />
        </React.Fragment>
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
