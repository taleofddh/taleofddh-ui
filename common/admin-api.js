import {get, post, put, del} from 'aws-amplify/api';
import {fetchAuthSession} from 'aws-amplify/auth';

const METHODS = {get, post, put, del};

export const getErrorStatus = (error) => {
    return error?.response?.statusCode ?? error?.$metadata?.httpStatusCode;
};

export const isForbidden = (error) => getErrorStatus(error) === 403;

const getIdToken = async (forceRefresh = false) => {
    const {tokens} = await fetchAuthSession({forceRefresh});
    if (!tokens || !tokens.idToken) {
        throw new Error('No current user');
    }
    return tokens.idToken.toString();
};

/**
 * Call an admin API with `Authorization: <idToken>`.
 * 401: refresh the session and retry once.
 * 403 (and any other error) is thrown; use isForbidden(error) to show "You don't have access".
 * Returns the Amplify response, so callers read it with `res.body.json()`.
 *
 * @param {'get'|'post'|'put'|'del'} method
 * @param {string} apiName Amplify REST API name
 * @param {string} path
 * @param {object} [body] request body for post/put
 */
export const adminRequest = async (method, apiName, path, body) => {
    const send = async (forceRefresh) => {
        const idToken = await getIdToken(forceRefresh);
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': idToken
            }
        };
        if (body !== undefined) options.body = body;
        return METHODS[method]({apiName, path, options}).response;
    };
    try {
        return await send(false);
    } catch (error) {
        if (getErrorStatus(error) === 401) {
            return await send(true);
        }
        throw error;
    }
};

export const adminGet = (apiName, path) => adminRequest('get', apiName, path);
export const adminPost = (apiName, path, body) => adminRequest('post', apiName, path, body);

// Services that expose GET /permissions (each returns the caller's permissions from its own table).
const PERMISSION_APIS = ['findGalleryPermissions', 'findAdminPermissions', 'findBlogPermissions'];

// Permissions of the signed-in user across services, e.g. ["gallery:findAlbums", "messages:*"].
// A service that fails to answer contributes nothing; the others still count.
export const fetchPermissions = async () => {
    const results = await Promise.allSettled(PERMISSION_APIS.map(async (apiName) => {
        const res = await adminGet(apiName, '/permissions');
        const data = await res.body.json();
        return Array.isArray(data?.permissions) ? data.permissions : [];
    }));
    return [...new Set(results.flatMap((result) => (result.status === 'fulfilled' ? result.value : [])))];
};
