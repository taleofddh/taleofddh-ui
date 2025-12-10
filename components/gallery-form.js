import React, {useState} from 'react';
import {get, post} from 'aws-amplify/api';
import {fetchAuthSession} from "aws-amplify/auth";
import {
    dateFormatToString,
    dateFormatWithLongMonthToString,
    dateTimeFullFormatToString,
    formatMoney
} from "../common/common";
import {onError} from "../common/error";
import AutocompleteInput from "./autocomplete-input";
import { getSampleDataByField } from "../common/sample-data";
import LoaderButton from "./loader-button";
import {useFormFields} from "../common/hook";


function GalleryForm() {
    const initialResult = {};
    const [isLoading, setIsLoading] = useState(false);

    const [fields, handleFieldChange] = useFormFields({
        category : '',
        subCategory: '',
        collection: '',
        name: '',
        startDateTime : dateTimeFullFormatToString(new Date()),
        endDateTime: dateTimeFullFormatToString(new Date()),
        restrictedFlag: false,
        defaultFlag: false,
        titlePhoto: '',
        photoCount: 0,
        description: '',
        viewCount: 0,
        production: false
    });

    // Suggestion selection handlers
    const handleCategorySuggestionSelect = (suggestion) => {
        console.log('Category selected:', suggestion);
    };

    const handleSubcategorySuggestionSelect = (suggestion) => {
        console.log('Subcategory selected:', suggestion);
    };

    const handleCollectionSuggestionSelect = (suggestion) => {
        console.log('Collection selected:', suggestion);
    };

    const handleNameSuggestionSelect = (suggestion) => {
        console.log('Name selected:', suggestion);
    };

    const submitGalleryForm = async (submitEvent) => {
        submitEvent.preventDefault();
    }

    const validateForm = () => {
        let valid;
        valid = false
        return valid;
    }

    return (
        <>
            <form key="EnquiryForm" name="EnquiryForm" onSubmit={submitGalleryForm}>
                <div className="enquirycontainer">
                    {/* Autocomplete form for gallery management testing */}
                    <div className="enquiryfieldcontainer">
                        {/* Category autocomplete field */}
                        <AutocompleteInput
                                id="category"
                                name="category"
                                label="Category"
                                placeHolder="Type to search categories..."
                                value={fields.category}
                                onChange={handleFieldChange}
                                onSuggestionSelect={handleCategorySuggestionSelect}
                                suggestions={getSampleDataByField('category')}
                                required={true}
                                className="gallery-field"
                                note=""
                        />
                    </div>
                    <div className="enquiryfieldcontainer">
                        {/* Subcategory autocomplete field */}
                        <AutocompleteInput
                                id="subCategory"
                                name="subCategory"
                                label="Sub Category"
                                placeHolder="Type to search subcategories..."
                                value={fields.subCategory}
                                onChange={handleFieldChange}
                                onSuggestionSelect={handleSubcategorySuggestionSelect}
                                suggestions={getSampleDataByField('subcategory')}
                                required={true}
                                className="gallery-field"
                                note=""
                        />
                    </div>
                    <div className="enquiryfieldcontainer">
                        {/* Collection autocomplete field */}
                        <AutocompleteInput
                                id="collection"
                                name="collection"
                                label="Collection"
                                placeHolder="Type to search collections..."
                                value={fields.collection}
                                onChange={handleFieldChange}
                                onSuggestionSelect={handleCollectionSuggestionSelect}
                                suggestions={getSampleDataByField('collection')}
                                required={true}
                                className="gallery-field"
                                note=""
                        />
                    </div>
                    <div className="enquiryfieldcontainer">
                        {/* Name autocomplete field */}
                        <AutocompleteInput
                                id="name"
                                name="name"
                                label="Name"
                                placeHolder="Type to search names..."
                                value={fields.name}
                                onChange={handleFieldChange}
                                onSuggestionSelect={handleNameSuggestionSelect}
                                suggestions={getSampleDataByField('name')}
                                required={true}
                                className="gallery-field"
                                note=""
                        />
                    </div>
                    <div className="enquiryfieldcontainer">
                         Display current values for testing
                        <div className="current-values">
                            <h4>Current Values:</h4>
                            <p><strong>Category:</strong> {fields.category || 'None selected'}</p>
                            <p><strong>Sub Category:</strong> {fields.subCategory || 'None selected'}</p>
                            <p><strong>Collection:</strong> {fields.collection || 'None selected'}</p>
                            <p><strong>Name:</strong> {fields.name || 'None selected'}</p>
                        </div>
                    </div>
                    <div className="enquirybuttoncontainer">
                        <LoaderButton name="SubmitGalleryButton"
                                      type="submit"
                                      label="Confirm Gallery"
                                      disabled={!validateForm()}
                                      isLoading={isLoading} />
                    </div>
                </div>
            </form>
        </>
    )
}

export default GalleryForm;


