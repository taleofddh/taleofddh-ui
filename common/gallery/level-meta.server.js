import {serverGet} from "../server-config";
import {toSlug} from "../slug";
import {toDescription} from "../seo";

// Build-time only (getStaticProps / getStaticPaths): this file calls the API.

// One API call per build worker for all level text
let levelMetaPromise = null;

/**
 * Public text for a gallery level, or null when none is stored.
 * @param {'category'|'subCategory'|'collection'} level
 * @param {...string} names category, then sub-category, then collection (names or slugs)
 */
export const getLevelMeta = async (level, ...names) => {
    if (!levelMetaPromise) levelMetaPromise = serverGet('findAlbumLevelMetaList', '/albumLevelMetaList');
    const list = await levelMetaPromise;
    const path = names.map(toSlug).join('/');
    const item = Array.isArray(list) ? list.find((entry) => entry.level === level && entry.path === path) : null;
    if (!item) return null;
    return {
        title: item.title || null,
        summary: item.summary || null,
        description: item.description || null,
        coverAlt: item.coverAlt || null
    };
};

/** Metadata for a gallery level page, with defaults for anything the API has no text for. */
export const levelMetadata = (levelMeta, defaults, image, galleryName) => ({
    title: (levelMeta && levelMeta.title) || defaults.title,
    description: (levelMeta && (levelMeta.summary || toDescription(levelMeta.description))) || defaults.description,
    image,
    imageAlt: (levelMeta && levelMeta.coverAlt) || null,
    gallery: {name: galleryName}
});
