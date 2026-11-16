import React, {useState, useEffect, useRef} from 'react';
import {useRouter} from 'next/router';
import {adminGet, adminPost, getErrorStatus} from "../common/admin-api";
import {NO_ACCESS_MESSAGE} from "../common/permissions";
import {onError} from "../common/error";
import {MEDIA_HOST} from "../common/constants";
import TypeInput from "./type-input";
import TextArea from "./textarea";
import Select from "./select";
import LoaderButton from "./loader-button";
import Loader from "./loader";
import Markdown from "./markdown";
export const BLOG_CATEGORIES = ['Travel', 'Recipe', 'Technical'];
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 80;
const UNSAVED_MESSAGE = 'You have unsaved changes. Leave this page?';
export const slugify = (title) => String(title || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, '');
// The API stores YYYY-MM-DDTHH:mm:ss; <input type="datetime-local"> shows YYYY-MM-DDTHH:mm.
const toInputValue = (value) => (value ? String(value).slice(0, 16) : '');
// Keep a stored value untouched; only complete a value the user typed.
const toApiValue = (value) => (value && value.length === 16 ? value + ':00' : value);
const nowInputValue = () => {
    const d = new Date();
    d.setSeconds(0, 0);
    const pad = (n) => (n > 9 ? '' : '0') + n;
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
};
const photoKey = (category, name) => category.toLowerCase() + '/' + name;
const parseFieldErrors = (error) => {
    try {
        const body = error?.response?.body;
        const parsed = typeof body === 'string' ? JSON.parse(body) : body;
        const errors = parsed?.error?.details?.errors;
        return Array.isArray(errors) ? errors.map(String) : [];
    } catch (e) {
        return [];
    }
};
// A JPEG starts with FF D8 FF. The extension and MIME type can be wrong; the bytes can't.
const looksLikeJpeg = async (file) => {
    const bytes = new Uint8Array(await file.slice(0, 3).arrayBuffer());
    return bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
};
export const validatePhoto = async (file) => {
    if (!/\.jpe?g$/i.test(file.name) || file.type !== 'image/jpeg') return 'Title photo must be a .jpg file';
    if (file.size > MAX_PHOTO_BYTES) return 'Title photo must be 2 MB or smaller';
    if (file.size === 0 || !(await looksLikeJpeg(file))) return 'Title photo must be a valid .jpg file';
    return '';
};
function BlogForm({target, source, onDone}) {
    const router = useRouter();
    const isEdit = !!target;
    const [loading, setLoading] = useState(isEdit);
    const [loadFailed, setLoadFailed] = useState(false);
    const [saving, setSaving] = useState(false);
    const [fields, setFields] = useState({
        title: '', header: '', category: target ? target.category : '', author: '', name: '',
        startDateTime: nowInputValue(), endDateTime: nowInputValue()
    });
    const [markdown, setMarkdown] = useState('');
    const [nameTouched, setNameTouched] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [fieldErrors, setFieldErrors] = useState([]);
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [photoError, setPhotoError] = useState('');
    const [uploadedFor, setUploadedFor] = useState('');
    const [uploading, setUploading] = useState(false);
    const dirtyRef = useRef(false);
    dirtyRef.current = dirty;
    // Load the record and markdown for edit
    useEffect(() => {
        if (!target) return;
        let cancelled = false;
        const onLoad = async () => {
            try {
                const res = await adminGet('blogForEdit',
                    '/blogForEdit/' + encodeURIComponent(target.category) + '/' + encodeURIComponent(target.name));
                const data = await res.body.json();
                if (cancelled) return;
                const blog = data.blog;
                setFields({
                    title: blog.title || '', header: blog.header || '', category: blog.category,
                    author: blog.author || '', name: blog.name,
                    startDateTime: blog.startDateTime, endDateTime: blog.endDateTime || blog.startDateTime
                });
                setMarkdown(data.markdown || '');
                if (blog.titlePhoto) setPhotoPreview(MEDIA_HOST + '/images/' + blog.titlePhoto);
            } catch (e) {
                if (cancelled) return;
                setSuccess(false);
                setLoadFailed(true);
                const status = getErrorStatus(e);
                setMessage(status === 403 ? NO_ACCESS_MESSAGE
                    : status === 400 ? 'This blog can\'t be opened for editing: ' + (parseFieldErrors(e).join('; ') || 'invalid name')
                    : status === 404 ? 'This blog or its markdown document was not found'
                    : 'Unable to load the blog');
                onError(e);
            }
            if (!cancelled) setLoading(false);
        };
        onLoad();
        return () => { cancelled = true; };
    }, [target]);
    // Warn before leaving with unsaved changes (tab close/reload and in-app navigation)
    useEffect(() => {
        const onBeforeUnload = (event) => {
            if (!dirtyRef.current) return;
            event.preventDefault();
            event.returnValue = '';
        };
        const onRouteChange = () => {
            if (dirtyRef.current && !window.confirm(UNSAVED_MESSAGE)) {
                router.events.emit('routeChangeError');
                throw 'Route change aborted: unsaved changes';
            }
        };
        window.addEventListener('beforeunload', onBeforeUnload);
        router.events.on('routeChangeStart', onRouteChange);
        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
            router.events.off('routeChangeStart', onRouteChange);
        };
    }, [router]);
    // Release the object URL of a picked photo
    useEffect(() => () => {
        if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    }, [photoPreview]);
    const change = (patch) => {
        setFields((current) => ({...current, ...patch}));
        setDirty(true);
        setSuccess(false);
        setMessage('');
    };
    const handleTitleChange = (event) => {
        const title = event.target.value;
        // On create the slug follows the title until the user edits it
        change(isEdit || nameTouched ? {title} : {title, name: slugify(title)});
    };
    const handleNameChange = (event) => {
        setNameTouched(true);
        change({name: event.target.value.toLowerCase()});
    };
    const handleFieldChange = (event) => change({[event.target.name]: event.target.value});
    const handleMarkdownChange = (event) => {
        setMarkdown(event.target.value);
        setDirty(true);
        setSuccess(false);
        setMessage('');
    };
    const slugValid = SLUG_PATTERN.test(fields.name) && fields.name.length <= MAX_SLUG_LENGTH;
    const canUploadPhoto = BLOG_CATEGORIES.includes(fields.category) && slugValid;
    const errorFor = (field) => fieldErrors.filter((item) => item.startsWith(field + ' ')).join('; ');
    const showError = (e) => {
        const status = getErrorStatus(e);
        setSuccess(false);
        setFieldErrors([]);
        if (status === 400) {
            const errors = parseFieldErrors(e);
            setFieldErrors(errors);
            setMessage(errors.length > 0 ? 'Please correct the following:' : 'The blog is not valid');
        } else if (status === 409) {
            setMessage('A blog with this name already exists');
        } else if (status === 403) {
            setMessage(NO_ACCESS_MESSAGE);
        } else {
            setMessage('Something went wrong. Please try again');
            onError(e);
        }
    };
    const uploadPhoto = async (file) => {
        const res = await adminPost('blogTitlePhotoUploadUrl', '/blogTitlePhotoUploadUrl', {
            category: fields.category, name: fields.name, size: file.size
        });
        const upload = await res.body.json();
        const put = await fetch(upload.url, {
            method: 'PUT',
            headers: upload.headers || {'Content-Type': 'image/jpeg'},
            body: file
        });
        if (!put.ok) throw new Error('Title photo upload failed (' + put.status + ')');
        setUploadedFor(photoKey(fields.category, fields.name));
    };
    const handlePhotoChange = async (event) => {
        const file = event.target.files && event.target.files[0];
        event.target.value = '';
        if (!file) return;
        setPhotoError('');
        const problem = await validatePhoto(file);
        if (problem) {
            setPhotoError(problem);
            return;
        }
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
        setDirty(true);
        setSuccess(false);
        setMessage('');
        setUploading(true);
        try {
            await uploadPhoto(file);
        } catch (e) {
            // Save retries the upload
            setUploadedFor('');
            if (getErrorStatus(e) === 403) setPhotoError(NO_ACCESS_MESSAGE);
            else setPhotoError('Title photo upload failed. It will be retried when you save');
            onError(e);
        }
        setUploading(false);
    };
    const validateForm = () => {
        return fields.title.trim() !== '' && fields.author.trim() !== '' && BLOG_CATEGORIES.includes(fields.category)
            && slugValid && fields.startDateTime !== '' && fields.endDateTime !== '' && markdown.trim() !== ''
            && Date.parse(fields.endDateTime) >= Date.parse(fields.startDateTime);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setMessage('');
        setFieldErrors([]);
        try {
            // A new or renamed blog needs its photo at the new key
            if (photoFile && uploadedFor !== photoKey(fields.category, fields.name)) {
                await uploadPhoto(photoFile);
            }
            await adminPost('createOrUpdateBlog', '/createOrUpdateBlog', {
                mode: isEdit ? 'update' : 'create',
                name: fields.name,
                title: fields.title.trim(),
                header: fields.header,
                category: fields.category,
                author: fields.author.trim(),
                startDateTime: toApiValue(fields.startDateTime),
                endDateTime: toApiValue(fields.endDateTime),
                content: markdown
            });
            setDirty(false);
            dirtyRef.current = false;
            setSuccess(true);
            setMessage('Saved. The site will update in a few minutes');
        } catch (e) {
            showError(e);
        }
        setSaving(false);
    };
    const handleBack = () => {
        if (dirty && !window.confirm(UNSAVED_MESSAGE)) return;
        dirtyRef.current = false;
        onDone();
    };
    // A blog that failed to load shows only the reason: a blank form could overwrite it on save
    if (loading || loadFailed) {
        return (<>
            {loading && <Loader loading={loading} />}
            {message && (<>
                <div className="blogformmessage error">{message}</div>
                <div className="galleryfieldcontainer">
                    <label className="gallerylink"><div onClick={onDone}>Search/Edit Blog</div></label>
                </div>
            </>)}
        </>);
    }
    const path = (fields.category + '/' + fields.name).toLowerCase();
    return (
        <form name="BlogForm" className="blogform" onSubmit={handleSubmit}>
            <div className="galleryfieldcontainer">
                <label className="gallerylink"><div onClick={handleBack}>Search/Edit Blog</div></label>
            </div>
            <div className="galleryfieldcontainer">
                <TypeInput id="title" name="title" label="Title" type="text" maxLength={500}
                           value={fields.title} initialValue={fields.title} note={errorFor('title')}
                           onChange={handleTitleChange} />
            </div>
            <div className="galleryfieldcontainer">
                <TypeInput id="name" name="name" label="Name (URL slug)" type="text" maxLength={MAX_SLUG_LENGTH}
                           value={fields.name} initialValue={fields.name} disabled={isEdit}
                           note={errorFor('name') || (isEdit ? 'cannot be changed' : (fields.name && !slugValid ? 'lower case letters, numbers and hyphens only' : ''))}
                           onChange={handleNameChange} />
            </div>
            <div className="galleryfieldcontainer">
                <TextArea id="header" name="header" label="Header" rows={2} required={false} maxLength={2000}
                          value={fields.header} note={errorFor('header')} onChange={handleFieldChange} />
            </div>
            <div className="galleryfieldcontainer">
                <Select id="category" name="category" label="Category" value={fields.category}
                        disabled={isEdit} required={true} note={errorFor('category')}
                        defaultOption={{sequence: 0, value: '', label: 'Select a category'}}
                        options={BLOG_CATEGORIES.map((item, index) => ({sequence: index + 1, value: item, label: item}))}
                        onChange={handleFieldChange} />
            </div>
            <div className="galleryfieldcontainer">
                <TypeInput id="author" name="author" label="Author" type="text" maxLength={500}
                           value={fields.author} initialValue={fields.author} note={errorFor('author')}
                           onChange={handleFieldChange} />
            </div>
            <div className="galleryfieldcontainer">
                <TypeInput id="startDateTime" name="startDateTime" label="Start Date/Time" type="datetime-local"
                           value={toInputValue(fields.startDateTime)} initialValue={toInputValue(fields.startDateTime)}
                           disabled={isEdit} note={errorFor('startDateTime') || (isEdit ? 'cannot be changed' : '')}
                           onChange={handleFieldChange} />
            </div>
            <div className="galleryfieldcontainer">
                <TypeInput id="endDateTime" name="endDateTime" label="End Date/Time" type="datetime-local"
                           value={toInputValue(fields.endDateTime)} initialValue={toInputValue(fields.endDateTime)}
                           min={toInputValue(fields.startDateTime)} note={errorFor('endDateTime')}
                           onChange={handleFieldChange} />
            </div>
            <div className="galleryfieldcontainer">
                <p className="type">
                    <label>Title Photo</label>
                    <label className="inputnote">{'(.jpg, 2 MB maximum' + (canUploadPhoto ? '' : '; set category and a valid name first') + ')'}</label>
                    <input type="file" id="titlePhoto" name="titlePhoto" accept=".jpg,.jpeg,image/jpeg"
                           disabled={!canUploadPhoto || uploading} onChange={handlePhotoChange} />
                </p>
                {uploading && <div className="blogformnote">Uploading...</div>}
                {photoError && <div className="blogformmessage error">{photoError}</div>}
                {photoPreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="blogformphoto" src={photoPreview} alt="Title photo preview" />
                )}
            </div>
            <div className="galleryfieldcontainer">
                <div className="blogeditor">
                    <div className="blogeditorinput">
                        <TextArea id="content" name="content" label="Markdown" rows={24} cols={60}
                                  value={markdown} note={errorFor('content')} onChange={handleMarkdownChange} />
                    </div>
                    <div className="blogeditorpreview">
                        <label>Preview</label>
                        <div className="articleframe">
                            <div className="articlecontainer">
                                <Markdown data={{images: []}} text={markdown} source={source} path={path} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="galleryfieldcontainer" style={{textAlign: 'center'}}>
                <label style={{fontSize: '1rem', color: success ? 'green' : 'red', fontWeight: 'bold'}}>{message}</label>
                {fieldErrors.length > 0 && (
                    <ul className="blogformerrors">
                        {fieldErrors.map((item, index) => (<li key={index}>{item}</li>))}
                    </ul>
                )}
            </div>
            <div className="registrationbuttoncontainer">
                <LoaderButton name="SaveBlogButton" type="submit" label="Save"
                              disabled={!validateForm() || uploading}
                              isLoading={saving} />
            </div>
        </form>
    );
}
export default BlogForm;
