import React, { useState } from "react";
import { signInWithRedirect } from "aws-amplify/auth";
import LoaderButton from "./loader-button";

function GoogleButton({route}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            const response = await signInWithRedirect({
                provider: "Google",
                customState: JSON.stringify(route)
            });
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }
    }

    return (
        <LoaderButton
            bsSize="large"
            bsStyle="primary"
            name="GoogleButton"
            className="google"
            label="Login with Google"
            disabled={isLoading}
            icon="google"
            onClick={handleClick} />
    );
}

export default GoogleButton;