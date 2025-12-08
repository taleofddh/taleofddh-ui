import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { get } from 'aws-amplify/api/server';
import {AMPLIFY_RESOURCE_CONFIG} from "./constants";

// Configure Amplify library for server-side usage
export const { runWithAmplifyServerContext  } = createServerRunner({ config: AMPLIFY_RESOURCE_CONFIG });

export const serverGet = async (apiName, path, data) => {
    const params = data ? data.map(item => { return encodeURI(item)}) : [];
    return await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: async (contextSpec) => {
            try {
                const { body } = await get(contextSpec, {
                    apiName: apiName,
                    path: path + (params ? '/' + params.join('/') : ''),
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                }).response;
                return body.json();
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    });
}
