import React, {useState} from 'react';
import {get, post} from 'aws-amplify/api';
import {fetchAuthSession} from "aws-amplify/auth";
import {
    dateFormatWithLongMonthToString,
    dateTimeFullFormatToString,
    formatMoney
} from "../common/common";
import {onError} from "../common/error";
import TypeInput from "./type-Input";
import CheckBox from "./checkbox";
import LoaderButton from "./loader-button";
import Select from "./select";
import Label from "./label";
import Loader from "./loader";

function AttendanceForm({data, member}) {
    const initialResult = {};
    const [isLoading, setIsLoading] = useState(false);
    const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [result, setResult] = useState(initialResult);
    //const [deadline, setDeadline] = useState('');
    let eventOpts = [];
    let defaultEventOpt = {sequence: 0, value: "XX", label: "Select an Event"};
    data.map((item, index) => {
        eventOpts = [...eventOpts, {"sequence": (index + 1), "value": item.name, "label": item.name}];
    });

    const initialFields = {
        familyCode: member.familyCode,
        name: '',
        paymentDeadline: '',
        shortName: member.shortName,
        noOfAdults: 0,
        noOfKids: 0,
        noOfBabies: 0,
        memberAdultPrice: 0,
        memberChildPrice: 0,
        totalAmount: 0,
        confirmPayment: false,
        updatedAt: dateTimeFullFormatToString(new Date())
    }
    const [fields, setFields] = useState(initialFields);

    const clearResult = () => {
        setResult({...initialResult});
    }

    const handleFieldChange = (event) => {
        let totalAmount = fields.totalAmount;
        if (event.target.name === 'noOfAdults') {
            totalAmount = parseFloat(fields.memberAdultPrice) * parseInt(event.target.value)
                + parseFloat(fields.memberChildPrice) * parseInt(fields.noOfKids)
        } else if (event.target.name === 'noOfKids') {
            totalAmount = parseFloat(fields.memberAdultPrice) * parseInt(fields.noOfAdults)
                + parseFloat(fields.memberChildPrice) * parseInt(event.target.value)
        }
        setFields({
            ...fields,
            [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : parseInt(event.target.value),
            totalAmount: totalAmount,
            updateAt: dateTimeFullFormatToString(new Date())
        });
        setMessage('');
        //clearResult();
    }

    const handleSelect = async (event) => {
        clearResult();
        if(event.target.value !== '' && event.target.value !== 'XX') {
            setIsAttendanceLoading(true);

            setFields({
                ...fields,
                [event.target.name]: event.target.value
            });

            const arr = data.filter(item => {
                return item.name === event.target.value;
            });
            let tEvent = arr[0];
            const startDate = new Date(tEvent.startDateTime);
            //console.log(startDate.getDate());
            //setDeadline(dateFormatWithLongMonthToString(new Date(startDate.setMilliseconds(startDate.getMilliseconds() - 14*24*60*60*1000))));

            try {
                const {tokens} = await fetchAuthSession({forceRefresh: true});
                if(tokens && tokens !== undefined) {
                    const res = await get({
                        apiName: "findEventAttendance",
                        path: "/findAttendance/" + encodeURI(member.familyCode) + '/' + encodeURI(event.target.value),
                        options: {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            }
                        }
                    }).response;

                    const attendance = await res.body.json();
                    //console.log(attendance);

                    if (!attendance || (Object.keys(attendance).length === 0 && attendance.constructor === Object)) {
                        setFields({
                            ...fields,
                            [event.target.name]: event.target.value,
                            paymentDeadline: dateFormatWithLongMonthToString(new Date(startDate.setDate(startDate.getDate() - 14))),
                            memberAdultPrice: parseFloat(tEvent.memberAdultPrice),
                            memberChildPrice: parseFloat(tEvent.memberChildPrice),
                            totalAmount: parseFloat(tEvent.memberAdultPrice) * parseInt(fields.noOfAdults)
                                + parseFloat(tEvent.memberChildPrice) * parseInt(fields.noOfKids),
                            updatedAt: dateTimeFullFormatToString(new Date())
                        });
                    } else {
                        setFields({
                            ...fields,
                            familyCode: attendance.familyCode,
                            name: attendance.name,
                            paymentDeadline: attendance.paymentDeadline,
                            shortName: attendance.shortName,
                            noOfAdults: attendance.noOfAdults,
                            noOfKids: attendance.noOfKids,
                            noOfBabies: attendance.noOfBabies,
                            memberAdultPrice: parseFloat(tEvent.memberAdultPrice),
                            memberChildPrice: parseFloat(tEvent.memberChildPrice),
                            totalAmount: parseFloat(tEvent.memberAdultPrice) * parseInt(attendance.noOfAdults)
                                + parseFloat(tEvent.memberChildPrice) * parseInt(attendance.noOfKids),
                            confirmPayment: attendance.confirmPayment,
                            updatedAt: attendance.updatedAt
                        });
                        setResult(result => Object.assign(result, attendance));
                    }
                }
                setIsAttendanceLoading(false);
            } catch (error) {
                onError(error);
                setIsAttendanceLoading(false);
            }
            //setDeadline(dateFormatWithShortMonthToString(new Date().setDate(new Date(tEvent.startDateTime) - 14)));
        } else {
            setFields({
                ...fields,
                ...initialFields
            });
        }
        setMessage('');
    }

    const validateForm = () => {
        let valid;
        valid = ((result.noOfAdults !== fields.noOfAdults)
            || (result.noOfKids !== fields.noOfKids)
            || (result.noOfBabies !== fields.noOfBabies)
            || (result.memberAdultPrice !== fields.memberAdultPrice)
            || (result.memberChildPrice !== fields.memberChildPrice)
            || (result.confirmPayment != fields.confirmPayment))
            && ((fields.name !== '' || fields.name !== 'XX')
                && fields.noOfAdults > 0)
        return valid;
    }

    const submitEventAttendance = async (submitEvent) => {
        submitEvent.preventDefault();
        setIsLoading(true);
        let attendance = {
            familyCode: fields.familyCode,
            name: fields.name,
            paymentDeadline: fields.paymentDeadline,
            shortName: fields.shortName,
            noOfAdults: fields.noOfAdults,
            noOfKids: fields.noOfKids,
            noOfBabies: fields.noOfBabies,
            memberAdultPrice: fields.memberAdultPrice,
            memberChildPrice: fields.memberChildPrice,
            totalAmount: fields.totalAmount,
            confirmPayment: fields.confirmPayment,
            updatedAt: fields.updatedAt,
            members: member.members
        }
        //console.log(attendance);

        try {
            await fetchAuthSession({ forceRefresh: true });
            clearResult();
            setMessage('Submitting your attendance for ' + fields.name);
            setSuccess(false);
            const {tokens} = await fetchAuthSession({forceRefresh: true});
            if (tokens && tokens !== undefined) {
                const response = await post({
                    apiName: "createOrUpdateEventAttendance",
                    path: "/createOrUpdateAttendance",
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: attendance
                    }
                }).response;
                const attendanceSubmitted = await response.body.json();
                setResult(result => Object.assign(result, attendanceSubmitted));
                setMessage('Your attendance for ' + attendanceSubmitted.name + ' has been successfully submitted');
                setSuccess(true);
            }
            setIsLoading(false);
        } catch (error) {
            if (error !== 'No current user') {
                onError(error);
                setMessage('Your attendance for ' + fields.name + ' has not been successfully submitted');
                setSuccess(false);
                setIsLoading(false);
            }
        }
    }

    return (
        <>
            <form key="AttendanceForm" name="AttendanceForm" onSubmit={submitEventAttendance}>
                <div className="profilecontainer">
                    <div className="profilefieldcontainer">
                        <p className="attendancemessage">
                            Complete this form only for ticketed event(s)
                        </p>
                    </div>
                    <div className="profilefieldcontainer">
                        <Select id="1"
                                name="name"
                                disabled={false}
                                required={true}
                                label="Event"
                                note="While it's possible to complete attendance for any future ticketed event, but it is recommended to select event for which member price has been decided"
                                defaultOption={defaultEventOpt}
                                options={eventOpts}
                                value={fields.name}
                                onChange={handleSelect} />
                    </div>
                    {fields.name !== '' && fields.name !== 'XX' ? (
                        isAttendanceLoading ? (
                            <Loader loading={isAttendanceLoading} />
                        ) : (
                            <>
                                <div className="profilefieldcontainer">
                                    <Label name="amount" label="Ticket Price" required={false}/>
                                    <Label name="amount" label={'Adults (11+) : £' + formatMoney(fields.memberAdultPrice, 2)} required={false} className="lblnote" />
                                    <Label name="amount" label={'Kids (5-11) : £' + formatMoney(fields.memberChildPrice, 2)} required={false} className="lblnote" />
                                    <Label name="amount" label='Under 5 : Free' required={false} className="lblnote" />
                                </div>
                                <div className="profilefieldcontainer">
                                    <TypeInput id="2"
                                               name="noOfAdults"
                                               label="No. of Adults (11+)"
                                               note="A minimum of 1 Adult is required for submission"
                                               type="number"
                                               inputMode="numeric"
                                               disabled={false}
                                               required={true}
                                               min={1}
                                               max={99}
                                               maxLength={2}
                                               initialValue={fields.noOfAdults+''}
                                               value={fields.noOfAdults+''}
                                               placeHolder="Only numbers 1-99"
                                               pattern="[0-9]{1,2}"
                                               onChange={handleFieldChange} />
                                </div>
                                <div className="profilefieldcontainer">
                                    <TypeInput id="3"
                                               name="noOfKids"
                                               label="No. of Kids (5-11)"
                                               type="number"
                                               inputMode="numeric"
                                               disabled={false}
                                               required={false}
                                               min={0}
                                               max={99}
                                               maxLength={2}
                                               initialValue={fields.noOfKids+''}
                                               value={fields.noOfKids+''}
                                               placeHolder="Only numbers 0-99"
                                               onChange={handleFieldChange} />
                                </div>
                                <div className="profilefieldcontainer">
                                    <TypeInput id="4"
                                               name="noOfBabies"
                                               label="No. of Kids (Under 5)"
                                               type="number"
                                               inputMode="numeric"
                                               disabled={false}
                                               required={false}
                                               min={0}
                                               max={99}
                                               maxLength={2}
                                               initialValue={fields.noOfBabies+''}
                                               value={fields.noOfBabies+''}
                                               placeHolder="Only numbers 0-99"
                                               onChange={handleFieldChange} />
                                </div>
                                {fields.name !== '' || fields.name !== 'XX' ? (
                                    <div className="profilefieldcontainer">
                                        <Label name="amount" label={'Total amount to pay : £' + formatMoney(fields.totalAmount, 2)} required={false}/>
                                        <Label name="amount" label={'Payment deadline : ' + fields.paymentDeadline} required={false}/>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <div className="profilefieldcontainer">
                                    <CheckBox id="5"
                                              name="confirmPayment"
                                              label="Tick this box if total amount is paid"
                                              note="Attendance can be submitted without this box ticked. But same needs to be confirmed later"
                                              value={fields.confirmPayment}
                                              disabled={false}
                                              required={false}
                                              initialState={fields.confirmPayment}
                                              onChange={handleFieldChange} />
                                </div>
                                <div className="fieldcontainer" style={{textAlign: "center"}}>
                                    <label style={{fontSize: '1.1rem', color: success ? 'green' : 'red', fontWeight: 'bold'}}>{message}</label>
                                </div>
                                <div className="profilebuttoncontainer">
                                    <LoaderButton name="SubmitEventAttendanceButton"
                                                  type="submit"
                                                  label="Confirm Attendance"
                                                  disabled={!validateForm()}
                                                  isLoading={isLoading} />
                                </div>
                            </>
                        )
                    ) : (
                        <></>
                    )}
                </div>

            </form>
        </>
    )
}

export default AttendanceForm;