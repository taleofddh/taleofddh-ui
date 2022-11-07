import React, {useState} from "react";
import { Auth } from "aws-amplify";
import LoaderButton from "./loaderbutton";

function FacebookButton({onLogin, route}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            const response = await Auth.federatedSignIn(
                { provider: "Facebook", customState: JSON.stringify(route)}
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
            name="FacebookButton"
            className="facebook"
            label="Login with Facebook"
            disabled={isLoading}
            icon="facebook-f"
            onClick={handleClick} />
    );
}

export default FacebookButton;