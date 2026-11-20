import {HOST_NAME, INDEX_FLAG, MEDIA_HOST} from "./constants";

/**
 * Central page metadata.
 *
 * A page describes itself with a small object (all fields optional):
 *   { title, description, image, imageAlt, type, noindex, article, gallery }
 * buildMeta() fills every missing field, so no page is ever left without a title,
 * description, image or canonical URL. _app.js calls it for every page and hands the
 * result to the single <MetaTag>.
 *
 * Pages return that object from getStaticProps as `meta`. Pages with fixed text are
 * covered by STATIC_PAGES below and need no `meta` at all.
 */

export const SITE_NAME = 'taleofddh';
export const TITLE_SUFFIX = ' | ' + SITE_NAME;
export const DESCRIPTION_MAX = 160;
export const DEFAULT_DESCRIPTION = 'Welcome to Tale of Devadyuti, Debarati & Deeptanal. Travel blogs, recipes, technology articles and photo galleries from our family, in one place.';
export const DEFAULT_TITLE = 'Welcome to Tale of Devadyuti, Debarati & Deeptanal\'s Home';
// Served by the site itself from public/images (the media host does not hold these files)
export const DEFAULT_IMAGE = (HOST_NAME || '').replace(/\/+$/, '') + '/images/taleofddh-logo.png';

const ABOUT_IMAGE = (HOST_NAME || '').replace(/\/+$/, '') + '/images/talofddh-devadyuti-debarati-deeptanal-home.jpg';

// Pages that must never be indexed. Matched against the Next.js route pattern
// (router.pathname), so every page generated from a dynamic route is covered.
export const NOINDEX_ROUTES = [
    '/sign-in',
    '/sign-up',
    '/reset-password',
    '/change-password',
    '/my-account',
    '/my-account/blog-management',
    '/my-account/event-attendance',
    '/my-account/gallery-management',
    '/my-account/user-profile',
    '/my-account/administration',
    '/404'
];

// Fixed title and description per page, keyed by route pattern.
// Descriptions are written to sit between 120 and 160 characters.
export const STATIC_PAGES = {
    '/': {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION
    },
    '/about-us': {
        title: 'The Tale of DDH Story: Our Mission, Journey and Background',
        description: 'Meet the family behind taleofddh. Read our story, our mission and how we built a place on the web to share our travels, recipes and technology notes.',
        image: ABOUT_IMAGE
    },
    '/contact-us': {
        title: 'Contact Us: Service, Support and Enquiries',
        description: 'Contact the taleofddh team with questions about our travel blogs, photo galleries, cooking posts or technology articles. We reply to every enquiry.'
    },
    '/frequently-asked-questions': {
        title: 'Frequently Asked Questions',
        description: 'Answers to common questions about taleofddh: using the website, signing in to view photo albums, our blogs, privacy and how to get in touch with us.'
    },
    '/privacy-policy': {
        title: 'Privacy Policy',
        description: 'Read how taleofddh collects, uses and protects your personal information, which cookies we use, and the choices you have over your data.'
    },
    '/terms-and-conditions': {
        title: 'Terms and Conditions',
        description: 'The terms and conditions for using taleofddh, including how we share our travel, technology and cooking blogs and our sign-in only photo galleries.'
    },
    '/blogs': {
        title: 'Blogs: Travel, Recipes and Technology',
        description: 'Read taleofddh blogs on family travel, home cooking recipes and technology, written from our own trips, kitchen experiments and software projects.'
    },
    '/gallery': {
        title: 'Gallery: Photo and Video Albums',
        description: 'Browse recent and historical photo and video albums from taleofddh, covering family vacations, short trips and celebrations. Sign in to view the albums.'
    },
    '/links': {
        title: 'Useful Links: Travel Guides and Solutions Architecture',
        description: 'A curated list of taleofddh links to travel guides, travel documents and solutions architecture references that we find useful and use ourselves.'
    },
    '/links/travel-guides': {
        title: 'Travel Guides and Travel Documents',
        description: 'Travel guides and travel document checklists from taleofddh, with the countries we have visited and practical notes to help you plan your own trip.'
    },
    '/links/solutions-architecture': {
        title: 'Solutions Architecture Reference',
        description: 'Solutions architecture notes from taleofddh, including the AWS services and architecture diagrams behind this website and how the pieces fit together.'
    }
};

