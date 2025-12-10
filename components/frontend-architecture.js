import React from "react";

function FrontendArchitecture() {
    return (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 2400 1800">
                <defs>
                    <style>                        
                    </style>
                    <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="#9CA3AF" />
                    </marker>
                </defs>

                {/* Dark Background */}
                <rect x="0" y="0" width="2400" height="1800" fill="rgb(20, 20, 20)"/>

                {/* Title */}
                <text x="1200" y="50" fill="#F9FAFB" textAnchor="middle" fontSize="32" fontWeight="bold" fontFamily="Arial, sans-serif">Tale of DDH Frontend Architecture</text>

                {/* User Access Layer */}
                <rect x="50" y="100" width="2300" height="140" className="group-box"/>
                <text x="80" y="135" className="architecture-title">Global Users</text>

                {/* Global Users */}
                <circle cx="300" cy="180" r="25" fill="#374151" stroke="#6B7280" strokeWidth="2"/>
                <text x="300" y="220" className="service-label">Americas</text>

                <circle cx="600" cy="180" r="25" fill="#374151" stroke="#6B7280" strokeWidth="2"/>
                <text x="600" y="220" className="service-label">Europe</text>

                <circle cx="900" cy="180" r="25" fill="#374151" stroke="#6B7280" strokeWidth="2"/>
                <text x="900" y="220" className="service-label">Asia Pacific</text>

                {/* DNS Layer */}
                <rect x="50" y="270" width="2300" height="200" className="group-box"/>
                <text x="80" y="305" className="architecture-title">DNS &amp; Security Layer</text>

                {/* Route 53 */}
                <image x="330" y="320" width="64" height="64" xlinkHref="/images/Arch_Amazon-Route-53_64.svg"/>
                <text x="362" y="400" className="service-label" fontWeight="bold">Route 53</text>
                <text x="362" y="420" className="service-label" fontSize="12">taleofddh.com</text>

                {/* Certificate Manager */}
                <image x="730" y="320" width="64" height="64" xlinkHref="/images/Arch_AWS-Certificate-Manager_64.svg"/>
                <text x="762" y="400" className="service-label" fontWeight="bold">Certificate Manager</text>
                <text x="762" y="420" className="service-label" fontSize="12">SSL/TLS</text>

                {/* CDN Layer */}
                <rect x="50" y="500" width="2300" height="180" className="group-box"/>
                <text x="80" y="535" className="architecture-title">CDN &amp; Content Delivery Layer</text>

                {/* CloudFront */}
                <image x="530" y="560" width="64" height="64" xlinkHref="/images/Arch_Amazon-CloudFront_64.svg"/>
                <text x="562" y="640" className="service-label" fontWeight="bold">CloudFront</text>
                <text x="562" y="660" className="service-label" fontSize="12">Global CDN</text>

                {/* Edge Locations */}
                <circle cx="200" cy="590" r="15" fill="#10B981"/>
                <text x="200" y="620" className="service-label" fontSize="12">Americas Edge</text>

                <circle cx="800" cy="590" r="15" fill="#10B981"/>
                <text x="800" y="620" className="service-label" fontSize="12">Europe Edge</text>

                <circle cx="1200" cy="590" r="15" fill="#10B981"/>
                <text x="1200" y="620" className="service-label" fontSize="12">Asia Edge</text>

                {/* Caching Info */}
                <text x="1600" y="580" className="text" fontSize="14" fontWeight="bold">Caching Strategy:</text>
                <text x="1600" y="600" className="text" fontSize="12">Static Assets: 1 year TTL</text>
                <text x="1600" y="615" className="text" fontSize="12">Dynamic Content: 5 min TTL</text>
                <text x="1600" y="630" className="text" fontSize="12">Global latency: &lt;100ms</text>

                {/* Frontend Hosting Layer */}
                <rect x="50" y="710" width="2300" height="230" className="group-box"/>
                <text x="80" y="745" className="architecture-title">Frontend Hosting Layer</text>

                {/* AWS Amplify */}
                <image x="330" y="770" width="64" height="64" xlinkHref="/images/Arch_AWS-Amplify_64.svg"/>
                <text x="362" y="850" className="service-label" fontWeight="bold">AWS Amplify</text>
                <text x="362" y="870" className="service-label" fontSize="12">Hosting Platform</text>
                <text x="362" y="885" className="service-label" fontSize="12">CI/CD Pipeline</text>

                {/* Next.js Application */}
                <image x="730" y="770" width="64" height="64" xlinkHref="/images/NextJS-icon.svg" className="nextjs-icon"/>
                <text x="762" y="850" className="service-label" fontWeight="bold">Next.js Application</text>
                <text x="762" y="870" className="service-label" fontSize="12">React 18.3.1 | Next.js 15.5.6 | Node.js 22</text>

                {/* Application Structure */}
                <rect x="950" y="760" width="180" height="120" className="client-box"/>
                <text x="1040" y="785" className="service-label" fontWeight="bold" fontSize="12">App Structure</text>
                <text x="960" y="805" className="text" fontSize="11">📁 pages/</text>
                <text x="960" y="820" className="text" fontSize="11">📁 components/</text>
                <text x="960" y="835" className="text" fontSize="11">📁 styles/</text>
                <text x="960" y="850" className="text" fontSize="11">📁 public/</text>
                <text x="960" y="865" className="text" fontSize="11">📁 common/</text>

                {/* Build Features */}
                <rect x="1150" y="760" width="200" height="120" className="client-box"/>
                <text x="1240" y="785" className="service-label" fontWeight="bold" fontSize="12">Build Features</text>
                <text x="1160" y="805" className="text" fontSize="11">✓ Static Generation</text>
                <text x="1160" y="820" className="text" fontSize="11">✓ Server-Side Rendering</text>
                <text x="1160" y="835" className="text" fontSize="11">✓ Image Optimization</text>
                <text x="1160" y="850" className="text" fontSize="11">✓ Code Splitting</text>
                <text x="1160" y="865" className="text" fontSize="11">✓ Bundle Analysis</text>

                {/* Main Flow Arrows */}
                {/* Users to DNS Layer */}
                <path d="M 600 240 L 600 270" className="arrow"/>

                {/* DNS Layer to CDN Layer */}
                <path d="M 600 470 L 600 500" className="arrow"/>

                {/* CloudFront to Edge Locations */}
                <path d="M 530 592 L 215 590" className="arrow"/>
                <path d="M 594 592 L 785 590" className="arrow"/>
                <path d="M 812 592 L 1185 590" className="arrow"/>

                {/* CDN Layer to Frontend Hosting Layer */}
                <path d="M 600 680 L 600 710" className="arrow"/>

                {/* Frontend Hosting Layer to Authentication Layer */}
                <path d="M 600 940 L 600 970" className="arrow"/>

                {/* Amplify to Next.js (horizontal connection) */}
                <path d="M 394 802 L 730 802" className="arrow"/>

                {/* Authentication & API Integration Layer */}
                <rect x="50" y="970" width="2300" height="200" className="group-box"/>
                <text x="80" y="1005" className="architecture-title">Authentication &amp; API Integration Layer</text>

                {/* Amazon Cognito */}
                <image x="230" y="1020" width="64" height="64" xlinkHref="/images/Arch_Amazon-Cognito_64.svg"/>
                <text x="262" y="1100" className="service-label" fontWeight="bold">Amazon Cognito</text>
                <text x="262" y="1120" className="service-label" fontSize="12">User Authentication</text>
                <text x="262" y="1135" className="service-label" fontSize="12">User Pools &amp; Identity</text>

                {/* API Gateway */}
                <image x="530" y="1020" width="64" height="64" xlinkHref="/images/Arch_Amazon-API-Gateway_64.svg"/>
                <text x="562" y="1100" className="service-label" fontWeight="bold">API Gateway</text>
                <text x="562" y="1120" className="service-label" fontSize="12">REST &amp; GraphQL APIs</text>

                {/* Backend Architecture Reference */}
                <rect x="830" y="1010" width="280" height="100" className="client-box"/>
                <text x="970" y="1035" className="service-label" fontWeight="bold" fontSize="12">Backend Services</text>
                <text x="840" y="1055" className="text" fontSize="11">🔗 Lambda Functions</text>
                <text x="840" y="1070" className="text" fontSize="11">🔗 DynamoDB Tables</text>
                <text x="840" y="1085" className="text" fontSize="11">🔗 S3 Storage</text>
                <text x="840" y="1100" className="text" fontSize="11">🔗 See Backend Architecture</text>

                {/* API Endpoints Types */}
                <rect x="1150" y="1010" width="200" height="100" className="client-box"/>
                <text x="1240" y="1035" className="service-label" fontWeight="bold" fontSize="12">API Endpoints</text>
                <text x="1160" y="1055" className="text" fontSize="11">🔓 Public APIs</text>
                <text x="1160" y="1070" className="text" fontSize="11">🔒 Authenticated APIs</text>
                <text x="1160" y="1085" className="text" fontSize="11">🔐 Admin APIs</text>
                <text x="1160" y="1100" className="text" fontSize="11">📊 Analytics APIs</text>

                {/* Authentication Flow Info */}
                <rect x="1400" y="1010" width="220" height="100" className="client-box"/>
                <text x="1500" y="1035" className="service-label" fontWeight="bold" fontSize="12">Auth Features</text>
                <text x="1410" y="1055" className="text" fontSize="11">✓ Sign Up/Sign In</text>
                <text x="1410" y="1070" className="text" fontSize="11">✓ Password Reset</text>
                <text x="1410" y="1085" className="text" fontSize="11">✓ Social Login</text>
                <text x="1410" y="1100" className="text" fontSize="11">✓ JWT Tokens</text>

                {/* Authentication & API Arrows */}
                {/* Next.js to Cognito */}
                <path d="M 762 885 L 762 950 L 262 950 L 262 995" className="arrow"/>

                {/* Next.js to API Gateway */}
                <path d="M 762 885 L 762 950 L 562 950 L 562 995" className="arrow"/>

                {/* API Gateway to Backend Services */}
                <path d="M 594 1052 L 830 1052" className="arrow"/>

                {/* Authentication Layer to Static Assets Layer */}
                <path d="M 600 1170 L 600 1200" className="arrow"/>

                {/* Static Assets Layer */}
                <rect x="50" y="1200" width="2300" height="200" className="group-box"/>
                <text x="80" y="1235" className="architecture-title">Static Assets &amp; Media Delivery Layer</text>

                {/* S3 Media Bucket */}
                <image x="230" y="1260" width="64" height="64" xlinkHref="/images/Arch_Amazon-Simple-Storage-Service_64.svg"/>
                <text x="262" y="1340" className="service-label" fontWeight="bold">S3 Media Bucket</text>
                <text x="262" y="1360" className="service-label" fontSize="12">Images &amp; Videos</text>
                <text x="262" y="1375" className="service-label" fontSize="12">Gallery Assets</text>

                {/* S3 Documents Bucket */}
                <image x="430" y="1260" width="64" height="64" xlinkHref="/images/Arch_Amazon-Simple-Storage-Service_64.svg"/>
                <text x="462" y="1340" className="service-label" fontWeight="bold">S3 Documents</text>
                <text x="462" y="1360" className="service-label" fontSize="12">PDFs &amp; Files</text>
                <text x="462" y="1375" className="service-label" fontSize="12">User Uploads</text>

                {/* S3 Blogs Bucket */}
                <image x="630" y="1260" width="64" height="64" xlinkHref="/images/Arch_Amazon-Simple-Storage-Service_64.svg"/>
                <text x="662" y="1340" className="service-label" fontWeight="bold">S3 Blogs</text>
                <text x="662" y="1360" className="service-label" fontSize="12">Blog Content</text>
                <text x="662" y="1375" className="service-label" fontSize="12">Markdown Files</text>

                {/* Public Assets (Amplify) */}
                <rect x="930" y="1250" width="200" height="100" className="client-box"/>
                <text x="1030" y="1275" className="service-label" fontWeight="bold" fontSize="12">Public Assets</text>
                <text x="940" y="1295" className="text" fontSize="11">📁 /public/images/</text>
                <text x="940" y="1310" className="text" fontSize="11">📁 /public/fonts/</text>
                <text x="940" y="1325" className="text" fontSize="11">🎨 Icons &amp; Logos</text>
                <text x="940" y="1340" className="text" fontSize="11">⚡ Served via Amplify</text>

                {/* Next.js Image Optimization */}
                <rect x="1180" y="1250" width="220" height="100" className="client-box"/>
                <text x="1280" y="1275" className="service-label" fontWeight="bold" fontSize="12">Image Optimization</text>
                <text x="1190" y="1295" className="text" fontSize="11">🖼️ Next.js Image Component</text>
                <text x="1190" y="1310" className="text" fontSize="11">📐 Responsive Sizing</text>
                <text x="1190" y="1325" className="text" fontSize="11">🗜️ WebP/AVIF Conversion</text>
                <text x="1190" y="1340" className="text" fontSize="11">⚡ Lazy Loading</text>

                {/* Asset Performance Info */}
                <rect x="1450" y="1250" width="200" height="100" className="client-box"/>
                <text x="1540" y="1275" className="service-label" fontWeight="bold" fontSize="12">Performance</text>
                <text x="1460" y="1295" className="text" fontSize="11">📊 CDN Cache: 1 year</text>
                <text x="1460" y="1310" className="text" fontSize="11">🚀 Edge Optimization</text>
                <text x="1460" y="1325" className="text" fontSize="11">📱 Mobile Optimized</text>
                <text x="1460" y="1340" className="text" fontSize="11">🔄 Auto Format Selection</text>

                {/* Static Assets Arrows */}
                {/* CloudFront to S3 Storage */}
                <path d="M 562 645 L 562 1180 L 462 1180 L 462 1235" className="arrow"/>

                {/* Amplify to Public Assets */}
                <path d="M 362 885 L 362 1180 L 1030 1180 L 1030 1235" className="arrow"/>

                {/* Next.js to Image Optimization */}
                <path d="M 794 825 L 794 1250 L 1180 1250 L 1180 1285" className="arrow"/>

                {/* S3 Media to Image Optimization (for dynamic optimization) */}
                <path d="M 294 1292 L 1165 1292" className="arrow"/>

                {/* Legend and Key Features Section */}
                <rect x="50" y="1430" width="2300" height="320" className="group-box"/>
                <text x="80" y="1465" className="architecture-title">Legend &amp; Key Features</text>

                {/* Legend Icons */}
                <rect x="100" y="1490" width="595" height="240" className="client-box"/>
                <text x="340" y="1515" className="service-label" fontWeight="bold" fontSize="14">Service Icons Legend</text>

                {/* AWS Services Legend */}
                <image x="120" y="1530" width="32" height="32" xlinkHref="/images/Arch_AWS-Amplify_64.svg"/>
                <text x="160" y="1550" className="text" fontSize="12">AWS Amplify - Frontend Hosting</text>

                <image x="120" y="1570" width="32" height="32" xlinkHref="/images/Arch_Amazon-CloudFront_64.svg"/>
                <text x="160" y="1590" className="text" fontSize="12">CloudFront - Global CDN</text>

                <image x="120" y="1610" width="32" height="32" xlinkHref="/images/Arch_Amazon-Route-53_64.svg"/>
                <text x="160" y="1630" className="text" fontSize="12">Route 53 - DNS Management</text>

                <image x="120" y="1650" width="32" height="32" xlinkHref="/images/Arch_Amazon-Cognito_64.svg"/>
                <text x="160" y="1670" className="text" fontSize="12">Cognito - User Authentication</text>

                <image x="120" y="1690" width="32" height="32" xlinkHref="/images/Arch_Amazon-API-Gateway_64.svg"/>
                <text x="160" y="1710" className="text" fontSize="12">API Gateway - API Management</text>

                <image x="420" y="1530" width="32" height="32" xlinkHref="/images/Arch_Amazon-Simple-Storage-Service_64.svg"/>
                <text x="460" y="1550" className="text" fontSize="12">S3 - Object Storage</text>

                <image x="420" y="1570" width="32" height="32" xlinkHref="/images/Arch_AWS-Certificate-Manager_64.svg"/>
                <text x="460" y="1590" className="text" fontSize="12">ACM - SSL/TLS Certificates</text>

                <image x="420" y="1610" width="32" height="32" xlinkHref="/images/NextJS-icon.svg" className="nextjs-icon"/>
                <text x="460" y="1630" className="text" fontSize="12">Next.js - React Framework</text>

                {/* Flow Indicators Legend */}
                <circle cx="420" cy="1660" r="8" fill="#10B981"/>
                <text x="440" y="1665" className="text" fontSize="12">Edge Locations</text>

                <circle cx="420" cy="1690" r="8" fill="#374151" stroke="#6B7280" strokeWidth="2"/>
                <text x="440" y="1695" className="text" fontSize="12">Global User Regions</text>

                {/* Architecture Features */}
                <rect x="750" y="1490" width="400" height="240" className="client-box"/>
                <text x="940" y="1515" className="service-label" fontWeight="bold" fontSize="14">Key Architecture Features</text>

                <text x="770" y="1540" className="text" fontSize="13" fontWeight="bold">🌐 Global Distribution</text>
                <text x="780" y="1558" className="text" fontSize="11">• Multi-region CDN with edge locations</text>
                <text x="780" y="1573" className="text" fontSize="11">• Sub-100ms latency worldwide</text>

                <text x="770" y="1595" className="text" fontSize="13" fontWeight="bold">🔒 Security &amp; Authentication</text>
                <text x="780" y="1613" className="text" fontSize="11">• SSL/TLS encryption via ACM</text>
                <text x="780" y="1628" className="text" fontSize="11">• JWT-based authentication with Cognito</text>

                <text x="770" y="1650" className="text" fontSize="13" fontWeight="bold">⚡ Performance Optimization</text>
                <text x="780" y="1668" className="text" fontSize="11">• Static generation &amp; SSR</text>
                <text x="780" y="1683" className="text" fontSize="11">• Image optimization &amp; lazy loading</text>
                <text x="780" y="1698" className="text" fontSize="11">• Intelligent caching strategies</text>

                {/* Technology Stack */}
                <rect x="1200" y="1490" width="350" height="240" className="client-box"/>
                <text x="1365" y="1515" className="service-label" fontWeight="bold" fontSize="14">Technology Stack</text>

                <text x="1220" y="1540" className="text" fontSize="13" fontWeight="bold">Frontend Framework</text>
                <text x="1230" y="1558" className="text" fontSize="11">• React 18.3.1 with Next.js 15.5.6</text>
                <text x="1230" y="1573" className="text" fontSize="11">• Node.js 22 runtime</text>
                <text x="1230" y="1588" className="text" fontSize="11">• TypeScript support</text>

                <text x="1220" y="1610" className="text" fontSize="13" fontWeight="bold">AWS Infrastructure</text>
                <text x="1230" y="1628" className="text" fontSize="11">• Amplify for CI/CD &amp; hosting</text>
                <text x="1230" y="1643" className="text" fontSize="11">• CloudFront for global delivery</text>
                <text x="1230" y="1658" className="text" fontSize="11">• S3 for static asset storage</text>

                <text x="1220" y="1680" className="text" fontSize="13" fontWeight="bold">Development Features</text>
                <text x="1230" y="1698" className="text" fontSize="11">• Hot reloading &amp; fast refresh</text>
                <text x="1230" y="1713" className="text" fontSize="11">• Bundle analysis &amp; optimization</text>

                {/* Data Flow Information */}
                <rect x="1600" y="1490" width="320" height="240" className="client-box"/>
                <text x="1750" y="1515" className="service-label" fontWeight="bold" fontSize="14">Data Flow Patterns</text>

                <text x="1620" y="1540" className="text" fontSize="13" fontWeight="bold">User Request Flow</text>
                <text x="1630" y="1558" className="text" fontSize="11">1. DNS resolution via Route 53</text>
                <text x="1630" y="1573" className="text" fontSize="11">2. CDN routing via CloudFront</text>
                <text x="1630" y="1588" className="text" fontSize="11">3. App delivery from Amplify</text>

                <text x="1620" y="1610" className="text" fontSize="13" fontWeight="bold">API Communication</text>
                <text x="1630" y="1628" className="text" fontSize="11">• Authentication via Cognito</text>
                <text x="1630" y="1643" className="text" fontSize="11">• API calls through Gateway</text>
                <text x="1630" y="1658" className="text" fontSize="11">• Backend service integration</text>

                <text x="1620" y="1680" className="text" fontSize="13" fontWeight="bold">Asset Delivery</text>
                <text x="1630" y="1698" className="text" fontSize="11">• Static assets via S3 + CDN</text>
                <text x="1630" y="1713" className="text" fontSize="11">• Dynamic optimization</text>
            </svg>
        </>
    )
}

export default FrontendArchitecture;