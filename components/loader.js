import React from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const style = css`
  display: inline-block;  
  border-color: rgb(192, 159, 128);
`;

function Loader({loading}) {
    return (
        <div className="centerloading">
            <ClipLoader
                css={style}
                size={80}
                color={"#76323F"}
                loading={loading}
            />
        </div>
    )
}

export default Loader;