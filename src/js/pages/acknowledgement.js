import React from "react";
import {useRequest} from "../common/hook";
import Loader from "../components/loader";
import MetaTag from "../components/metatag";
import '../../scss/pages/acknowledgement.scss';

function Acknowledgement(props) {
    const [data, loading] = useRequest(
        props.api + '/request/createRequest',
        props.location.state.request
    );

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