// Generic titles for pages that are not indexed.
const NOINDEX_TITLES = {
    '/sign-in': 'Sign in',
    '/sign-up': 'Sign up',
    '/reset-password': 'Reset password',
    '/change-password': 'Change password',
    '/my-account/administration': 'Administration',
    '/404': 'Page not found'
};

/** Strips markdown/HTML to plain text. */
export const toPlainText = (text) => {
    if (!text) return '';
    return String(text)
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/^\s{0,3}#{1,6}\s*/gm, '')
        .replace(/^\s*>\s?/gm, '')
        .replace(/^\s*([-*+]|\d+\.)\s+/gm, '')
        .replace(/[*_`~]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
};

/** Plain text trimmed to max characters on a word boundary. */
export const toDescription = (text, max = DESCRIPTION_MAX) => {
    const plain = toPlainText(text);
    if (plain.length <= max) return plain;
    const cut = plain.substring(0, max - 1);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > max * 0.6 ? cut.substring(0, lastSpace) : cut).replace(/[\s,;:.\-]+$/, '') + '\u2026';
};

/** First paragraph of a markdown document that is real prose (skips headings, images, lists, short lines). */
export const firstParagraph = (markdown, minLength = 60) => {
    if (!markdown) return '';
    const blocks = String(markdown).split(/\n\s*\n/);
    for (const block of blocks) {
        const trimmed = block.trim();
        if (!trimmed || /^(#|!\[|[-*+]\s|\d+\.\s|>|```|<)/.test(trimmed)) continue;
        const plain = toPlainText(trimmed);
        if (plain.length >= minLength) return plain;
    }
    return '';
};

/**
 * Description from a main sentence plus supporting text. When the main sentence is shorter than
 * `min` characters, the supporting text is appended so the description is not thin.
 */
export const composeDescription = (primary, supporting, min = 120) => {
    const main = toPlainText(primary);
    const extra = toPlainText(supporting);
    if (main.length >= min || !extra) return toDescription(main || extra);
    const joined = main ? main.replace(/[\s.]+$/, '') + '. ' + extra : extra;
    return toDescription(joined);
};

export const withTitleSuffix = (title) => {
    const base = (title || '').trim();
    if (!base) return SITE_NAME;
    return base.endsWith(TITLE_SUFFIX.trim()) ? base : base + TITLE_SUFFIX;
};

/** Absolute URL for an image; relative values are resolved under MEDIA_HOST/images. */
export const toAbsoluteImage = (image) => {
    if (!image) return DEFAULT_IMAGE;
    if (/^https?:\/\//i.test(image)) return image;
    return MEDIA_HOST + '/images/' + image.replace(/^\/+/, '');
};

/** Canonical path: no query or hash, with a trailing slash (the site uses trailingSlash: true). */
export const toCanonicalPath = (asPath = '/') => {
    const path = String(asPath).split('#')[0].split('?')[0] || '/';
    const withLeading = path.startsWith('/') ? path : '/' + path;
    return withLeading.endsWith('/') ? withLeading : withLeading + '/';
};

export const siteUrl = () => (HOST_NAME || '').replace(/\/+$/, '');

// "my-trip-and-more" -> "My Trip & More" (same convention the pages use to read URL params)
export const segmentToName = (segment) => {
    let decoded = segment;
    try {
        decoded = decodeURIComponent(segment);
    } catch (e) {
        // keep the raw segment
    }
    return decoded
        .replace(/-and-/g, ' & ')
        .replace(/-/g, ' ')
        .replace(/(^|\s)([a-z])/g, (m, space, letter) => space + letter.toUpperCase());
};

const BREADCRUMB_ROOTS = {blogs: 'Blogs', gallery: 'Gallery'};

/** BreadcrumbList for nested blog and gallery URLs. Returns null elsewhere. */
export const buildBreadcrumbs = (canonicalPath) => {
    const segments = canonicalPath.split('/').filter(Boolean);
    if (segments.length < 2 || !BREADCRUMB_ROOTS[segments[0]]) return null;
    const base = siteUrl();
    const items = [{name: 'Home', url: base + '/'}];
    segments.forEach((segment, index) => {
        items.push({
            name: index === 0 ? BREADCRUMB_ROOTS[segment] : segmentToName(segment),
            url: base + '/' + segments.slice(0, index + 1).join('/') + '/'
        });
    });
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    };
};

