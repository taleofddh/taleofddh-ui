import { useState, useEffect, useRef } from "react";
import {INDEX_FLAG} from "./constants";

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
