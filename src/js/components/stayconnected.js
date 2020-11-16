'use strict';

import React, {useEffect, useState} from 'react';
import TypeInput from "./typeInput";
import Button from "./button";
import Label from "./label";
import Radio from "./radio";
import SubscriptionAcknowledgement from "./subscriptionacknowledgement";
import '../../scss/components/stayconnected.scss';

function StayConnected(props) {
    let additionalQueryValues = [];
    if(props.isAdditionalEnqueries) {
        additionalQueryValues = props.stayConnectedEnqueries.map((item) => {
            return {...additionalQueryValues, sequence : item.sequence + '', enquiry: item.question, response : '', required: item.required}
        })
    }
    const [content, setContent] = useState([]);
    const [form, setForm] = useState({
        email : ''
    });
    const [errors, setErrors] = useState({
        email : 'Email is not valid'
    });
    const [stayConnectedEnquiryResponses, setStayConnectedEnquiryResponses] = useState(additionalQueryValues);

    useEffect(() => {
        let marginTop;
        if(props.isAdditionalEnqueries) {
            marginTop = '12px';
        }
        let contentDetails =
            <>
                <div className="formcontainer">
                    {props.isAdditionalEnqueries ? (
                        <>
                            {props.stayConnectedEnqueries.map((item) => (
                                <div className="fieldcontainer">
                                    {stayConnectedEnquiry(item)}
                                </div>
                            ))}
                        </>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="formcontainer">
                    <form key="StayConnectedForm" name="StayConnectedForm" onSubmit={submitSubscription}>
                        <div className="fieldcontainer">
                            <TypeInput
                                id="1"
                                name="email"
                                label="Enter Your Email"
                                type="email"
                                disabled={false}
                                required={true}
                                initialValue=""
                                note="We will never spam your inbox"
                                value={form.email}
                                placeHolder=""
                                pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                onChange={handleInputChange} />
                        </div>
                    </form>
                </div>
                <div className="connectedbuttoncontainer" style={{marginTop: marginTop}}>
                    <Button name="StayConnectedButton"
                            label="Stay Connected"
                            disabled={false}
                            onClick={submitSubscription} />
                </div>
            </>;

        setContent(content => ([...content, contentDetails]));
    }, []);

    const handleInputChange = (changeEvent) => {
        const name = changeEvent.target.name;
        const value = changeEvent.target.type === 'checkbox' ? changeEvent.target.checked : changeEvent.target.value;
        const emailRegex = RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');
        let formErrors = errors;
        let formDetails = form;

        switch (name) {
            case 'email':
                formErrors.email =
                    value.match(emailRegex)
                        ? ''
                        : 'Email is not Valid';
                formDetails.email = value;
                break;
            default:
                break;
        }

        setForm(formDetails);
        setErrors(formErrors);
    }

    const stayConnectedEnquiry = (enquiry) => {
        let input;
        let note;
        if (enquiry.note !== '') {
            note =
                <label className="stayconnectedenquirynote">
                    {'(' + enquiry.note + ')'}
                </label>
        }
        if(enquiry.type.toUpperCase() === 'RADIO') {
            let question =
                <Label id={enquiry.sequence + ''}
                       name={enquiry.question}
                       label={enquiry.question}
                       disabled={false}
                       required={enquiry.required} />
            let options =
                enquiry.optionList.map((item, index) => {
                    return (
                        <Radio key={index}
                               id={enquiry.sequence + ''}
                               type={enquiry.type}
                               name={enquiry.question}
                               label={item.choice}
                               value={item.choice}
                               disabled={false}
                               required={false}
                               initialState={false}
                               onChange={handleAdditionalEnquriesChange}/>
                    )
                })
            input =
                <>
                    <div className="stayconnectedenquiryquestion">
                        {question}
                        {note}
                    </div>
                    <div className="stayconnectedenquiryoptions">
                        {options}
                    </div>
                </>
        }

        return (
            input
        )
    }

    const handleAdditionalEnquriesChange = (changeEvent) => {
        let responsesDetails = [...stayConnectedEnquiryResponses];
        responsesDetails = responsesDetails.map((item) => {
            if(item.sequence === changeEvent.target.id && item.enquiry === changeEvent.target.name) {
                item.response = changeEvent.target.value
            }
            return item;
        })

        console.log("responsesDetails", responsesDetails);

        setStayConnectedEnquiryResponses(responsesDetails);
    }

    const submitSubscription = (submitEvent) => {
        submitEvent.preventDefault();
        console.log("email", form.email);
        if(validateForm(errors)) {
            let subscription = {
                email: form.email,
                subscribed: true
            }
            let contentDetails =
                <SubscriptionAcknowledgement subscription={subscription} />

            setContent(content => ([...content, contentDetails]));

        } else {
            alert('Please complete mandatory field(s) correctly marked with *')
        }
    }

    const validateForm = (errors) => {
        let valid = true;
        console.log("errors", errors);
        Object.values(errors).forEach(
            // if we have an error string set valid to false
            (val) => val.length > 0 && (valid = false)
        );
        if(props.isAdditionalEnqueries) {
            stayConnectedEnquiryResponses.map((item) => {
                if(item.required && item.response === '') {
                    valid = false;
                    console.log("In invalid response");
                }
            })
        }
        return valid;
    }

    return(
        <div className="stayconnected">
            {content}
        </div>
    )
}

export default StayConnected;