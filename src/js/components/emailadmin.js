import React, {useEffect, useState} from 'react';
import {getSessionCookie} from "../common/session";
import {usePost} from "../common/hook";
import Loader from "./loader";

function EmailAdmin(props) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const[messageData, messageDataLoading] = usePost(
        'findMessageList',
        '/messageList',
        {
            prefix: 'Inbox'
        }
    );

    return (
        <>
            {messageDataLoading ? (
                <Loader loading={messageDataLoading} />
            ) : (
                <div>
                    <div style={{width: '10%', float: 'left'}}>
                        <ul>
                            <li>Inbox</li>
                            <li>Sent</li>
                        </ul>
                    </div>
                    <div style={{width: '30%', float: 'left'}}>
                        <ul>
                            <li>Message 1</li>
                            <li>Message 2</li>
                        </ul>
                    </div>
                    <div style={{width: '60%', float: 'left'}}>
                        <h2>Message 1 Details</h2>
                    </div>
                </div>
            )}
        </>
    )
}

export default EmailAdmin;