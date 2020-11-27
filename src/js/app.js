'use strict';

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, { useState, useEffect, useContext } from 'react';
import { Router, Route, Switch } from "react-router-dom";
import { Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import CookieConsent from "react-cookie-consent";
import ReactGA from 'react-ga';
import countries from "./common/countries";
import {SessionContext, getSessionCookie, setSessionCookie, setSessionStorage, getSessionStorage} from "./common/session";
import {useApi, useFetch, useGet} from "./common/hook";
import { GEOLOCATION_URL, GTAG_TRACKING_ID } from './common/constants';
import ScrollToTop from "./common/scroll";
import ResponsiveNavigation from "./components/responsivenavigation";
import Header from './components/header';
import Navigation from './components/navigation'
import Footer from './components/footer'
import Home from './pages/home';
import SignUp from "./pages/signup";
import SignIn from "./pages/signin";
import AboutUs from "./pages/aboutus";
import ContactUs from "./pages/contactus";
import Acknowledgement from "./pages/acknowledgement";
import Gallery from "./pages/gallery";
import Photo from "./pages/photo";
import TermsAndConditions from "./pages/termsandconditions";
import PrivacyPolicy from "./pages/privacypolicy";
import FrequentlyAskedQuestion from "./pages/frequentlyaskedquestion";
import Loader from "./components/loader";
import Error from "./pages/error";
import '../scss/app.scss';

ReactGA.initialize(GTAG_TRACKING_ID);
const history = createBrowserHistory();
history.listen(location => {
    ReactGA.set({ page: location.pathname })
    ReactGA.pageview(location.pathname)
})

function App(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const [menuList, menuLoading] = useGet('findMenuList' , '/menuList/true', 'menu');
    const [geolocationData, geolocationLoading] = useFetch(GEOLOCATION_URL, 'geolocation');
    const [ddhomeCountry, setDdhomeCountry] = useState({
        country_code : '',
        country_name : ''
    });
    const validCountries = ['GB', 'IN'];
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [session] = useState(getSessionCookie);

    useEffect(() => {
        ReactGA.pageview(window.location.pathname);
    }, [])

    useEffect(() => {
        let ddhomeCountryDetails = getSessionCookie('ddhomeCountry');
        if(Object.keys(ddhomeCountryDetails).length === 0 && ddhomeCountryDetails.constructor === Object) {
            let countryMatch = false;
            for(let i in validCountries) {
                if(geolocationData.country_code === validCountries[i]) {
                    countryMatch = true;
                }
            }
            if(countryMatch) {
                setDdhomeCountry(ddhomeCountry => ({...ddhomeCountry, country_code: geolocationData.country_code, country_name: geolocationData.country_name}));
                setSessionCookie('ddhomeCountry', {country_code: geolocationData.country_code, country_name: geolocationData.country_name});
            } else {
                setDdhomeCountry(ddhomeCountry => ({...ddhomeCountry, country_code: 'GB', country_name: countries['GB']}));
                setSessionCookie('ddhomeCountry', {country_code: 'GB', country_name: countries['GB']});
            }
        } else {
            setDdhomeCountry(ddhomeCountry => ({...ddhomeCountry, country_code: ddhomeCountryDetails.country_code, country_name: ddhomeCountryDetails.country_name}));
        }
    }, [geolocationData]);

    const getDdhomeCountry = (ddhomeCountryCallBack) => {
        if(ddhomeCountryCallBack.country_code !== ddhomeCountry.country_code) {
            setDdhomeCountry({...ddhomeCountry, country_code: ddhomeCountryCallBack.country_code, country_name: ddhomeCountryCallBack.country_name});

            setSessionCookie('ddhomeCountry', ddhomeCountryCallBack);
        }
    }

    return (
        <SessionContext.Provider value={{session, isAuthenticated, userHasAuthenticated}}>
            <Router history={history}>
                <ScrollToTop>
                    <div>
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
                        {menuLoading || geolocationLoading ? (
                            <Loader loading={menuLoading || geolocationLoading} />
                        ) : (
                            <>
                                <ResponsiveNavigation menus={menuList} />
                                <Header country={ddhomeCountry} menus={menuList} />
                                <Navigation menus={menuList} />
                                <Switch>
                                    <Route
                                        exact path="/"
                                        render={() => <Home ddhomeCountryCallBack={getDdhomeCountry} geolocationData={geolocationData} api={api} />}
                                    />
                                    <Route
                                        exact path="/sign-up"
                                        render={(props) => <SignUp {...props} api={api} />}
                                    />
                                    <Route
                                        exact path="/sign-in"
                                        render={(props) => <SignIn {...props} api={api} />}
                                    />
                                    <Route
                                        exact path="/about-us"
                                        render={(props) => <AboutUs {...props} api={api} />}
                                    />
                                    <Route
                                        exact path="/contact-us"
                                        render={(props) => <ContactUs {...props} api={api} />}
                                    />
                                    <Route
                                        exact path="/contact-us-acknowledgement"
                                        render={(props) => <Acknowledgement {...props} api={api} />}
                                    />
                                    <Route
                                        exact path="/gallery"
                                        render={(props) => <Gallery {...props} api={api} />}
                                    />
                                    <Route
                                        exact path="/photo"
                                        render={(props) => <Photo {...props} api={api} />}
                                    />
                                    <Route
                                        exact path="/terms-conditions"
                                        render={(props) => <TermsAndConditions {...props} api={api} />}
                                    />
                                    <Route
                                        exact path="/privacy-policy"
                                        render={(props) => <PrivacyPolicy {...props} api={api} />}
                                    />
                                    <Route
                                        exact path="/frequently-asked-questions"
                                        render={(props) => <FrequentlyAskedQuestion {...props} api={api} />}
                                    />
                                    <Route
                                        render={(props) => <Error {...props} api={api} />}
                                    />
                                </Switch>
                                <Footer menus={menuList} />
                            </>
                        )}
                    </div>
                </ScrollToTop>
            </Router>
        </SessionContext.Provider>
    )
}

export default App;
