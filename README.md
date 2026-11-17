# 🏛️ Tale of DDH UI

<div align="center">

![Version](https://img.shields.io/badge/version-8.0.0-blue.svg?cacheSeconds=2592000)
![Node Version](https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen.svg)
![npm Version](https://img.shields.io/badge/npm-%3E%3D11.0.0-CB3837.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black.svg)
![React](https://img.shields.io/badge/React-19.3.1-61DAFB.svg)
![License](https://img.shields.io/badge/license-GPL--3.0--or--later-blue.svg)

**🌟 The official user interface for Tale of DDH community organization**

[🌐 Live Website](https://taleofddh.com/) • [🐛 Report Bug](https://github.com/taleofddh/taleofddh-ui/issues) • [✨ Request Feature](https://github.com/taleofddh/taleofddh-ui/issues)

</div>

---

## 📖 About The Project

Tale of DDH UI is a modern, responsive web application built with Next.js that serves as the digital hub for the Tale of DDH community. The platform provides comprehensive features for community engagement, event management, charity initiatives, and member services.

### ✨ Key Features

- 📝 **Blogs Platform** - Technical, Travel, and Recipe blogs with categories
- 🖼️ **Photo Gallery** - Community photo albums with historical collections
- 🗺️ **Travel Guides** - Itineraries, estimates, and downloadable travel documents
- 👥 **User Profiles** - Personalized accounts with authentication
- 📱 **Responsive Design** - Optimized for all devices and screen sizes
- 🔐 **Secure Authentication** - AWS Amplify Cognito integration with OAuth
- 📧 **Contact & Enquiry** - Direct communication forms
- ℹ️ **About Us** - Community information and stories

## 🛠️ Built With

This project leverages modern web technologies for optimal performance and user experience:

- **Framework:** [Next.js 16.4.6](https://nextjs.org/) - React framework with SSR/ISR
- **Frontend:** [React 19.3.1](https://reactjs.org/) - Component-based UI library
- **Styling:** [Sass 1.98.0](https://sass-lang.com/) - Enhanced CSS with variables and mixins (using modern `@use` syntax)
- **Authentication:** [AWS Amplify 6.16.3](https://aws.amazon.com/amplify/) - Secure user management
- **Icons:** [FontAwesome](https://fontawesome.com/) & [React Icons](https://react-icons.github.io/react-icons/)
- **UI Components:** Various React libraries for enhanced functionality

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** >= 24.0.0
- **npm** >= 11.0.0 (or **yarn** package manager)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:taleofddh/taleofddh-ui.git
   cd taleofddh-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create the following environment files in the project root and configure them with your specific values:
   - `.env.local` - Shared configuration for all environments
   - `.env.development.local` - Development-specific settings
   - `.env.production.local` - Production-specific settings
   
   Refer to the [Environment Variables](#️-environment-variables) section below for required configuration values.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:19401](http://localhost:19401) to see the application.

## ⚙️ Environment Variables

The application uses environment variables for configuration across different environments. Three environment files are used:

- `.env.local` - Shared configuration for all environments
- `.env.development.local` - Development-specific settings
- `.env.production.local` - Production-specific settings

### 🔧 Core Configuration (.env.local)

| Variable | Description |
|----------|-------------|
| `PORT` | Development server port (19401) |
| `NEXT_PUBLIC_APP_NAME` | Application identifier |
| `NEXT_PUBLIC_DOMAIN_NAME` | Primary domain name |
| `NEXT_PUBLIC_MEDIA_HOST` | Media CDN host URL |
| `NEXT_PUBLIC_MEDIA_DOMAIN` | Media domain for assets |

### 🌐 AWS Configuration

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_AWS_REGION` | Primary AWS region (eu-west-2) |
| `NEXT_PUBLIC_AWS_COGNITO_REGION` | Cognito service region |
| `NEXT_PUBLIC_AWS_API_GATEWAY_REGION` | API Gateway region |
| `NEXT_PUBLIC_AWS_S3_REGION` | S3 bucket region |

### 🪣 S3 Storage Buckets

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_AWS_S3_BUCKET` | Main S3 bucket |
| `NEXT_PUBLIC_AWS_S3_DOCUMENT_BUCKET` | Document storage bucket |
| `NEXT_PUBLIC_AWS_S3_MEDIA_BUCKET` | Media files bucket |
| `NEXT_PUBLIC_AWS_S3_MESSAGE_BUCKET` | Message storage bucket |

### 🔐 Authentication (Environment-specific)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID` | Cognito User Pool identifier |
| `NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID` | Cognito App Client ID |
| `NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID` | Cognito Identity Pool ID |
| `NEXT_PUBLIC_AWS_OATH_DOMAIN` | OAuth domain for authentication |
| `NEXT_PUBLIC_AWS_OATH_REDIRECT_SIGN_IN` | Sign-in redirect URL |
| `NEXT_PUBLIC_AWS_OATH_REDIRECT_SIGN_OUT` | Sign-out redirect URL |

### 🌍 External Services

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAP_API_KEY` | Google Maps API key |
| `NEXT_PUBLIC_GOOGLE_MAP_API_URL` | Google Maps API endpoint |
| `NEXT_PUBLIC_GTAG_TRACKING_ID` | Google Analytics tracking ID |
| `NEXT_PUBLIC_FACEBOOK_APP_URL` | Facebook SDK URL |
| `NEXT_PUBLIC_GEOLOCATION_URL` | IP geolocation service |

### 🚀 Performance & Features

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_EVENT_REVALIDATE_PERIOD` | ISR revalidation period (seconds) |
| `NEXT_PUBLIC_INDEX_FLAG` | Search engine indexing flag |
| `NEXT_PUBLIC_MEASUREMENT_FLAG` | Analytics measurement flag |
| `NEXT_PUBLIC_AWS_COOKIE_SECURED_FLAG` | Secure cookie flag |

> 💡 **Note:** All `NEXT_PUBLIC_` prefixed variables are exposed to the browser. Sensitive keys should never use this prefix.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 🔧 Starts development server on port 19401 |
| `npm run build` | 🏗️ Builds the static site (SSG) and exports it to `out/` |
| `npm run start` | 🚀 Runs `next start` (not used for the static export; serve `out/` instead) |
| `npm run lint` | 🔍 Runs ESLint for code quality checks |

### 🏗️ Static Site Generation (SSG) & Output Directory

`next.config.js` sets `output: 'export'` and `trailingSlash: true`. `npm run build` pre-renders every page at build time with `getStaticProps` and `getStaticPaths`, and writes plain HTML, JS and assets to the **`out/`** directory. Each page is exported as `<path>/index.html`. AWS Amplify serves `out/` as static hosting (`baseDirectory: out` in `amplify.yml`).

Because the site is a static export, image optimization is disabled (`images.unoptimized`) and `redirects()` is not available. Redirects are configured as Amplify rules.

### 🔍 Linting (ESLint)

The project uses **ESLint 9** with the flat config in `eslint.config.js`, extending `eslint-config-next/core-web-vitals`. The `.next/`, `out/` and `node_modules/` directories are ignored.

```bash
npm run lint
```

## 📁 Project Structure

```
taleofddh-ui/
├── 📁 common/           # Shared utilities and configurations
├── 📁 components/       # Reusable React components
├── 📁 pages/           # Next.js pages and routing
├── 📁 public/          # Static assets (images, fonts, etc.)
├── 📁 scripts/         # Build scripts (sitemap, robots.txt, metadata check)
├── 📁 styles/          # SCSS stylesheets
├── 📁 out/             # Static export output (generated by build)
├── 📄 eslint.config.js # ESLint flat configuration
├── 📄 next.config.js   # Next.js configuration
└── 📄 package.json     # Project dependencies and scripts
```

### 🧩 Key Components

- **Authentication:** Login, registration, and password management
- **Events:** Event listings, details, and registration forms
- **Charities:** Charity information and donation features
- **Media:** Photo galleries and video content
- **Forms:** Contact, enquiry, membership, and sponsorship forms
- **Navigation:** Responsive header and navigation components

### 🔐 Authentication & Route Protection

The site is a static export, so there is no server runtime or Next.js middleware. Route protection runs in the browser:

- **Cookie-based Authentication:** The `credential` cookie indicates the user's authentication status
- **Route Guard:** A client-side guard in `pages/_app.js` redirects signed-out visitors from protected routes to `/sign-in`
- **Protected Routes:** Defined in `common/constants.js` via the `PROTECTED_ROUTES` constant
- **Public Routes:** All other routes are accessible without authentication

> ⚠️ Static HTML is public. Do not put private data in `getStaticProps` output. Private data must be fetched in the browser after sign-in.

### 🎨 Styling Architecture

The project uses **Sass (SCSS)** with a modern module system for maintainable and scalable stylesheets:

```
styles/
├── common/
│   └── common.scss      # Shared variables, mixins, and base styles
├── components/          # Component-specific stylesheets (40+ files)
├── pages/              # Page-specific stylesheets (25+ files)
└── globals.scss        # Global styles and imports
```

**Key Features:**
- **Modern Syntax:** Uses `@use` instead of deprecated `@import` for better performance and module isolation
- **Global Namespace:** Maintains backward compatibility with `@use "path" as *` syntax
- **Shared Variables:** Centralized color palette and design tokens in `common/common.scss`
- **Component Isolation:** Each component has its own stylesheet for maintainability
- **Next.js Integration:** Optimized for Next.js build system with automatic CSS optimization

**Sass Guidelines:**
- All stylesheets import the common module using: `@use "../common/common" as *;`
- Variables are accessed directly without namespace prefixes (e.g., `$color-deep-teal`)
- New stylesheets should follow the established pattern for consistency
- The build system automatically handles CSS optimization and vendor prefixing

## 🔎 SEO & Page Metadata

Every page gets a unique title, description, image and canonical URL from one helper, `buildMeta()` in `common/seo.js`. `pages/_app.js` calls it for every page and renders the result with the single `components/metatag.js`.

**Where the values come from**

| Page | Title | Description | Image |
|------|-------|-------------|-------|
| Static pages (home, about, contact, FAQ, privacy, terms, blogs, gallery, links) | Fixed text in `STATIC_PAGES` (`common/seo.js`) | Fixed text, 120 to 160 characters | Default social image |
| Blog category | Category name | Fixed text with the category name | Default social image |
| Blog article | `header` | `summary`, otherwise `title` topped up with the first paragraph | `titlePhoto` (public), alt text from `titlePhotoAlt` |
| Gallery category, sub-category, collection | Level text `title`, otherwise built from the names | Level `summary` or the start of its `description`, otherwise built from the names | Public level cover |
| Gallery album | Album name and its place in the hierarchy | `summary`, otherwise the start of `description` | Public album cover, alt text from `coverAlt` |

Titles use the template `<Page> | taleofddh`. Pages pass a `meta` object from `getStaticProps`. Anything they leave out is filled in by `buildMeta()`.

**Tags and structured data:** `<title>`, description, `canonical` (from `NEXT_PUBLIC_HOST_NAME` plus the path with its trailing slash), Open Graph, Twitter card and `robots`. JSON-LD covers `WebSite` and `Organization` on every page, `BlogPosting` on blog articles, `ImageGallery` on gallery pages and `BreadcrumbList` on nested blog and gallery URLs.

**What is not indexed:** `sign-in`, `sign-up`, `reset-password`, `change-password`, `my-account/*`, `admin` and the 404 page get `noindex`, no canonical and no JSON-LD. When `NEXT_PUBLIC_INDEX_FLAG` is `false` (localhost and dev), every page is `noindex`.

### 🗺️ Sitemap, robots.txt and the metadata check

`npm run build` runs `next build` and then `scripts/generate-seo-files.js`, which reads the exported pages in `out/`:

- writes `out/robots.txt` (allow all when `NEXT_PUBLIC_INDEX_FLAG` is `true`, otherwise `Disallow: /`)
- writes `out/sitemap.xml` with every indexable page (not written when indexing is off)
- checks each indexable page for a missing or duplicate title or description, a description outside 110 to 165 characters, a wrong canonical, a missing `og:image` and invalid JSON-LD

Problems are printed as warnings. Set `SEO_STRICT=true` in the environment to fail the build instead.

| Variable | Production | Dev and localhost |
|----------|------------|-------------------|
| `NEXT_PUBLIC_INDEX_FLAG` | `true` | `false` |
| `NEXT_PUBLIC_HOST_NAME` | `https://taleofddh.com` | `https://dev.taleofddh.com` or `http://localhost:19401` |

### 🖼️ Gallery pages and the album teaser

- Gallery category, sub-category, collection and album pages are built at build time. Their cover images are public and unsigned, stored under `<MEDIA_HOST>/images/gallery/<category>/<sub-category>/<collection>/<album>.jpg`.
- An album page is public as a teaser: cover, month and year, public location, photo and video counts and the description. Signed-out visitors see a "Sign in to view this album" button that keeps the `redirect` parameter. They are not redirected.
- Photos and videos are never part of the static HTML or JSON. They load in the browser only after sign-in, and the API signs them. `getStaticProps` builds the teaser from an explicit list of fields (`common/gallery/album-teaser.server.js`).
- The gated section has the class `photoalbumgated`, and the page's JSON-LD marks it with `isAccessibleForFree: false`.
- Everything in the teaser is public (HTML, JSON and `og:image`). Do not put family member names, exact addresses or private dates in public fields.

### ✍️ Writing album text (Gallery Management)

| Field | Use |
|-------|-----|
| Description | Public intro in Markdown, up to 3000 characters. Aim for 150 to 300 words: what and where, when (month and year), 2 or 3 highlights, what the album contains. |
| Summary | Meta description, empty or 120 to 160 characters. When empty, the start of the description is used. |
| Cover Alt Text | Describes the cover image, up to 125 characters. |
| Public Location | Town or region only, up to 100 characters. |

Saving an album triggers a rebuild, so new text appears on the next build.

## 🌐 Deployment & Hosting

The application is hosted on **AWS Amplify** with automatic deployments configured for different environments based on Git branch detection.

### 🏗️ Build Configuration

The `amplify.yml` file defines the build process for AWS Amplify deployments:

```yaml
version: 1
settings:
  name: taleofddh-ui
  nodeVersion: 24
frontend:
  phases:
    preBuild:
      commands:
        - nvm install 24
        - nvm use 24
        - npm install -g npm@11
        - node -v
        - npm -v
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 🌍 Environment Configuration

The project uses **branch-based deployments** with automatic change detection:

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| **Production** | `production` | [taleofddh.com](https://taleofddh.com/) | Live production site |
| **Development** | `development` | [dev.taleofddh.com](https://dev.taleofddh.com/) 🔒 | Staging/testing environment (password protected) |

### 🔧 AWS Configuration

- **AWS Profile:** `taleofddh`
- **Region:** Configured in AWS Amplify Console
- **Auto-Deploy:** Enabled for both branches
- **Build Triggers:** Git push to respective branches

### 📋 Deployment Process

1. **Code Changes:** Push commits to `development` or `production` branch
2. **Auto Detection:** Amplify detects changes via Git webhooks
3. **Build Process:** Runs Node.js 24 environment with optimized build
4. **Deployment:** Automatic deployment to respective environment
5. **Verification:** Build logs and deployment status available in Amplify Console

### 🛠️ Managing Deployments

To access AWS Amplify apps and manage deployments:

```bash
# Set AWS profile for Tale of DDH account
export AWS_PROFILE=taleofddh

# View Amplify apps
aws amplify list-apps

# Get app details
aws amplify get-app --app-id <app-id>
```

### 🚨 Deployment Notes

- **Node.js 24 & npm 11:** Required for optimal performance and compatibility (configured in both `package.json` engines and `amplify.yml`)
- **Build Time:** Approximately 3-5 minutes depending on changes
- **Cache Optimization:** Node modules cached for faster subsequent builds
- **Static Build:** Uses `npm run build` to generate the static export in `out/`, which Amplify publishes

## 🤝 Contributing

This is a **public repository** for the Tale of DDH organization. External contributors are welcome via the standard fork and pull request workflow.

### 🔄 Development Workflow

1. **Fork** the repository on GitHub
   - Click the **Fork** button at the top-right of the repository page
   - This creates your own copy of the repo under your GitHub account

2. **Clone** your fork locally
   ```bash
   git clone git@github.com:<your-username>/taleofddh-ui.git
   cd taleofddh-ui
   ```

3. **Add the upstream remote** to keep your fork in sync
   ```bash
   git remote add upstream git@github.com:taleofddh/taleofddh-ui.git
   ```

4. **Create** a feature branch from `development`
   ```bash
   git checkout development
   git pull upstream development
   git checkout -b feature/your-feature-name
   ```

5. **Develop** and test your changes locally
   ```bash
   npm run dev
   npm run build
   npm run lint
   ```

6. **Commit** your changes with clear messages
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

7. **Push** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request** against the `development` branch of the upstream repo
   - Go to your fork on GitHub and click **Compare & pull request**
   - Set the base repository to `taleofddh/taleofddh-ui` and base branch to `development`
   - Provide a clear title and description of your changes
   - Submit the PR and wait for a review from the maintainers

9. **Integration Testing** - Once merged, changes are deployed to [dev.taleofddh.com](https://dev.taleofddh.com/) 🔒
    - Automated deployment triggers on development branch
    - Perform thorough testing on staging environment
    - Verify all functionality works as expected

10. **Production Deployment** - After successful integration testing
    ```bash
    git checkout production
    git merge development
    git push origin production
    ```

### 📋 Contribution Guidelines

- **Local Testing Required:** Always test changes locally before pushing
- **Development First:** All changes must go through development branch
- **Integration Testing:** Verify functionality on dev.taleofddh.com before production
- **Code Quality:** Follow existing code style and conventions
- **Clear Commits:** Write descriptive commit messages following conventional commits
- **Documentation:** Update documentation for new features or changes
- **No Direct Production:** Never push directly to production branch
- **Sass Guidelines:** Use `@use "../common/common" as *;` for importing shared styles

### 🚨 Branch Protection

- **Development Branch:** Staging environment for integration testing
- **Production Branch:** Live production site - only merge after successful testing
- **Feature Branches:** Create from development, merge back to development

> � **Contributing:** Fork the repository, make your changes on a feature branch, and open a pull request against the `development` branch.

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? We'd love to hear from you!

- **Bug Reports:** [Create an issue](https://github.com/taleofddh/taleofddh-ui/issues) with detailed steps to reproduce
- **Feature Requests:** [Submit a request](https://github.com/taleofddh/taleofddh-ui/issues) with your use case and expected behavior

## 📄 License

This project is licensed under the **GNU General Public License v3.0 or later (GPL-3.0-or-later)**.

This means you are free to:
- ✅ **Use** the software for any purpose
- 📖 **Study** and modify the source code
- 🤝 **Share** the software with others
- 📦 **Distribute** modified versions

Under the conditions that:
- 📝 You must **disclose the source code** when distributing
- 🔄 You must **license derivative works** under GPL-3.0-or-later
- ©️ You must **include the original copyright and license notices**

See the [LICENSE](LICENSE) file for full details.

> � **License:** This is an open-source repository licensed under GPL-3.0-or-later. See the [LICENSE](LICENSE) file for full details.

## 👨‍💻 Author

**Devadyuti Das**
- GitHub: [@devadyuti](https://github.com/devadyuti)
- Website: [taleofddh.com](https://taleofddh.com/)

## 🙏 Acknowledgments

- Thanks to all community members who contribute to this project
- Special appreciation for the Tale of DDH organization and its mission
- Gratitude to the open-source community for the amazing tools and libraries

---

<div align="center">

**Made with ❤️ for the Tale of DDH Community**

[⬆ Back to Top](#-taleofddh-ui)

</div>