import React, {useState} from 'react';
import { useRouter } from 'next/router';
import {useIndex, useFormFields} from "../common/hook";
import {getSessionCookie} from "../common/session";
import TypeInput from "./typeInput";
import TextArea from "./textarea";
import LoaderButton from "./loaderbutton";
import { post } from "aws-amplify/api";
import {onError} from "../common/error";


function Enquiry({type, source}) {
    const router = useRouter();
    const index = useIndex();
    const [isLoading, setIsLoading] = useState(false);
    const [requestId, setRequestId] = useState('');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    const [fields, handleFieldChange] = useFormFields({
        name : '',
        email : '',
        phone : '',
        enquiry : ''
    });

    const submitEnquiry = async (submitEvent) => {
        submitEvent.preventDefault();
        console.log(fields.name, fields.email, fields.phone, fields.enquiry);

        let request = {
            type: type,
            countryCode: ddhomeCountry.country_code,
            requestor: fields.name,
            email: fields.email,
            phone: fields.phone,
            enquiry: fields.enquiry
        }

        console.log(request);

        try {
            const res = await post({
                apiName: "createRequest",
                path: "/createRequest",
                options: {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: request
                }
            }).response;
            const acknowledgement = await res.body.json();
            setRequestId(acknowledgement.number);
            setIsLoading(false);
            //alert("Your Enquiry is successfully submitted. The request number is " + acknowledgement.number);
        } catch (error) {
            onError(error);
            setIsLoading(false);
        }

        /*await router.push('/acknowledgement',
            '/' + source + '-acknowledgement'
        );*/

    }

    const validateForm = () => {
        const nameRegex = RegExp('^[A-Za-z0-9 ]{1,50}$');
        const emailRegex = RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');
        const phoneRegex = RegExp('^(\\(?\\+?[0-9]*\\)?)?[0-9_\\- \\(\\)]{8,}$');
        return fields.name.match(nameRegex)
            && fields.email.match(emailRegex)
            && (fields.phone.length === 0 || (fields.phone.length > 0 && fields.phone.match(phoneRegex) !== null))
            && fields.enquiry.length > 0;
    }

    return (
        <>
            {requestId === '' ? (
                    <>
                        <form key="EnquiryForm" name="EnquiryForm" onSubmit={submitEnquiry}>
                            <div className="enquirycontainer">
                                <div className="enquiryfieldcontainer">
                                    <TypeInput id="1"
                                               name="name"
                                               label="Name"
                                               type="text"
                                               disabled={false}
                                               required={true}
                                               maxLength={50}
                                               initialValue=""
                                               value={fields.name}
                                               placeHolder="e.g. John Smith"
                                               onChange={handleFieldChange}/>
                                </div>
                                <div className="enquiryfieldcontainer">
                                    <TypeInput id="2"
                                               name="email"
                                               label="Email"
                                               type="email"
                                               disabled={false}
                                               required={true}
                                               initialValue=""
                                               value={fields.email}
                                               placeHolder="e.g. email@domain.com"
                                               onChange={handleFieldChange}/>
                                </div>
                                <div className="enquiryfieldcontainer">
                                    <TypeInput id="3"
                                               name="phone"
                                               type="tel"
                                               label="Phone"
                                               disabled={false}
                                               required={false}
                                               initialValue=""
                                               value={fields.phone}
                                               placeHolder="+XX XXX XXX-XXXX"
                                               onChange={handleFieldChange}/>
                                </div>
                                <div className="enquiryfieldcontainer">
                                    <TextArea id="4"
                                              name="enquiry"
                                              label="Message"
                                              disabled={false}
                                              required={true}
                                              initialValue=""
                                              value={fields.enquiry}
                                              placeHolder="Type your query/message"
                                              onChange={handleFieldChange}/>
                                </div>
                        </div>
                        <div className="enquirybuttoncontainer">
                            <LoaderButton name="SubmitEnquiryButton"
                                          type="submit"
                                          label="Submit"
                                          disabled={!validateForm()}
                                          isLoading={isLoading} />
                        </div>
                    </form>
                </>
            ) : (
                <div className="acknowledgementcontainer">
                    <label className="acknowledgement">
                        <p>
                            {'Thanks for Contacting Us. Please note your request # ' + requestId + '. We have attempted to deliver an acknowledgement of the same to ' + fields.email + '.'}
                            <br />
                            {'In order to make sure you do not miss our e-mails, please check spam folder or spam settings in your e-mail account so the message is not blocked or filtered as spam.'}
                        </p>
                    </label>
                </div>
            )}

        </>
    )
}

export default Enquiry;