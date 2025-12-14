import React, {useState} from 'react';
import {get, post} from 'aws-amplify/api';
import {fetchAuthSession} from "aws-amplify/auth";
import {
    dateFormatToString
} from "../common/common";
import {onError} from "../common/error";
import AutocompleteInput from "./autocomplete-input";
import LoaderButton from "./loader-button";
import {useFormFields} from "../common/hook";
import CheckBox from "./checkbox";
import TypeInput from "./type-input";
import TextArea from "./textarea";
import * as array from '@taleofddh/array';

function GalleryForm({data, source}) {
    const initialResult = {};
    const [isLoading, setIsLoading] = useState(false);
    const [isGalleryLoading, setIsGalleryLoading] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [result, setResult] = useState(initialResult);
    const [galleryId, setGalleryId] = useState('');
    const [searchEditAlbum, setSearchEditAlbum] = useState(false);
    //console.log(data);

    const initialFields = {
        id: '',
        category : '',
        subCategory: '',
        collection: '',
        name: '',
        startDateTime : dateFormatToString(new Date()),
        endDateTime: dateFormatToString(new Date()),
        restrictedFlag: false,
        defaultFlag: false,
        titlePhoto: '',
        photoCount: '0',
        description: '',
        viewCount: '0',
        production: false
    }
    const [fields, setFields] = useState(initialFields);

    const [searchFields, handleSearchFieldChange] = useFormFields({
        name: '',
        startDateTime: dateFormatToString(new Date())
    });

    const getSuggestedData = (key) => {
        return array.distinctValues(data, key);
    }

    const clearResult = () => {
        setResult({...initialResult});
    }

    const toggleSearchEditAlbum = () => {
        setSearchEditAlbum(!searchEditAlbum);
        setFields({
            ...fields,
            ...initialFields
        });
    }

    // Suggestion selection handlers
    const handleCategorySuggestionSelect = (suggestion) => {
        //console.log('Category selected:', suggestion);
    };

    const handleSubcategorySuggestionSelect = (suggestion) => {
        //console.log('Subcategory selected:', suggestion);
    };

    const handleCollectionSuggestionSelect = (suggestion) => {
        //console.log('Collection selected:', suggestion);
    };

    const handleNameSuggestionSelect = (suggestion) => {
        //console.log('Name selected:', suggestion);
    };

    const handleFieldChange = (event) => {
        setFields({
            ...fields,
            [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
        });
    }

    const validateGalleryForm = () => {
        let valid = false
        const nameRegex = RegExp('^[A-Za-z0-9 \.)(/\&\\-\']{1,50}$');
        const dateRegex = RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
        const number1Regex = RegExp('^[0-9]{1,2}$');
        const number2Regex = RegExp('^[0-9]$');
        const descriptionRegex = RegExp('^.{1,300}$')

        for (const key in fields) {
            valid = false;
            //console.log(key + ': ' + fields[key]);
            if ((key === 'category' || key === 'subCategory' || key === 'collection' || key === 'name' || key === 'titlePhoto')
                    && (fields[key].length === 0 || fields[key].match(nameRegex) === null)) {
                break;
            }
            if (key === 'description' && (fields[key].length === 0 || fields[key].match(descriptionRegex) === null)) {
                break;
            }
            if ((key === 'startDateTime' || key === 'endDateTime') && (fields[key].length === 0 || fields[key].match(dateRegex) === null)) {
                break;
            }
            if (key === 'photoCount' && (parseInt(fields[key]) <= 0 || fields[key].match(number1Regex) === null)) {
                break;
            }
            if (key === 'viewCount' && (parseInt(fields[key]) < 0 || fields[key].match(number2Regex) === null)) {
                break;
            }
            valid = true;
        }
        return valid;
    }

    const validateSearchForm = () => {
        let valid = false
        const nameRegex = RegExp('^[A-Za-z0-9 \.)(/\&\\-\']{1,50}$');
        const dateRegex = RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');

        for (const key in searchFields) {
            valid = false;
            //console.log(key + ': ' + searchFields[key]);
            if (key === 'name' && (searchFields[key].length === 0 || searchFields[key].match(nameRegex) === null)) {
                console.log('name regex failed');
                console.log(searchFields[key], searchFields[key].match(nameRegex));
                break;
            }
            if (key === 'startDateTime' && (searchFields[key].length === 0 || searchFields[key].match(dateRegex) === null)) {
                break;
            }
            valid = true;
        }
        return valid;
    }

    const submitSearchForm = async (searchEvent) => {
        searchEvent.preventDefault();
        setMessage('');
        setIsGalleryLoading(true);

        try {
            const {tokens} = await fetchAuthSession({forceRefresh: true});
            let res = {};
            if(tokens) {
                res = await get({
                    apiName: "findAlbum",
                    path: "/album/" + encodeURI(searchFields.name) + '/' + encodeURI(searchFields.startDateTime + 'T00:00:00'),
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    }
                }).response;
            }

            const galleryFound = await res.body.json();
            console.log(galleryFound);

            if (galleryFound && Object.keys(galleryFound).length !== 0) {
                setFields({
                    ...fields,
                    id: galleryFound.id,
                    category: galleryFound.category,
                    subCategory: galleryFound.subCategory,
                    collection: galleryFound.collection,
                    name: galleryFound.name,
                    startDateTime: dateFormatToString(new Date(galleryFound.startDateTime)),
                    endDateTime: dateFormatToString(new Date(galleryFound.endDateTime)),
                    restrictedFlag: galleryFound.restrictedFlag,
                    defaultFlag: galleryFound.defaultFlag,
                    titlePhoto: galleryFound.titlePhoto,
                    photoCount: galleryFound.photoCount + '',
                    description: galleryFound.description,
                    viewCount: galleryFound.viewCount + '',
                    production: galleryFound.production
                })
                //setGalleryId(galleryFound.id);
                setMessage('');
                setSuccess(true);
            } else {
                setMessage('No gallery found with the matching criteria entered');
                setSuccess(false);
            }

            setIsGalleryLoading(false);
        } catch (error) {
            if (error !== 'No current user') {
                setMessage('No gallery found with the matching criteria entered');
                setSuccess(false);
            }
            onError(error);
            setIsGalleryLoading(false);
        }
    }

    const submitGalleryForm = async (submitEvent) => {
        submitEvent.preventDefault();

        const gallery = {
            id: fields.id,
            category: fields.category,
            subCategory: fields.subCategory,
            name: fields.name,
            description: fields.description,
            titlePhoto: fields.titlePhoto,
            startDateTime: fields.startDateTime + 'T00:00:00',
            endDateTime: fields.endDateTime + 'T23:59:59',
            collection: fields.collection,
            restrictedFlag: fields.restrictedFlag,
            defaultFlag: fields.defaultFlag,
            viewCount: fields.viewCount,
            photoCount: fields.photoCount,
            production: fields.production
        }

        console.log(gallery);

        try {
            clearResult();
            setMessage('Submitting your gallery for ' + fields.name);
            setSuccess(false);
            const {tokens} = await fetchAuthSession({forceRefresh: true});
            let response = {};
            if(tokens) {
                response = await post({
                    apiName: "createOrUpdateAlbum",
                    path: "/createOrUpdateAlbum",
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: gallery
                    }
                }).response;
            }
            console.log(response);
            const gallerySubmitted = await response.body.json();
            setGalleryId(gallerySubmitted.id);
            setResult(result => Object.assign(result, gallerySubmitted));
            setMessage('Your gallery for ' + gallerySubmitted.name + ' has been successfully submitted with reference ' + gallerySubmitted.id + '.');
            setSuccess(true);
            setIsLoading(false);
        } catch (error) {
            if (error !== 'No current user') {
                setMessage('Your gallery for ' + fields.name + ' has not been successfully submitted');
                setSuccess(false);
            }
            onError(error);
            setIsLoading(false);
        }
    }

    return (
        <>
            {galleryId === '' ? (
                <div className="gallerycontainer">
                    <div className="galleryfieldcontainer">
                        <label className="gallerylink">
                            <div
                                onClick={toggleSearchEditAlbum}>{searchEditAlbum ? 'New Album' : 'Search/Edit Album'}
                            </div>
                        </label>
                    </div>
                    {(searchEditAlbum && fields.id === '') ? (
                        <>
                            <form key="SearchGalleryForm" name="SearchGalleryForm"
                                  onSubmit={submitSearchForm}>
                                <div className="galleryfieldcontainer">
                                    {/* Name autocomplete field */}
                                    <AutocompleteInput
                                            id="name"
                                            name="name"
                                            label="Name"
                                            placeHolder="Type to search names..."
                                            value={searchFields.name}
                                            onChange={handleSearchFieldChange}
                                            onSuggestionSelect={handleNameSuggestionSelect}
                                            suggestions={getSuggestedData('name')}
                                            disabled={false}
                                            required={true}
                                            className="gallery-field"
                                            note=""
                                    />
                                </div>
                                <div key={2} className="galleryfieldcontainer">
                                    <TypeInput id="startDateTime"
                                               name="startDateTime"
                                               label="Start Date/Time"
                                               type="date"
                                               disabled={false}
                                               required={true}
                                               initialValue={searchFields.startDateTime}
                                               value={searchFields.startDateTime}
                                               note=""
                                               onChange={handleSearchFieldChange}/>
                                </div>
                                <div className="galleryfieldcontainer" style={{textAlign: "center"}}>
                                    <label style={{
                                        fontSize: '1rem',
                                        color: success ? 'green' : 'red',
                                        fontWeight: 'bold'
                                    }}>{message}</label>
                                </div>
                                <div className="registrationbuttoncontainer">
                                    <LoaderButton name="SearchGalleryButton"
                                                  type="submit"
                                                  label="Search"
                                                  disabled={!validateSearchForm()}
                                                  isLoading={isGalleryLoading}/>
                                </div>
                            </form>
                        </>
                    ) : (
                        <></>
                    )}
                    {!searchEditAlbum || (searchEditAlbum && fields.id !== '') ? (
                        <>
                            <form key="GalleryForm" name="GalleryForm" onSubmit={submitGalleryForm}>
                                {/* Autocomplete form for gallery management */}
                                <div className="galleryfieldcontainer">
                                    {/* Category autocomplete field */}
                                    <AutocompleteInput
                                            id="category"
                                            name="category"
                                            label="Category"
                                            placeHolder="Type to search categories..."
                                            value={fields.category}
                                            onChange={handleFieldChange}
                                            onSuggestionSelect={handleCategorySuggestionSelect}
                                            suggestions={getSuggestedData('category')}
                                            disabled={false}
                                            required={true}
                                            className="gallery-field"
                                            note=""
                                    />
                                </div>
                                <div className="galleryfieldcontainer">
                                    {/* Subcategory autocomplete field */}
                                    <AutocompleteInput
                                            id="subCategory"
                                            name="subCategory"
                                            label="Sub Category"
                                            placeHolder="Type to search subcategories..."
                                            value={fields.subCategory}
                                            onChange={handleFieldChange}
                                            onSuggestionSelect={handleSubcategorySuggestionSelect}
                                            suggestions={getSuggestedData('subCategory')}
                                            disabled={false}
                                            required={true}
                                            className="gallery-field"
                                            note=""
                                    />
                                </div>
                                <div className="galleryfieldcontainer">
                                    {/* Collection autocomplete field */}
                                    <AutocompleteInput
                                            id="collection"
                                            name="collection"
                                            label="Collection"
                                            placeHolder="Type to search collections..."
                                            value={fields.collection}
                                            onChange={handleFieldChange}
                                            onSuggestionSelect={handleCollectionSuggestionSelect}
                                            suggestions={getSuggestedData('collection')}
                                            disabled={false}
                                            required={true}
                                            className="gallery-field"
                                            note=""
                                    />
                                </div>
                                <div key={1} className="galleryfieldcontainer">
                                    <TypeInput id="name"
                                               name="name"
                                               label="Name"
                                               type="text"
                                               disabled={false}
                                               required={true}
                                               maxLength={50}
                                               initialValue={fields.name}
                                               value={fields.name}
                                               placeHolder="eg New York City"
                                               note=""
                                               onChange={handleFieldChange}/>
                                </div>
                                <div className="galleryfieldcontainer">
                                    <CheckBox id="restrictedFlag"
                                              name="restrictedFlag"
                                              label="Is this Gallery Restricted?"
                                              value={fields.restrictedFlag}
                                              disabled={false}
                                              required={false}
                                              initialState={fields.restrictedFlag}
                                              onChange={handleFieldChange} />
                                </div>
                                <div className="galleryfieldcontainer">
                                    <CheckBox id="defaultFlag"
                                              name="defaultFlag"
                                              label="Default for Home Page?"
                                              value={fields.defaultFlag}
                                              disabled={false}
                                              required={false}
                                              initialState={fields.defaultFlag}
                                              onChange={handleFieldChange} />
                                </div>
                                <div className="galleryfieldcontainer">
                                    <TypeInput id="startDateTime"
                                               name="startDateTime"
                                               label="Start Date/Time"
                                               type="date"
                                               disabled={false}
                                               required={true}
                                               initialValue={fields.startDateTime}
                                               value={fields.startDateTime}
                                               placeHolder="Start Date/Time"
                                               onChange={handleFieldChange} />
                                </div>
                                <div className="galleryfieldcontainer">
                                    <TypeInput id="endDateTime"
                                               name="endDateTime"
                                               label="End Date/Time"
                                               type="date"
                                               disabled={false}
                                               required={true}
                                               initialValue={fields.endDateTime}
                                               value={fields.endDateTime}
                                               placeHolder="End Date/Time"
                                               onChange={handleFieldChange} />
                                </div>
                                <div className="galleryfieldcontainer">
                                    <TextArea id="description"
                                              name="description"
                                              label="Description"
                                              disabled={false}
                                              required={true}
                                              initialValue={fields.description}
                                              value={fields.description}
                                              placeHolder="Description of the gallery."
                                              onChange={handleFieldChange} />
                                </div>
                                <div className="galleryfieldcontainer">
                                    <TypeInput id="titlePhoto"
                                               name="titlePhoto"
                                               label="Title Photo"
                                               type="text"
                                               disabled={false}
                                               required={true}
                                               maxLength={20}
                                               initialValue={fields.titlePhoto}
                                               value={fields.titlePhoto}
                                               placeHolder="e.g. photo.jpg"
                                               onChange={handleFieldChange} />
                                </div>
                                <div className="galleryfieldcontainer">
                                    <TypeInput id="viewCount"
                                               name="viewCount"
                                               label="View Count"
                                               type="number"
                                               inputMode="numeric"
                                               disabled={false}
                                               required={true}
                                               min={0}
                                               maxLength={2}
                                               initialValue={fields.viewCount+''}
                                               value={fields.viewCount+''}
                                               placeHolder="Only numbers"
                                               onChange={handleFieldChange} />
                                </div>
                                <div className="galleryfieldcontainer">
                                    <TypeInput id="photoCount"
                                               name="photoCount"
                                               label="Photo Count"
                                               type="number"
                                               inputMode="numeric"
                                               disabled={false}
                                               required={true}
                                               min={0}
                                               max={99}
                                               maxLength={2}
                                               initialValue={fields.photoCount+''}
                                               value={fields.photoCount+''}
                                               placeHolder="Only numbers 0-99"
                                               onChange={handleFieldChange} />
                                </div>
                                <div className="galleryfieldcontainer">
                                    <CheckBox id="production"
                                              name="production"
                                              label="Ready for Production?"
                                              value={fields.production}
                                              disabled={false}
                                              required={false}
                                              initialState={fields.production}
                                              onChange={handleFieldChange} />
                                </div>
                                <div className="gallerybuttoncontainer">
                                    <LoaderButton name="SubmitGalleryButton"
                                                  type="submit"
                                                  label="Save Gallery"
                                                  disabled={!validateGalleryForm()}
                                                  isLoading={isLoading} />
                                </div>
                            </form>
                        </>
                    ) : (
                            <></>
                    ) }
                </div>
            ) : (
                <div className="acknowledgementcontainer">
                    <label className="acknowledgement" style={{fontSize: '1rem', color: success ? 'rgb(97, 137, 47)' : 'rgb(255, 0, 0)', fontWeight: 'normal'}}>
                        <p>
                            {'Thanks for submitting the gallery details. Please note your gallery id # ' + galleryId + '.'}
                        </p>
                    </label>
                </div>
            )}
        </>
    )
}

export default GalleryForm;


