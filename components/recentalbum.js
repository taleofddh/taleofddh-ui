import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DynamicPopup from "./dynamic/dynamic-popup";
import {MEDIA_HOST_PUBLIC} from "../common/constants";
import {useMediaQuery} from "../common/hook";
import Icon from "../common/icon";
import Button from "./button";
import Title from './title';
import {dateDifference, dateFormatToString, dateFormatWithLongMonthToString, timeFormatToString} from "../common/common";
import EventPopup from "./event-popup";

function RecentAlbum({ eventType, events, category, subCategory, maxRow }) {
    const matches = useMediaQuery('(max-width: 600px)');
    const contentStyle = {
        container: maxWidth => ({
            width: maxWidth ? '90%' : '50%'
        })
    };

    let count = 0;
    if(maxRow) {
       count = maxRow;
    } else {
        count = events.length;
    }

    return (
        <>
            <div className="upcomingeventframe">
            <Title message={eventType + ' Events'} />
            {events.length > 0 ? (
                <ul className="upcomingeventgroup">
                    {events.map((item, index) => (
                        index < count ? (
                            <li key={index} className="upcomingeventitem">
                                <DynamicPopup
                                    trigger={
                                        <div>
                                            <div className="upcomingeventtitle">
                                                <Icon name="events" fill="rgb(3, 62, 62)" /><p style={{margin: '0px'}}>{item.name}</p>
                                                {item.ticketLink ? (
                                                    <>
                                                        <Icon name="ticket" fill="rgb(71, 75, 79)" />
                                                        <p style={{margin: '0px', fontWeight: 'normal'}}><a href={item.ticketLink} target='_blank'>{item.ticketLink}</a></p>
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                            <div className="upcomingeventdate">
                                                {dateDifference(dateFormatToString(new Date(item.startDateTime)), dateFormatToString(new Date(item.endDateTime))) ?
                                                    (
                                                        <>
                                                            <Icon name="date" fill="rgb(71, 75, 79)" />
                                                            <p style={{margin: '0px'}}>{dateFormatWithLongMonthToString(new Date(item.startDateTime))}</p>
                                                            <Icon name="time" fill="rgb(71, 75, 79)" />
                                                            <p style={{margin: '0px'}}>{timeFormatToString(new Date(item.startDateTime)) + ' to ' + timeFormatToString(new Date(item.endDateTime))}</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Icon name="date" fill="rgb(71, 75, 79)" />
                                                            <p style={{margin: '0px'}}>{dateFormatWithLongMonthToString(new Date(item.startDateTime))}</p>
                                                            to
                                                            <p style={{margin: '0px'}}>{dateFormatWithLongMonthToString(new Date(item.endDateTime))}</p>
                                                        </>
                                                    )}

                                            </div>
                                            <div className="upcomingeventimage">
                                                <img src={MEDIA_HOST_PUBLIC + '/images/' + item.albumLocation + '/' + item.flyerImage} alt={item.flyerImage} />
                                            </div>
                                            <div className="upcomingeventlocation">
                                                <Icon name="address" fill="rgb(71, 75, 79)" />
                                                <p style={{margin: '0px'}}>{item.venue}</p>
                                                <p style={{margin: '0px'}}>{item.address1}</p>
                                                <p style={{margin: '0px'}}>{item.address2}</p>
                                                <p style={{margin: '0px'}}>{item.city}, {item.postCode}</p>
                                            </div>
                                        </div>
                                    }
                                    modal
                                    closeOnEscape={true}
                                    contentStyle={contentStyle.container(matches)}>
                                    {close => (
                                        <div className="modal">
                                            <a className="close" onClick={close}>
                                                &times;
                                            </a>

                                            <div className="header">
                                                <p style={{margin: '5px'}}>{item.name.toUpperCase()}</p>
                                            </div>
                                            <div className="content">
                                                <EventPopup event={item} />
                                            </div>
                                            <div className="actions">
                                                <Button
                                                    onClick={() => {
                                                        console.log("modal closed ");
                                                        close();
                                                    }}
                                                    label="Close"
                                                    name="CloseButton" />
                                            </div>
                                        </div>
                                    )}
                                </DynamicPopup>

                            </li>
                        ) : (
                            <React.Fragment key={index}>
                            </React.Fragment>
                        )
                    ))}
                </ul>
            ) : (
                <div className="upcomingeventmessage">
                    <p>
                        There are no upcoming {category ? category : ''}{subCategory ? subCategory : ''} event(s) scheduled
                    </p>
                </div>
            )}
            {events.length > count ? (
                <div className="upcomingeventmessage" style={{backgroundColor: "rgba(255, 255, 255, 0)", textAlign: "center"}}>
                    <p>
                        <Link href="/events" as="/events">View more upcoming events</Link>.
                    </p>
                </div>
            ) : (
                <></>
            )}
            </div>
        </>
    )
}

export default RecentAlbum;