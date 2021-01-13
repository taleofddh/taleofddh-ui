import React, {useEffect, useState} from 'react';
import {getSessionCookie} from "../common/session";
import {usePost} from "../common/hook";
import Loader from "./loader";
import LoaderButton from "./loaderbutton";
import {API} from "aws-amplify";

function EmailAdmin(props) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const[messageData, messageDataLoading] = usePost(
        'findMessageList',
        '/messageList',
        {
            prefix: 'Inbox'
        }
    );

    const [isLoading, setIsLoading] = useState(false);

    const loadEmail = async (submitEvent) => {
        submitEvent.preventDefault();
        setIsLoading(true);
        await API.post("processStoredMessage", "/processMessage", {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: {prefix: "Inbox"}
        });
        setIsLoading(false);
    }

    return (
        <>
            {messageDataLoading ? (
                <Loader loading={messageDataLoading} />
            ) : (
                <>
                    <form key="LoginForm" name="EmailForm" onSubmit={loadEmail}>
                        <div style={{width: '100%', float: 'left'}}>
                            <LoaderButton
                                name="ProcessMessageButton"
                                label="Load Email"
                                type="submit"
                                disabled={false}
                                isLoading={isLoading}
                            />
                        </div>
                        <div style={{width: '100%', float: 'left'}}>
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
                    </form>
                </>
            )}
        </>
    )
}

export default EmailAdmin;