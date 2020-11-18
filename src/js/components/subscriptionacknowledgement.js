import React, {useEffect, useState} from 'react';
import {useApi, useSubscription} from "../common/hook";
import Loader from "./loader";
import '../../scss/components/stayconnected.scss';

function SubscriptionAcknowledgement(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const [data, loading] = useSubscription(
        api + '/request/updateSubscription',
        props.subscription
    );

    return (
        <>
            {loading ? (
                <Loader loading={loading} />
            ) : (
                <div className="subscriptionacknowledgementcontainer">
                    <p>
                        <label className="subscriptionacknowledgement">
                            We are delighted that you chose to stay connected with us. We shall keep you informed about our roadmap and plan of launching new services.
                        </label>
                    </p>
                </div>
            )}
        </>
    )

}

export default SubscriptionAcknowledgement;