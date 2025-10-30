# 🏛️ Tale of DDH UI

<div align="center">

![Version](https://img.shields.io/badge/version-6.0.0-blue.svg?cacheSeconds=2592000)
![Node Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)
![Private](https://img.shields.io/badge/repository-private-red.svg)

**🌟 The official user interface for Tale of DDH community organization**

[🌐 Live Website](https://taleofddh.com/) • [🐛 Report Bug](https://github.com/taleofddh/taleofddh-ui/issues) • [✨ Request Feature](https://github.com/taleofddh/taleofddh-ui/issues)

</div>

---

## 📖 About The Project

Tale of DDH UI is a modern, responsive web application built with Next.js that serves as the digital hub for the Tale of DDH community. The platform provides comprehensive features for community engagement, event management, charity initiatives, and member services.

### ✨ Key Features

- 🎪 **Event Management** - Browse and register for community events
- 💝 **Charity Initiatives** - Support and track charitable causes
- 👥 **Member Portal** - Personalized user accounts and profiles
- 📱 **Responsive Design** - Optimized for all devices
- 🔐 **Secure Authentication** - AWS Amplify integration
- 📊 **Media Gallery** - Community photos and videos
- 🎯 **Sponsorship Management** - Corporate partnership features
- 📧 **Contact & Enquiry** - Direct communication channels

## 🛠️ Built With

This project leverages modern web technologies for optimal performance and user experience:

- **Framework:** [Next.js 15.5.4](https://nextjs.org/) - React framework with SSR/ISR
- **Frontend:** [React 19.2.0](https://reactjs.org/) - Component-based UI library
- **Styling:** [Sass](https://sass-lang.com/) - Enhanced CSS with variables and mixins (using modern `@use` syntax)
- **Authentication:** [AWS Amplify](https://aws.amazon.com/amplify/) - Secure user management
- **Icons:** [FontAwesome](https://fontawesome.com/) & [React Icons](https://react-icons.github.io/react-icons/)
- **UI Components:** Various React libraries for enhanced functionality

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** >= 22.0.0
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:addaslough/addaslough-ui.git
   cd addaslough-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files and configure as needed
   cp .env.local.example .env.local
   cp .env.development.local.example .env.development.local
   cp .env.production.local.example .env.production.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:18401](http://localhost:18401) to see the application.

## ⚙️ Environment Variables

The application uses environment variables for configuration across different environments. Three environment files are used:

- `.env.local` - Shared configuration for all environments
- `.env.development.local` - Development-specific settings
- `.env.production.local` - Production-specific settings

### 🔧 Core Configuration (.env.local)

| Variable | Description |
|----------|-------------|
| `PORT` | Development server port (18401) |
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
| `npm run dev` | 🔧 Starts development server on port 18401 |
| `npm run build` | 🏗️ Creates optimized production build |
| `npm run start` | 🚀 Starts production server |
| `npm run lint` | 🔍 Runs ESLint for code quality checks |
| `npm run analyze` | 📊 Generates bundle analysis reports |
| `npm run size-check` | 📏 Validates bundle sizes against budgets |
| `npm run compress-assets` | 🗜️ Compresses production assets |
| `npm run build:production` | 🚀 Full optimized production build with compression |

## ⚡ Build Optimization

Advanced optimization system for optimal performance and fast loading times.

### 🎯 Key Achievements
- **14% Bundle Reduction:** 4.69MB → 4.01MB total size
- **Dynamic Loading:** Heavy components load on-demand
- **75% Compression:** Brotli compression for modern browsers
- **Smart Code Splitting:** 200KB max chunks with intelligent grouping

### 🛠️ Features
- **Lazy Loading:** React Player, Carousel, PDF Viewer dynamically imported
- **Bundle Monitoring:** Automated size checks with `npm run size-check`
- **Asset Compression:** Gzip/Brotli compression in production builds
- **CI/CD Integration:** Size budget enforcement in GitHub Actions

### 📊 Size Budgets
| Asset Type | Limit | Purpose |
|------------|-------|---------|
| Total JS | 1.2MB | Overall JavaScript budget |
| Chunks | 200KB | Individual chunk limit |
| CSS | 100KB | Stylesheet budget |
| Images | 800KB | Media asset limit |

### 🚀 Production Build
```bash
npm run build:production  # Optimized build + compression + validation
```

### 🔧 Configuration Files

All optimization settings are in the `config/` directory:

| File | Purpose | Usage |
|------|---------|-------|
| `size-budget.config.js` | Bundle size limits and thresholds | Used by `npm run size-check` |
| `bundle-monitoring.yml` | CI/CD monitoring template | Reference for build pipelines |

**Modify Size Budgets:**
```bash
# Edit size limits
nano config/size-budget.config.js

# Test new budgets  
npm run size-check
```

> 💡 Configuration files are automatically loaded by build scripts - no manual setup required.

## 📁 Project Structure

```
taleofddh-ui/
├── 📁 common/           # Shared utilities and configurations
├── 📁 components/       # Reusable React components
├── 📁 pages/           # Next.js pages and routing
├── 📁 public/          # Static assets (images, fonts, etc.)
├── 📁 styles/          # SCSS stylesheets
├── 📄 middleware.js    # Next.js middleware
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

## 🌐 Deployment & Hosting

The application is hosted on **AWS Amplify** with automatic deployments configured for different environments based on Git branch detection.

### 🏗️ Build Configuration

```yaml
# amplify.yml
version: 1
settings:
  name: taleofddh-ui
  nodeVersion: 22
env:
  variables:
    NODE_ENV: production
    NEXT_TELEMETRY_DISABLED: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm install 22
        - nvm use 22
        - node -v
        - npm install
    build:
      commands:
        - echo "🚀 Starting optimized production build..."
        - npm run build:production
        - echo "📊 Running bundle size check..."
        - npm run size-check
        - echo "✅ Production build complete with optimizations!"
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
3. **Build Process:** Runs Node.js 22 environment with optimized build
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

- **Node.js 22:** Required for optimal performance and compatibility
- **Build Time:** Approximately 3-5 minutes depending on changes
- **Cache Optimization:** Node modules cached for faster subsequent builds
- **Optimized Build:** Production builds include compression and size validation

## 🤝 Contributing

This is a **private repository** for the Tale of DDH organization. Contributors should follow the established workflow for code changes:

### 🔄 Development Workflow

1. **Create** a feature branch from `development`
   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/your-feature-name
   ```

2. **Develop** and test your changes locally
   ```bash
   npm run dev
   npm run build
   npm run lint
   ```

3. **Commit** your changes with clear messages
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push** to the `development` branch
   ```bash
   git push origin feature/your-feature-name
   # Create PR to development branch
   ```

5. **Integration Testing** - Changes are deployed to [dev.taleofddh.com](https://dev.taleofddh.com/) 🔒
    - Automated deployment triggers on development branch
    - Perform thorough testing on staging environment
    - Verify all functionality works as expected

6. **Production Deployment** - After successful integration testing
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

> 🔐 **Access Required:** This is a private repository. Contact the organization for access permissions.

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? We'd love to hear from you!

- **Bug Reports:** [Create an issue](https://github.com/taleofddh/taleofddh-ui/issues) with detailed steps to reproduce
- **Feature Requests:** [Submit a request](https://github.com/taleofddh/taleofddh-ui/issues) with your use case and expected behavior

## 📄 License

This is a **private repository** owned by Tale of DDH organization. All rights reserved.

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