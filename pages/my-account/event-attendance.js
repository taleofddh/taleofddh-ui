import React, {useState, useEffect} from 'react';
import {serverGet} from "../../common/server-config";
import {get} from 'aws-amplify/api';
import {fetchAuthSession} from "aws-amplify/auth";
import {HOST_NAME, INDEX_FLAG} from "../../common/constants";
import {getSessionCookie} from "../../common/session";
import Title from "../../components/title";
import Loader from "../../components/loader";
import {postAuditEntry} from "../../common/common";
import ResponsiveNavigation from "../../components/responsive-navigation";
import Header from "../../components/header";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import {onError} from "../../common/error";
import AttendanceForm from "../../components/attendance-form";

const pagetitle = 'Event Attendance';

function EventAttendance({menuList, handleLogout, authenticated, member, source, index, url}) {
    const [data, setData] = useState({});
    const [loading, isLoading] = useState(true);
    const addaSloughCountry = getSessionCookie('addaSloughCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: addaSloughCountry.country_code,
                ipAddress: addaSloughCountry.ip_address,
                page: 'my-account/event-attendance',
                message: pagetitle + ' Page Accessed by ' + getSessionCookie("credential").sub
            }
        );
    }, [addaSloughCountry]);

    useEffect(() => {
        const onLoad = async () => {
            try {
                const {tokens} = await fetchAuthSession({ forceRefresh: true });
                if(tokens && tokens !== undefined) {
                    const res = await get({
                        apiName: 'findUpcomingTicketedEvents',
                        path: '/upcomingTicketedEvents',
                        options: {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            }
                        }
                    }).response;
                    setData(await res.body.json());
                }
                isLoading(false);
            }
            catch(e) {
                if (e !== 'No current user') {
                    onError(e);
                }
                isLoading(false);
            }
        }
        onLoad();
    }, []);

    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} />
            <Header country={addaSloughCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="userprofileframe">
                        <Title message={pagetitle} />
                        {loading ? (
                            <Loader loading={loading} />
                        ) : (
                            <AttendanceForm data={data} member={member} />
                        )}
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}

// This function gets called at build time
export const getStaticProps = async ({context}) => {
    const source = 'my-account';
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

export default EventAttendance;