import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import {useHistory} from 'react-router-dom';
import {useApi, useFormFields} from "../common/hook";
import {getSessionCookie} from "../common/session";
import TypeInput from "../components/typeInput";
import TextArea from "../components/textarea";
import CheckBox from "./checkbox";
import Button from "../components/button";
import '../../scss/components/profile.scss';
import '../../scss/components/popup.scss';
import {dateFormatToString} from "../common/common";

function Profile(props) {
    const history = useHistory();
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    const profile = props.data;

    const [fields, handleFieldChange] = useFormFields({
        firstName : profile.firstName,
        lastName: profile.lastName,
        dateOfBirth: dateFormatToString(new Date(profile.dateOfBirth)),
        gender: profile.gender,
        email : profile.email,
        address1: profile.address1,
        address2: profile.address2,
        city: profile.city,
        postCode: profile.postCode,
        countryCode: profile.countryCode,
        phone: profile.phone,
        about: profile.about,
        communityList: profile.communityList,
        mailingFlag: profile.mailingFlag
    });

    const submitProfileUpdate = (submitEvent) => {
        submitEvent.preventDefault();
        console.log(fields.firstName, fields.email, fields.phone, fields.about);

        let request = {
            countryCode: ddhomeCountry.country_code,
            requestor: fields.firstName,
            email: fields.email,
            phone: fields.phone,
        }

        history.push('/' + props.source + '-acknowledgement', {
            api: api,
            source: props.source,
            index: index,
            request: request
        });

    }

    const validateForm = () => {
        const nameRegex = RegExp('^[A-Za-z0-9 ]{1,50}$');
        const emailRegex = RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$');
        const phoneRegex = RegExp('^(\\(?\\+?[0-9]*\\)?)?[0-9_\\- \\(\\)]{8,}$');
        return fields.firstName.match(nameRegex)
            && fields.email.match(emailRegex)
            && (fields.phone.length === 0 || (fields.phone.length > 0 && fields.phone.match(phoneRegex)))
            && fields.about.length > 0;
    }

    return (
        <>
            <div className="profilecontainer">
                <form key="ProfileForm" name="ProfileForm" onSubmit={submitProfileUpdate}>
                    <div className="profilefieldcontainer">
                        <TypeInput id="1"
                                   name="firstName"
                                   label="First Name"
                                   type="text"
                                   disabled={false}
                                   required={false}
                                   maxLength={50}
                                   initialValue={fields.firstName}
                                   value={fields.firstName}
                                   placeHolder="e.g. John"
                                   pattern="^[A-Za-z0-9 ]{1,50}$"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="profilefieldcontainer">
                        <TypeInput id="2"
                                   name="lastName"
                                   label="Last Name"
                                   type="text"
                                   disabled={false}
                                   required={false}
                                   maxLength={50}
                                   initialValue={fields.lastName}
                                   value={fields.lastName}
                                   placeHolder="e.g. Smith"
                                   pattern="^[A-Za-z0-9 ]{1,50}$"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="profilefieldcontainer">
                        <TypeInput id="3"
                                   name="dateOfBirth"
                                   label="Date of Birth"
                                   type="date"
                                   disabled={false}
                                   required={false}
                                   maxLength={50}
                                   initialValue={fields.dateOfBirth}
                                   value={fields.dateOfBirth}
                                   placeHolder="e.g. Smith"
                                   pattern="^[A-Za-z0-9 ]{1,50}$"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="profilefieldcontainer">
                        <TypeInput id="4"
                                   name="gender"
                                   label="Gender"
                                   type="text"
                                   disabled={false}
                                   required={false}
                                   maxLength={50}
                                   initialValue={fields.gender}
                                   value={fields.gender}
                                   placeHolder="e.g. Smith"
                                   pattern="^[A-Za-z0-9 ]{1,50}$"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="profilefieldcontainer">
                        <TypeInput id="5"
                                   name="email"
                                   label="Email"
                                   type="email"
                                   disabled={true}
                                   required={true}
                                   initialValue={fields.email}
                                   value={fields.email}
                                   placeHolder="e.g. email@domain.com"
                                   pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="profilefieldcontainer">
                        <TypeInput id="6"
                                   name="address1"
                                   label="Address 1"
                                   type="text"
                                   disabled={false}
                                   required={false}
                                   maxLength={50}
                                   initialValue={fields.address1}
                                   value={fields.address1}
                                   placeHolder="e.g. Smith"
                                   pattern="^[A-Za-z0-9 ]{1,50}$"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="profilefieldcontainer">
                        <TypeInput id="7"
                                   name="address2"
                                   label="Address 2"
                                   type="text"
                                   disabled={false}
                                   required={false}
                                   maxLength={50}
                                   initialValue={fields.address2}
                                   value={fields.address2}
                                   placeHolder="e.g. Smith"
                                   pattern="^[A-Za-z0-9 ]{1,50}$"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="profilefieldcontainer">
                        <TypeInput id="8"
                                   name="city"
                                   label="City"
                                   type="text"
                                   disabled={false}
                                   required={false}
                                   maxLength={50}
                                   initialValue={fields.city}
                                   value={fields.city}
                                   placeHolder="e.g. Smith"
                                   pattern="^[A-Za-z0-9 ]{1,50}$"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="profilefieldcontainer">
                        <TypeInput id="9"
                                   name="postCode"
                                   label="Post Code"
                                   type="text"
                                   disabled={false}
                                   required={false}
                                   maxLength={50}
                                   initialValue={fields.postCode}
                                   value={fields.postCode}
                                   placeHolder="e.g. Smith"
                                   pattern="^[A-Za-z0-9 ]{1,50}$"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="profilefieldcontainer">
                        <TypeInput id="10"
                                   name="countryCode"
                                   label="Country"
                                   type="text"
                                   disabled={false}
                                   required={false}
                                   maxLength={50}
                                   initialValue={fields.countryCode}
                                   value={fields.countryCode}
                                   placeHolder="e.g. Smith"
                                   pattern="^[A-Za-z0-9 ]{1,50}$"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="profilefieldcontainer">
                        <TypeInput id="11"
                                   name="phone"
                                   type="tel"
                                   label="Phone"
                                   disabled={false}
                                   required={false}
                                   initialValue={fields.phone}
                                   value={fields.phone}
                                   placeHolder="+XX XXX XXX-XXXX"
                                   pattern="^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]{8,}$"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="profilefieldcontainer">
                        <TextArea id="12"
                                  name="about"
                                  label="About Yourself"
                                  disabled={false}
                                  required={false}
                                  initialValue={fields.about}
                                  value={fields.about}
                                  placeHolder="About Yourself"
                                  onChange={handleFieldChange} />
                    </div>
                    <div className="profilefieldcontainer">
                        <TypeInput id="13"
                                   name="communityList"
                                   label="Community(s)"
                                   type="text"
                                   disabled={false}
                                   required={false}
                                   maxLength={50}
                                   initialValue={fields.communityList}
                                   value={fields.communityList}
                                   placeHolder="e.g. Smith"
                                   pattern="^[A-Za-z0-9 ]{1,50}$"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="profilefieldcontainer">
                        <CheckBox id="14"
                                  name="mailingFlag"
                                  label="Would you like to join our mailing list?"
                                  value={fields.mailingFlag}
                                  disabled={false}
                                  required={false}
                                  initialState={fields.mailingFlag}
                                  onChange={handleFieldChange} />
                    </div>
                </form>
            </div>
            <div className="profilebuttoncontainer">
                <Button name="SubmitEnquiryButton"
                        type="submit"
                        label="Update Profile"
                        disabled={!validateForm()} />
            </div>
        </>
    )
}

export default Profile;