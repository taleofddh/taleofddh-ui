import {publicImageUrl} from "../media";

// Gallery covers are public and unsigned:
//   gallery/<category>.jpg
//   gallery/<category>/<subCategory>.jpg
//   gallery/<category>/<subCategory>/<collection>.jpg
//   gallery/<category>/<subCategory>/<collection>/<album>.jpg
// Built from the names, so it can be used at build time (static HTML, og:image).
export const galleryCoverUrl = (...names) => publicImageUrl('gallery', ...names);
