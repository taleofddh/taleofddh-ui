import React, {useEffect} from "react";
import {usePost} from "../common/hook";
import {postAuditEntry} from "../common/common";
import {getSessionCookie} from "../common/session";
import Loader from "../components/loader";
import MetaTag from "../components/metatag";

function Acknowledgement(props) {
    const [data, loading] = usePost(
        'createRequest',
        '/createRequest',
        (props.location.state && props.location.state !== undefined) ? props.location.state.request : ''
    );
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'acknowledgement',
                message: 'Acknowledgement Page Accessed'
            }
        );
    });

    return (
        <>
            <MetaTag page={props.location.state.source} index={props.location.state.index} url={window.location.protocol + '//'  + window.location.hostname} />
            <div className="boxouter">
                <div className="container">
                    <div className="acknowledgementframe">
                        {loading ? (
                            <Loader loading={loading} />
                        ) : (
                            <div className="acknowledgementcontainer">
                                <label className="acknowledgement">
                                    <p>
                                        {'Thanks for Contacting Us. Please note your request # ' + data.number + '. We have attempted to deliver an acknowledgement of the same to ' + data.email + '.'}
                                        <br />
                                        {'In order to make sure you do not miss our e-mails, please check spam folder or spam settings in your e-mail account so the message is not blocked or filtered as spam.'}
                                    </p>
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Acknowledgement;