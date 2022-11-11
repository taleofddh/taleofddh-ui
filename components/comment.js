import React, {useState, useEffect} from 'react';
import {API} from "aws-amplify";
import {useFormFields} from "../common/hook";
import TypeInput from "./typeInput";
import TextArea from "./textarea";
import Loader from "./loader";
import LoaderButton from "./loaderbutton";

function Comment({blogName, type, messages}) {
    const [comments, setComments] = useState(messages);
    const [isLoading, setIsLoading] = useState(true);

    const [fields, handleFieldChange] = useFormFields({
        name : '',
        comment : ''
    });

    useEffect( () => {
        const getComments = async () => {
            const res = await API.post('findArticleCommentList',
                '/articleCommentList',
                {
                    response: true,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: {blogName: blogName}
                }
            );
            const result = await res.data;
            setComments([...result]);
            setIsLoading(false);
        }
        getComments();
    }, [blogName]);

    const submitComment = async (submitEvent) => {
        submitEvent.preventDefault();
        setIsLoading(true);
        console.log(form.name, form.comment);

        let comment = {
            blogName: blogName,
            name: form.name,
            comment: form.comment,
            date: JSON.stringify(new Date())
        }

        const response = await API.post(
            "addArticleComment",
            "/articleComment",
            {
                response: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: comment,
            }
        );

        //comment.date = response.data.ops[0].date;
        setComments(comments => [comment, ...comments]);

        setForm({
            ...form,
            comment: ''
        });

        setIsLoading(false);
    }

    const validateForm = () => {
        const nameRegex = RegExp('^[A-Za-z0-9 ]{1,50}$');
        return fields.name.length > 0 && fields.name.match(nameRegex)
            && fields.comment.length > 0;
    }

    return (
        isLoading ? (
            <Loader loading={isLoading} />
        ) : (
            <>
                <div className="commentcontainer">
                    <form key="CommentForm" name="CommentForm" onSubmit={submitComment}>
                        <p className="commentheader">Say something about this {type}</p>
                        <div className="commentfieldcontainer">
                            <TypeInput id="1"
                                       name="name"
                                       className="commentcustom"
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
                                      className="commentcustom"
                                      label="Message"
                                      disabled={false}
                                      required={true}
                                      initialValue=""
                                      value={fields.comment}
                                      placeHolder="Type your comment"
                                      onChange={handleFieldChange} />
                        </div>
                        <div className="commentbuttoncontainer">
                            <LoaderButton name="SubmitCommentButton"
                                          type="submit"
                                          label="Comment"
                                          isLoading={isLoading}
                                          disabled={!validateForm()} />
                        </div>
                    </form>
                </div>
                <div className="commentcontainer" style={{marginBottom: '10px'}}>
                    <div className="commentList">
                        <p className="commentheader">
                            <span className="commentbold">{comments.length}</span>{" "}
                            Comment{comments.length > 0 ? "s" : ""}
                        </p>

                        {comments.length === 0 ? (
                            <label>
                                Be the first to comment
                            </label>
                        ) : (
                            <>
                            </>
                        )}

                        {comments.map((item, index) => (
                            <div key={index} className="media mb-3">
                                <img
                                    className="mr-3 bg-light rounded"
                                    width="48"
                                    height="48"
                                    src={`https://api.adorable.io/avatars/48/${item.name.toLowerCase()}@adorable.io.png`}
                                    alt={item.name}
                                />

                                <div className="media-body p-2 shadow-sm rounded bg-light border">
                                    <small className="float-right text-muted">{item.date}</small>
                                    <h6 className="mt-0 mb-1 text-muted">{item.name}</h6>
                                    {item.comment}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    )
}

export default Comment;