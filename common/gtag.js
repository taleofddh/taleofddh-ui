import {GTAG_MEASUREMENT_ID} from "./constants";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('config', GTAG_MEASUREMENT_ID, {
            page_location: url,
        });
    }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
}