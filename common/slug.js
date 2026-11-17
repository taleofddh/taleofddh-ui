// URL form of a display name: "Relaxation & Wellness" -> "relaxation-and-wellness".
// Same rule the page routes, getStaticPaths and the API use.
export const toSlug = (value) => String(value).replace(/&/g, 'and').replace(/ /g, '-').toLowerCase();
