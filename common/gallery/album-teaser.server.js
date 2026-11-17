import {serverGet} from "../server-config";
import {MONTH_NAMES} from "../constants";
import {toSlug} from "../slug";
import {galleryCoverUrl} from "./urls";

// Build-time only (getStaticProps / getStaticPaths): this file calls the API.

// One API call per collection, shared by every album page in it
const collectionCache = new Map();

const getCollectionAlbums = (category, subCategory, collection) => {
    const key = [category, subCategory, collection].map(toSlug).join('/');
    if (!collectionCache.has(key)) {
        collectionCache.set(key, serverGet('findAlbumHistoricalNames', '/albumHistoricalNames', [category, subCategory, collection]));
    }
    return collectionCache.get(key);
};

const cleanText = (value) => (typeof value === 'string' && value.trim() ? value.trim() : null);

/**
 * Public teaser for one album. Built from an explicit allow-list, so nothing else from the API
 * response (and no photo or video data) can reach the static HTML or JSON.
 * Dates are reduced to month and year. Returns null when the album is not in the public list.
 */
export const getAlbumTeaser = async (category, subCategory, collection, name) => {
    const albums = await getCollectionAlbums(category, subCategory, collection);
    const album = Array.isArray(albums) ? albums.find((item) => toSlug(item.name) === toSlug(name)) : null;
    if (!album) return null;
    const start = album.startDateTime ? new Date(album.startDateTime) : null;
    const validStart = start && !isNaN(start.getTime()) ? start : null;
    return {
        name: album.name,
        summary: cleanText(album.summary),
        description: cleanText(album.description),
        locationLabel: cleanText(album.locationLabel),
        coverAlt: cleanText(album.coverAlt),
        coverUrl: galleryCoverUrl(category, subCategory, collection, album.name),
        photoCount: Number.isInteger(album.photoCount) ? album.photoCount : null,
        videoCount: Number.isInteger(album.videoCount) ? album.videoCount : null,
        dateLabel: validStart ? MONTH_NAMES[validStart.getMonth()] + ' ' + validStart.getFullYear() : null,
        dateCreated: validStart ? validStart.getFullYear() + '-' + String(validStart.getMonth() + 1).padStart(2, '0') : null
    };
};
