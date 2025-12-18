import React, {useEffect, useState} from 'react';
import {getSessionCookie} from "../common/session";
import {fetchAuthSession} from "aws-amplify/auth";
import {post} from "aws-amplify/api";
import {onError} from "../common/error";
import Loader from "./loader";
import LoaderButton from "./loader-button";
import {dateTimeFormatToString} from '../common/common';

function EmailAdmin(props) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const[inboxData, setInboxData] = useState([]);
    const[sentData, setSentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(typeof window !== 'undefined'){
            setUrl(window.location.protocol + '//' + window.location.host);
        }
        const onLoad = async () => {
            try {
                const {identityId, tokens} = await fetchAuthSession({ forceRefresh: true });

                if(!tokens) {
                    let res = await post({
                        apiName: 'findMessageList',
                        path: '/messageList',
                        options: {
                            response: true,
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: {
                                folder: 'Inbox'
                            },
                        }
                    }).response;
                    setInboxData(await res.body.json());

                    res = await post({
                        apiName: 'findMessageList',
                        path: '/messageList',
                        options: {
                            response: true,
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: {
                                folder: 'Sent'
                            },
                        }
                    }).response;
                    setSentData(await res.body.json());
                }

                setIsLoading(false);
            }
            catch(e) {
                if (e !== 'No current user') {
                    onError(e);
                }
                setIsLoading(false);
            }
        }
        onLoad();
    }, []);

    const loadEmail = async (submitEvent) => {
        submitEvent.preventDefault();
        setIsLoading(true);
        await post({
            apiName: 'processStoredMessage',
            path: '/processMessage',
            options: {
                response: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: {prefix: "Inbox"},
            }
        }).response;
        setIsLoading(false);
    }

    return (
        <>
            {isLoading ? (
                <Loader loading={isLoading} />
            ) : (
                <>
                    <form key="Login" name="EmailForm" onSubmit={loadEmail}>
                        <div style={{width: '100%', float: 'left'}}>
                            <LoaderButton
                                name="ProcessMessageButton"
                                label="Load Email"
                                type="submit"
                                disabled={false}
                                isLoading={isLoading}
                            />
                        </div>
                        <div className="emailcontainer" style={{width: '100%', float: 'left', borderLeft: '1px solid rgb(71, 75, 79)',  borderTop: '1px solid rgb(71, 75, 79)'}}>
                            <div style={{width: 'calc(10% - 1px);', float: 'left'}}>
                                <ul className="emailfoldergroup">
                                    <li className="emailfolderitem">Inbox</li>
                                    <li className="emailfolderitem">Sent</li>
                                </ul>
                            </div>
                            <div style={{width: 'calc(30% - 1px);', float: 'left', borderLeft: '1px solid rgb(71, 75, 79)',  borderTop: '1px solid rgb(71, 75, 79)'}}>
                                <ul className="emailpreviewgroup" >
                                    {inboxData.map((item, index) => (
                                        <li key={index} className="emailpreviewitem">
                                            <p>{item.from} on {dateTimeFormatToString(new Date(item.date))}</p>
                                            <p>{item.subject}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div style={{width: 'calc(60% - 1px);', float: 'left', borderLeft: '1px solid rgb(71, 75, 79)',  borderTop: '1px solid rgb(71, 75, 79)'}}>
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