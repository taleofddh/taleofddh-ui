import React, {useEffect} from 'react';
import {serverGet} from "../../common/server-config";
import {getSessionCookie} from "../../common/session";
import {postAuditEntry} from "../../common/common";
import Title from "../../components/title";
import ResponsiveNavigation from "../../components/responsive-navigation";
import Header from "../../components/header";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import {HOST_NAME, INDEX_FLAG} from "../../common/constants";
import BackendArchitecture from "../../components/backend-architecture";
import FrontendArchitecture from "../../components/frontend-architecture";

const pageTitle = 'Solutions Architecture';

function SolutionsArchitecture({ menuList, handleLogout, authenticated, source, index, url }) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
                {
                    date: new Date(),
                    hostName: window.location.hostname,
                    countryCode: ddhomeCountry.country_code,
                    ipAddress: ddhomeCountry.ip_address,
                    page: 'link/solution-architecture',
                    message: 'Solutions Architecture Guides Page Accessed'
                }
        );
    }, [ddhomeCountry]);

    /*let items = {};
    items = travelDocumentData.map((item, index) => {
        let content = getContent(item.folder, item.files);
        return {...items, label: item.folder, children: content, key: '' + (index + 1)}
    });*/

    return (
            <>
                <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} />
                <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
                <Navigation menus={menuList} />
                <div className="boxouter">
                    <div className="container">
                        <div className="travelguideframe">
                            <Title message={pageTitle} />
                            <div className="travelguidecontainer">
                                <BackendArchitecture />
                                <FrontendArchitecture />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer menus={menuList} />
            </>
    )
}

// This function gets called at build time
export const getStaticProps = async (context) => {
    const source = 'travel-guides';
    const index = INDEX_FLAG;
    const url = HOST_NAME;

    // Call an external API endpoint to get data
    const menuList = await serverGet('findMenuList', '/menuList', [true]);

    // return the data
    return {
        props: {
            menuList,
            source,
            index,
            url
        },
    }
}

export default SolutionsArchitecture;