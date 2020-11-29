import React, {useState, useEffect} from "react";
import { Auth } from "aws-amplify";
import LoaderButton from "./loaderbutton";

const waitForInit = () => {
    return new Promise((res, rej) => {
        const hasFbLoaded = () => {
            if (window.FB) {
                res();
            } else {
                setTimeout(hasFbLoaded, 300);
            }
        };
        hasFbLoaded();
    });
}

function FacebookButton(props) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(async () => {
        await waitForInit();
        setIsLoading(false)
    }, [])

    const statusChangeCallback = (response) => {
        if (response.status === "connected") {
            handleResponse(response.authResponse);
        } else {
            handleError(response);
        }
    };

    const checkLoginState = () => {
        window.FB.getLoginStatus(statusChangeCallback);
    };

    const handleClick = () => {
        window.FB.login(checkLoginState, {scope: "public_profile, email"});
    };

    const handleError = (error) => {
        alert(error);
    }

    const handleResponse = async (data) => {
        const { email, accessToken: token, expiresIn } = data;
        const expires_at = expiresIn * 1000 + new Date().getTime();
        const user = { email };

        setIsLoading(true);

        try {
            const response = await Auth.federatedSignIn(
                "facebook",
                { token, expires_at },
                user
            );
            setIsLoading(false);
            props.onLogin(response);
        } catch (e) {
            setIsLoading(false);
            handleError(e);
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