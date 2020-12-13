import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import { withRouter } from 'react-router-dom';
import {useApi, useFormFields} from "../common/hook";
import {getSessionCookie} from "../common/session";
import TypeInput from "../components/typeInput";
import TextArea from "../components/textarea";
import Button from "../components/button";
import '../../scss/components/comment.scss';

function Comment(props) {
    const [api, index] = useApi(window.location.hostname, window.location.protocol, 'api');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    const [fields, handleFieldChange] = useFormFields({
        name : '',
        comment : ''
    });

    const submitComment = (submitEvent) => {
        submitEvent.preventDefault();
        console.log(fields.name, fields.comment);

        let comment = {
            type: props.type,
            countryCode: ddhomeCountry.country_code,
            name: fields.name,
            comment: fields.comment
        }

        props.history.push('/' + props.source + '-acknowledgement', {
            api: api,
            source: props.source,
            index: index,
            comment: comment
        });

    }

    const validateForm = () => {
        const nameRegex = RegExp('^[A-Za-z0-9 ]{1,50}$');
        return fields.name.length > 0 && fields.name.match(nameRegex)
            && fields.comment.length > 0;
    }

    return (
        <>
            <form key="CommentForm" name="CommentForm" className="commentform" onSubmit={submitComment}>
                <div className="commentcontainer">
                    <p className="commentheader">Say something about this {props.type}</p>
                    <div className="commentfieldcontainer">
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
                                   pattern="^[A-Za-z0-9 ]{1,50}$"
                                   onChange={handleFieldChange} />
                    </div>
                    <div className="commentfieldcontainer">
                        <TextArea id="2"
                                  name="comment"
                                  label="Message"
                                  disabled={false}
                                  required={true}
                                  initialValue=""
                                  value={fields.comment}
                                  placeHolder="Type your comment"
                                  onChange={handleFieldChange} />
                    </div>
                </div>
                <div className="commentbuttoncontainer">
                    <Button name="SubmitCommentButton"
                            type="submit"
                            label="Comment"
                            disabled={!validateForm()} />
                </div>

            </form>
        </>
    )
}

export default withRouter(Comment);