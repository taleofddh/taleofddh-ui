import { useState, useEffect, useRef } from "react";
import { get } from "aws-amplify/api";
import {INDEX_FLAG} from "./constants";
import {onError} from "./error";

/**
 * Fetches API data in the browser on every page visit.
 * Used for responses that carry short-lived presigned URLs, which must not be
 * baked into build-time/static HTML because they expire.
 * Mirrors serverGet: params are URI-encoded and appended as path segments.
 *
 * @param {string} apiName  Amplify REST API name
 * @param {string} path     API path
 * @param {string[]} params optional path params
 * @param {*} initialData   value used before load and on error
 * @param {boolean} enabled when false, no request is made and loading stays true
 *                          (e.g. wait until the user is confirmed signed in)
 * @returns {{data: *, loading: boolean}}
 */
export const useClientGet = (apiName, path, params = [], initialData = [], enabled = true) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    // Stable dependency for the params array
    const paramKey = params.map((item) => encodeURI(item)).join('/');

    useEffect(() => {
        if (!enabled) return;
        let cancelled = false;
        const onLoad = async () => {
            setLoading(true);
            try {
                const { body } = await get({
                    apiName: apiName,
                    path: path + (paramKey ? '/' + paramKey : ''),
                    options: {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    }
                }).response;
                const json = await body.json();
                if (!cancelled) setData(json);
            } catch (e) {
                if (!cancelled) {
                    setData(initialData);
                    if (e !== 'No current user') onError(e);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        onLoad();
        return () => {
            cancelled = true;
        };
        // initialData intentionally excluded; it is only a fallback value
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiName, path, paramKey, enabled]);

    return { data, loading };
}

export const useIndex = (hostname, protocol, key) => {
    let index = false;
    if(INDEX_FLAG) {
        index = true;
    }
    return index;
}

export const useFormFields = (initialState) => {
    const [fields, setFields] = useState(initialState);

    return [
        fields,
        function(event) {
            setFields({
                ...fields,
                [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
            });
        }
    ];
}

export const useMediaQuery = (query) => {
    const mediaMatch = (typeof window !== 'undefined') ? window.matchMedia(query) : {matches: false};
    const [matches, setMatches] = useState(mediaMatch.matches);

    useEffect(() => {
        if(typeof window !== 'undefined') {
            let userAgent = window.navigator.userAgent;
            let msIe = userAgent.indexOf("MSIE ");
            const handler = (e) => setMatches(e.matches);
            if (msIe) {
                mediaMatch.addListener(handler)
            } else {
                mediaMatch.addEventListener('change', handler);
            }
            return () => {
                if (msIe) {
                    mediaMatch.removeListener(handler)
                } else {
                    mediaMatch.removeEventListener('change', handler);
                }
            }
        }
    });

    return matches;
};

export const useHover = () => {
    const [value, setValue] = useState(false);

    const ref = useRef(null);

    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);

    useEffect(
        () => {
            const node = ref.current;
            if (node) {
                node.addEventListener('mouseover', handleMouseOver);
                node.addEventListener('mouseout', handleMouseOut);

                return () => {
                    node.removeEventListener('mouseover', handleMouseOver);
                    node.removeEventListener('mouseout', handleMouseOut);
                };
            }
        },
        [ref.current] // Recall only if ref changes
    );

    return [ref, value];
}
