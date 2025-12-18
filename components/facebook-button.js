import React, {useState} from "react";
import { signInWithRedirect } from "aws-amplify/auth";
import LoaderButton from "./loader-button";

function FacebookButton({route}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            const response = await signInWithRedirect({
                provider: "Facebook",
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
            name="FacebookButton"
            className="facebook"
            label="Login with Facebook"
            disabled={isLoading}
            icon="facebook-f"
            onClick={handleClick} />
    );
}

export default FacebookButton;