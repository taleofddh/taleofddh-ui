import React, { useState } from "react";
import { Auth } from "aws-amplify";
import LoaderButton from "./loaderbutton";

function GoogleButton({onLogin, route}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            const response = await Auth.federatedSignIn(
                {provider: "Google", customState: JSON.stringify(route)}
            );
            setIsLoading(false);
            onLogin(response);
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