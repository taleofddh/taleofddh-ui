import React from 'react';
import Title from "./title";
import {NO_ACCESS_MESSAGE} from "../common/permissions";

function NoAccess({title}) {
    return (
        <>
            <Title message={title} />
            <div className="errormessage">
                <p>{NO_ACCESS_MESSAGE}</p>
            </div>
        </>
    )
}

export default NoAccess;
