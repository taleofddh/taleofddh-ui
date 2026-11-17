import {MEDIA_HOST} from "./constants";
import {toSlug} from "./slug";

// Public, unsigned image under <MEDIA_HOST>/images/. Every segment is slugged, so names can be passed as
// they are displayed: publicImageUrl('gallery', 'Vacations', 'Europe') -> .../images/gallery/vacations/europe.jpg
// Use it for any content type (gallery covers, blog images) whose files follow the slug-path convention.
export const publicImageUrl = (...segments) =>
    MEDIA_HOST + '/images/' + segments.map(toSlug).join('/') + '.jpg';
