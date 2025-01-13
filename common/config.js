'use client';

import {Amplify} from "aws-amplify";
import {AMPLIFY_RESOURCE_CONFIG} from "./constants";

// Configure Amplify library for client-side usage
export const configureAmplify = () => {
    Amplify.configure(
        {...AMPLIFY_RESOURCE_CONFIG}, {
            ssr: true
        });
}