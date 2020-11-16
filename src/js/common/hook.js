import { useState, useEffect, useRef } from "react";
import {SessionContext, getSessionCookie, setSessionCookie, getSessionStorage, setSessionStorage} from "./session";

export const useApi = (hostname, protocol, key) => {
    let url;
    let index = true;
    let obj = getSessionStorage(key);
    if(Object.keys(obj).length === 0 && obj.constructor === Object) {
        /*if(hostname === 'taleofddh.com' || hostname === 'localhost') {
            url = 'https//'  + 'api.taleofddh.com';
        } else {
            url = protocol + '//'  + hostname;
            index = false;
        }*/
        url = 'https://api.taleofddh.com';
        if(key) {
            setSessionStorage(key, {api: url});
        }
    } else {
        if(hostname === 'localhost' || hostname === 'dev.taleofddh.com' || hostname === 'uat.taleofddh.com') {
            index = false;
        }
        url = obj.api;
    }

    return [url, index];
}

export const useFetch = (url, key) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUrl();
    }, []);

    async function fetchUrl() {
        let json;
        let obj;
        if(key === 'geolocation') {
            obj = getSessionCookie(key)
        } else {
            obj = getSessionStorage(key);
        }
        if(Object.keys(obj).length === 0 && obj.constructor === Object) {
            const response = await fetch(url);
            json = await response.json();
            if(key) {
                if(key === 'geolocation') {
                    setSessionCookie(key, json)
                } else {
                    setSessionStorage(key, json);
                }
            }
        } else {
            json = obj;
        }
        console.log(json);
        setData(json);
        setLoading(false);
    }

    return [data, loading];
}

export const useSubscription = (url, subscription) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        postConnection();
    }, []);

    async function postConnection() {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: subscription.email,
                subscribed: subscription.subscribed
            })
        });
        const json = await response.json();
        console.log(json);
        setData(json);
        setLoading(false);
    }

    return [data, loading];
}

export const useRequest = (url, request) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        postRequest();
    }, []);

    async function postRequest() {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: request.type,
                requestor: request.requestor,
                email: request.email,
                phone: request.phone,
                enquiry: request.enquiry
            })
        });
        const json = await response.json();
        console.log(json);
        setData(json);
        setLoading(false);
    }

    return [data, loading];
}

export const useMediaQuery = (query) => {
    const mediaMatch = window.matchMedia(query);
    const [matches, setMatches] = useState(mediaMatch.matches);

    useEffect(() => {
        const handler = (e) => setMatches(e.matches);
        mediaMatch.addEventListener('change', handler);
        return () => mediaMatch.removeEventListener('change', handler);
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
