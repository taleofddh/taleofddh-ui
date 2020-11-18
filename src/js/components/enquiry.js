import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useApi} from "../common/hook";
import {getSessionCookie} from "../common/session";
import TypeInput from "../components/typeInput";
import TextArea from "../components/textarea";
import Button from "../components/button";
import '../../scss/components/enquiry.scss';
import '../../scss/components/popup.scss';

function Enquiry(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    const [form, setForm] = useState({
        name : '',
        email : '',
        phone : '',
        enquiry : ''
    });
    const [errors, setErrors] = useState({
        name : 'Name is not valid',
        email : 'Email is not valid',
        phone : '',
        enquiry : 'Enquiry is not valid'
    });

    const handleInputChange = (changeEvent) => {
        const name = changeEvent.target.name;
        const value = changeEvent.target.type === 'checkbox' ? changeEvent.target.checked : changeEvent.target.value;
        const nameRegex = RegExp('^[A-Za-z0-9 ]{1,50}$');
        const emailRegex = RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');
        const phoneRegex = RegExp('^(\\(?\\+?[0-9]*\\)?)?[0-9_\\- \\(\\)]{8,}$');
        let formErrors = errors;

        switch (name) {
            case 'name':
                formErrors.name =
                    value.match(nameRegex)
                        ? ''
                        : 'Name is not valid';
                break;
            case 'email':
                formErrors.email =
                    value.match(emailRegex)
                        ? ''
                        : 'Email is not Valid';
                break;
            case 'phone':
                formErrors.phone =
                    value.match(phoneRegex)
                        ? ''
                        : 'Phone is not Valid';
                break;
            case 'enquiry':
                formErrors.enquiry =
                    value.length < 1
                        ? 'Enquiry is not valid'
                        : '';
                break;
            default:
                break;
        }

        setForm({...form, [name] : value});
        setErrors(formErrors);
    }

    const submitEnquiry = (submitEvent) => {
        submitEvent.preventDefault();
        console.log(form.name, form.email, form.phone, form.enquiry);
        if(validateForm(errors)) {
            let request = {
                type: props.type,
                countryCode: ddhomeCountry.country_code,
                requestor: form.name,
                email: form.email,
                phone: form.phone,
                enquiry: form.enquiry
            }

            props.history.push('/' + props.source + '-acknowledgement', {
                api: api,
                source: props.source,
                index: index,
                request: request
            });

        } else {
            alert('Invalid Form. Please complete mandatory fields correctly marked with *')
        }
    }

    const validateForm = (errors) => {
        let valid = true;
        Object.values(errors).forEach(
            // if we have an error string set valid to false
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    return (
        <>
            <div className="enquirycontainer">
                <form key="EnquiryForm" name="EnquiryForm" onSubmit={submitEnquiry}>
                    <div className="enquiryfieldcontainer">
                        <TypeInput id="1"
                                   name="name"
                                   label="Name"
                                   type="text"
                                   disabled={false}
                                   required={true}
                                   maxLength={50}
                                   initialValue=""
                                   value={form.name}
                                   placeHolder="e.g. John Smith"
                                   pattern="^[A-Za-z0-9 ]{1,50}$"
                                   onChange={handleInputChange} />
                    </div>
                    <div className="enquiryfieldcontainer">
                        <TypeInput id="2"
                                   name="email"
                                   label="Email"
                                   type="email"
                                   disabled={false}
                                   required={true}
                                   initialValue=""
                                   value={form.email}
                                   placeHolder="e.g. email@domain.com"
                                   pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                   onChange={handleInputChange} />
                    </div>
                    <div className="enquiryfieldcontainer">
                        <TypeInput id="3"
                                   name="phone"
                                   type="tel"
                                   label="Phone"
                                   disabled={false}
                                   required={false}
                                   initialValue=""
                                   value={form.phone}
                                   placeHolder="+XX XXX XXX-XXXX"
                                   pattern="^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]{8,}$"
                                   onChange={handleInputChange} />
                    </div>
                    <div className="enquiryfieldcontainer">
                        <TextArea id="4"
                                  name="enquiry"
                                  label="Message"
                                  disabled={false}
                                  required={true}
                                  initialValue=""
                                  value={form.enquiry}
                                  placeHolder="Type your query/message"
                                  onChange={handleInputChange} />
                    </div>
                </form>
            </div>
            <div className="enquirybuttoncontainer">
                <Button name="SubmitEnquiryButton"
                    label="Submit"
                    disabled={true}
                    onClick={submitEnquiry} />
            </div>
        </>
    )
}

export default withRouter(Enquiry);