const siteGraph = () => {
    const base = siteUrl();
    return [
        {
            '@type': 'WebSite',
            '@id': base + '/#website',
            url: base + '/',
            name: SITE_NAME,
            description: DEFAULT_DESCRIPTION,
            publisher: {'@id': base + '/#organization'}
        },
        {
            '@type': 'Organization',
            '@id': base + '/#organization',
            name: SITE_NAME,
            url: base + '/',
            logo: DEFAULT_IMAGE
        }
    ];
};

/**
 * Fills every metadata field.
 *
 * @param {object} page  per-page values (all optional), see file header
 * @param {{pathname: string, asPath: string}} route  Next.js router values
 */
export const buildMeta = (page = {}, route = {}) => {
    const pathname = route.pathname || '/';
    const canonicalPath = toCanonicalPath(route.asPath || pathname);
    const noindexRoute = NOINDEX_ROUTES.includes(pathname) || pathname.startsWith('/my-account');
    const fallback = noindexRoute
        ? {title: NOINDEX_TITLES[pathname] || 'My Account', description: DEFAULT_DESCRIPTION}
        : (STATIC_PAGES[pathname] || {});

    const noindex = Boolean(page.noindex) || noindexRoute || !INDEX_FLAG;
    const title = withTitleSuffix(page.title || fallback.title || DEFAULT_TITLE);
    const description = toDescription(page.description || fallback.description || DEFAULT_DESCRIPTION);
    const image = noindexRoute ? null : toAbsoluteImage(page.image || fallback.image);
    const type = page.type === 'article' ? 'article' : 'website';
    const base = siteUrl();
    const url = base + canonicalPath;

    const graph = noindex ? [] : [...siteGraph()];
    if (!noindex) {
        const breadcrumbs = buildBreadcrumbs(canonicalPath);
        if (breadcrumbs) graph.push(breadcrumbs);
        if (type === 'article' && page.article) {
            graph.push({
                '@type': 'BlogPosting',
                '@id': url + '#article',
                mainEntityOfPage: url,
                headline: toDescription(page.article.headline || page.title, 110),
                description,
                image: [image],
                ...(page.article.datePublished ? {datePublished: page.article.datePublished} : {}),
                ...((page.article.dateModified || page.article.datePublished) ? {dateModified: page.article.dateModified || page.article.datePublished} : {}),
                author: {'@type': 'Person', name: page.article.author || SITE_NAME},
                publisher: {'@id': base + '/#organization'}
            });
        }
        if (page.gallery) {
            graph.push({
                '@type': 'ImageGallery',
                '@id': url + '#gallery',
                url,
                name: page.gallery.name || page.title,
                description,
                image,
                ...(page.gallery.dateCreated ? {dateCreated: page.gallery.dateCreated} : {}),
                ...(page.gallery.locationCreated ? {locationCreated: {'@type': 'Place', name: page.gallery.locationCreated}} : {}),
                ...(page.gallery.gated ? {
                    isAccessibleForFree: false,
                    hasPart: {
                        '@type': 'WebPageElement',
                        isAccessibleForFree: false,
                        cssSelector: page.gallery.gated
                    }
                } : {})
            });
        }
    }

    return {
        title,
        description,
        image,
        imageAlt: page.imageAlt || title,
        type,
        noindex,
        canonical: noindex ? null : url,
        url,
        robots: noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
        publishedTime: type === 'article' && page.article ? page.article.datePublished : null,
        jsonLd: graph.length > 0 ? {'@context': 'https://schema.org', '@graph': graph} : null
    };
};
