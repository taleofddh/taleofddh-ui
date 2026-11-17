/**
 * Post-build step: writes sitemap.xml and robots.txt into out/ and checks the metadata of
 * every exported page.
 *
 * It reads the exported HTML in out/, so it covers exactly the pages that getStaticPaths
 * produced, and it leaves out any page that renders <meta name="robots" content="noindex...">
 * (sign-in, sign-up, password pages, my-account/*, 404, and every page when INDEX_FLAG is false).
 *
 * Checks (warnings by default, build fails when SEO_STRICT=true):
 *   - missing or duplicate <title> or description
 *   - description outside 110 to 165 characters
 *   - missing canonical, canonical not matching the page path, missing og:image
 *   - JSON-LD that does not parse
 *
 * Run by `npm run build` after `next build`. Can also be run alone: node scripts/generate-seo-files.js
 */
const fs = require('fs');
const path = require('path');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd(), false, { info: () => {}, error: console.error });

const OUT_DIR = path.join(process.cwd(), 'out');
const HOST = (process.env.NEXT_PUBLIC_HOST_NAME || '').replace(/\/+$/, '');
const INDEX_FLAG = String(process.env.NEXT_PUBLIC_INDEX_FLAG || '').toUpperCase() === 'TRUE';
const STRICT = String(process.env.SEO_STRICT || '').toLowerCase() === 'true';
const DESCRIPTION_MIN = 110;
const DESCRIPTION_MAX = 165;

const decode = (text) => text
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'");

const findHtmlFiles = (dir) => {
    const files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === '_next') continue;
            files.push(...findHtmlFiles(full));
        } else if (entry.name === 'index.html') {
            files.push(full);
        }
    }
    return files;
};

const parseAttributes = (tag) => {
    const attrs = {};
    const pattern = /([a-zA-Z:-]+)="([^"]*)"/g;
    let match;
    while ((match = pattern.exec(tag)) !== null) attrs[match[1]] = decode(match[2]);
    return attrs;
};

const readPage = (file) => {
    const html = fs.readFileSync(file, 'utf8');
    const head = html.split('</head>')[0] || html;
    const route = '/' + path.relative(OUT_DIR, path.dirname(file)).split(path.sep).filter(Boolean).join('/');
    const urlPath = route === '/' ? '/' : route + '/';
    const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/);
    const metas = (head.match(/<meta\s[^>]*>/g) || []).map(parseAttributes);
    const meta = (key, value) => {
        const found = metas.find((item) => item[key] === value);
        return found ? found.content : undefined;
    };
    const canonicalTag = (head.match(/<link\s[^>]*rel="canonical"[^>]*>/) || [])[0];
    const jsonLd = (head.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g) || [])
        .map((script) => script.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, ''));
    return {
        urlPath,
        title: titleMatch ? decode(titleMatch[1]).trim() : '',
        description: (meta('name', 'description') || '').trim(),
        robots: meta('name', 'robots') || '',
        ogImage: meta('property', 'og:image'),
        ogTitle: meta('property', 'og:title'),
        canonical: canonicalTag ? parseAttributes(canonicalTag).href : undefined,
        jsonLd
    };
};

const main = () => {
    if (!fs.existsSync(OUT_DIR)) {
        console.error('[seo] out/ not found. Run `next build` first.');
        process.exit(1);
    }
    if (!HOST) {
        console.error('[seo] NEXT_PUBLIC_HOST_NAME is not set; cannot build sitemap or canonical checks.');
        process.exit(1);
    }

    const pages = findHtmlFiles(OUT_DIR).map(readPage).sort((a, b) => a.urlPath.localeCompare(b.urlPath));
    const indexable = pages.filter((page) => !/noindex/i.test(page.robots));
    const problems = [];
    const problem = (page, message) => problems.push(page.urlPath + ': ' + message);

    // --- checks on indexable pages
    const titles = new Map();
    const descriptions = new Map();
    for (const page of indexable) {
        if (!page.title) problem(page, 'missing <title>');
        if (!page.description) problem(page, 'missing meta description');
        if (page.description && (page.description.length < DESCRIPTION_MIN || page.description.length > DESCRIPTION_MAX)) {
            problem(page, 'description is ' + page.description.length + ' characters (expected ' + DESCRIPTION_MIN + ' to ' + DESCRIPTION_MAX + ')');
        }
        if (!page.canonical) problem(page, 'missing canonical link');
        else if (page.canonical !== HOST + page.urlPath) problem(page, 'canonical ' + page.canonical + ' does not match ' + HOST + page.urlPath);
        if (!page.ogImage) problem(page, 'missing og:image');
        page.jsonLd.forEach((json) => {
            try {
                JSON.parse(json);
            } catch (e) {
                problem(page, 'JSON-LD does not parse');
            }
        });
        if (page.title) titles.set(page.title, [...(titles.get(page.title) || []), page.urlPath]);
        if (page.description) descriptions.set(page.description, [...(descriptions.get(page.description) || []), page.urlPath]);
    }
    for (const [title, paths] of titles) {
        if (paths.length > 1) problems.push('duplicate title "' + title + '": ' + paths.join(', '));
    }
    for (const [description, paths] of descriptions) {
        if (paths.length > 1) problems.push('duplicate description "' + description.substring(0, 60) + '...": ' + paths.join(', '));
    }

    // --- sitemap.xml and robots.txt
    const escapeXml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
        + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + indexable.map((page) => '  <url><loc>' + escapeXml(HOST + page.urlPath) + '</loc></url>').join('\n')
        + '\n</urlset>\n';
    const robots = INDEX_FLAG
        ? 'User-agent: *\nAllow: /\n\nSitemap: ' + HOST + '/sitemap.xml\n'
        : 'User-agent: *\nDisallow: /\n';

    fs.writeFileSync(path.join(OUT_DIR, 'robots.txt'), robots);
    if (INDEX_FLAG) {
        fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), sitemap);
    } else if (fs.existsSync(path.join(OUT_DIR, 'sitemap.xml'))) {
        fs.unlinkSync(path.join(OUT_DIR, 'sitemap.xml'));
    }

    console.log('[seo] ' + pages.length + ' pages exported, ' + indexable.length + ' indexable.');
    console.log('[seo] robots.txt written (' + (INDEX_FLAG ? 'indexing allowed' : 'INDEX_FLAG is false: crawling disallowed, no sitemap') + ').');
    if (INDEX_FLAG) console.log('[seo] sitemap.xml written with ' + indexable.length + ' URLs.');

    if (problems.length > 0) {
        console.warn('[seo] ' + problems.length + ' metadata problem(s):');
        problems.forEach((item) => console.warn('  - ' + item));
        if (STRICT) {
            console.error('[seo] SEO_STRICT=true: failing the build.');
            process.exit(1);
        }
    } else {
        console.log('[seo] metadata check passed.');
    }
};

main();
