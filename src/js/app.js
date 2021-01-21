import React, { useState, useEffect } from 'react';
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import {Auth} from "aws-amplify";
import CookieConsent from "react-cookie-consent";
import ReactGA from 'react-ga';
import {SessionContext, getSessionCookie, setSessionCookie} from "./common/session";
import {useApi, useFetch, useGet} from "./common/hook";
import {AWS_CONFIG, GEOLOCATION_URL, GTAG_TRACKING_ID, FACEBOOK_APP_URL} from './common/constants';
import AuthenticatedRoute from "./common/authenticatedroute";
import UnauthenticatedRoute from "./common/unauthenticatedroute";
import {onError} from "./common/error";
import ScrollToTop from "./common/scroll";
import ResponsiveNavigation from "./components/responsivenavigation";
import Header from './components/header';
import Navigation from './components/navigation'
import Footer from './components/footer'
import Home from './pages/home';
import SignUp from "./pages/signup";
import SignIn from "./pages/signin";
import ResetPassword from "./pages/resetpassword";
import UserProfile from "./pages/userprofile";
import ChangePassword from "./pages/changepassword";
import AboutUs from "./pages/aboutus";
import ContactUs from "./pages/contactus";
import Acknowledgement from "./pages/acknowledgement";
import Blog from "./pages/blog";
import Article from "./pages/article";
import MarkdownBlog from "./pages/markdownblog";
import Gallery from "./pages/gallery";
import Photo from "./pages/photo";
import Links from "./pages/links";
import TravelGuide from "./pages/travelguide";
import TermsAndConditions from "./pages/termsandconditions";
import PrivacyPolicy from "./pages/privacypolicy";
import FrequentlyAskedQuestion from "./pages/frequentlyaskedquestion";
import Loader from "./components/loader";
import Admin from "./pages/admin";
import Error from "./pages/error";
import '../scss/app.scss';

ReactGA.initialize(GTAG_TRACKING_ID);
const history = createBrowserHistory();
history.listen(location => {
    ReactGA.set({ page: location.pathname })
    ReactGA.pageview(location.pathname)
})

function App(props) {
    const [api] = useApi(window.location.hostname, window.location.protocol, 'api');
    const [menuList, menuLoading] = useGet('findMenuList' , '/menuList/true', 'menu');
    const [geolocationData, geolocationLoading] = useFetch(GEOLOCATION_URL, 'geolocation');
    const [ddhomeCountry, setDdhomeCountry] = useState({
        country_code : '',
        country_name : '',
        ip_address: ''
    });
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [session] = useState(getSessionCookie);

    useEffect(() => {
        onLoad();
        ReactGA.pageview(window.location.pathname);
    }, [])

    async function onLoad() {
        loadFacebookSDK();
        try {
            await Auth.currentSession();
            userHasAuthenticated(true);
            const credentials = await Auth.currentUserCredentials();
            setSessionCookie("credential", {identityId: credentials.identityId});
        }
        catch(e) {
            if (e !== 'No current user') {
                onError(e);
            }
        }
    }

    const loadFacebookSDK = () => {
        window.fbAsyncInit = function() {
            window.FB.init({
                appId            : AWS_CONFIG.social.FB,
                autoLogAppEvents : true,
                xfbml            : true,
                version          : 'v3.1'
            });
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = FACEBOOK_APP_URL;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    useEffect(() => {
        let ddhomeCountryDetails = getSessionCookie('ddhomeCountry');
        if(Object.keys(ddhomeCountryDetails).length === 0 && ddhomeCountryDetails.constructor === Object) {
            setDdhomeCountry(ddhomeCountry => ({...ddhomeCountry, country_code: geolocationData.country_code, country_name: geolocationData.country_name, ip_address: geolocationData.IPv4}));

            setSessionCookie('ddhomeCountry', {country_code: geolocationData.country_code, country_name: geolocationData.country_name, ip_address: geolocationData.IPv4});
        } else {
            setDdhomeCountry(ddhomeCountry => ({...ddhomeCountry, country_code: ddhomeCountryDetails.country_code, country_name: ddhomeCountryDetails.country_name, ip_address: ddhomeCountryDetails.ip_address}));
        }
    }, [geolocationData]);

    const getDdhomeCountry = (ddhomeCountryCallBack) => {
        if(ddhomeCountryCallBack.country_code !== ddhomeCountry.country_code) {
            setDdhomeCountry({...ddhomeCountry, country_code: ddhomeCountryCallBack.country_code, country_name: ddhomeCountryCallBack.country_name, ip_address: ddhomeCountryCallBack.ip_address});

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
                                    <UnauthenticatedRoute
                                        exact path="/sign-up"
                                        render={(props) => <SignUp {...props} api={api} />}
                                    />
                                    <UnauthenticatedRoute
                                        exact path="/sign-in"
                                        render={(props) => <SignIn {...props} api={api} />}
                                    />
                                    <UnauthenticatedRoute
                                        exact path="/reset-password"
                                        render={(props) => <ResetPassword {...props} api={{api}} />}
                                    />
                                    <AuthenticatedRoute
                                        exact path="/my-profile"
                                        render={(props) => <UserProfile {...props} api={api} />}
                                    />
                                    <AuthenticatedRoute
                                        exact path="/change-password"
                                        render={(props) => <ChangePassword {...props} api={api} />}
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
                                        exact path="/blog"
                                        render={(props) => <Blog {...props} api={api} />}
                                    />
                                    <Route
                                        exact path={["/blog/article", "/blog/article/:category/:blogName"]}
                                        render={(props) => <Article {...props} api={api} />}
                                    />
                                    <Route
                                        exact path="/markdown-blog"
                                        render={(props) => <MarkdownBlog {...props} api={api} />}
                                    />
                                    <Route
                                        exact path="/gallery"
                                        render={(props) => <Gallery {...props} api={api} />}
                                    />
                                    <AuthenticatedRoute
                                        exact path={["/gallery/photo", "/gallery/photo/:albumName", "/gallery/photo/:albumName/:startIndex"]}
                                        render={(props) => <Photo {...props} api={api} />}
                                    />
                                    <Route
                                        exact path="/links"
                                        render={(props) => <Links {...props} api={api} />}
                                    />
                                    <Route
                                        exact path="/links/travel-guides"
                                        render={(props) => <TravelGuide {...props} api={api} />}
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
                                        exact path="/admin"
                                        render={(props) => <Admin {...props} api={api} />}
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
