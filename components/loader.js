import React from 'react';
import ClipLoader from "react-spinners/ClipLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const style = {
    display: "inline-block",
    margin: "0, auto",
    borderColor: "rgb(192, 159, 128)"
};

function Loader({loading}) {
    return (
        <div className="centerloading">
            <ClipLoader
                cssOverride={style}
                size={80}
                color={"#76323F"}
                loading={loading}
            />
        </div>
    )
}

export default Loader;