import React from "react";

function Architecture(props) {
    return (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 2400 2040">
                <defs>
                    <style>

                    </style>
                    <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="#9CA3AF" />
                    </marker>
                </defs>

                {/* Dark Background */}
                <rect x="0" y="0" width="2400" height="2000" fill="rgb(20, 20, 20)"/>

                {/* Title */}
                <text x="1200" y="50" fill="#F9FAFB" textAnchor="middle" fontSize="32" fontWeight="bold" fontFamily="Arial, sans-serif">Tale of DDH Backend Architecture</text>

                {/* Client Layer */}
                <rect x="50" y="100" width="2300" height="140" className="group-box"/>
                <text x="80" y="135" className="architecture-title">Client Layer</text>
                <rect x="1000" y="155" width="400" height="70" rx="8" className="client-box"/>
                <text x="1200" y="197" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle">Web/Mobile Clients</text>

                {/* Arrow from Client to API Gateway Layer */}
                <path d="M 1200 225 L 1200 270" className="arrow"/>

                {/* API Gateway Layer */}
                <rect x="50" y="270" width="2300" height="200" className="group-box"/>
                <text x="80" y="305" className="architecture-title">API Gateway Layer (Regional)</text>

                {/* API Gateway Services with Icons */}
                <image x="130" y="330" width="64" height="64" xlinkHref="/images/Arch_Amazon-API-Gateway_64.svg"/>
                <text x="162" y="410" className="service-label" fontWeight="bold">Auth API</text>
                <text x="162" y="430" className="service-label" fontSize="12">/auth</text>

                <image x="330" y="330" width="64" height="64" xlinkHref="/images/Arch_Amazon-API-Gateway_64.svg"/>
                <text x="362" y="410" className="service-label" fontWeight="bold">Blog API</text>
                <text x="362" y="430" className="service-label" fontSize="12">/blog</text>

                <image x="530" y="330" width="64" height="64" xlinkHref="/images/Arch_Amazon-API-Gateway_64.svg"/>
                <text x="562" y="410" className="service-label" fontWeight="bold">Gallery API</text>
                <text x="562" y="430" className="service-label" fontSize="12">/gallery</text>

                <image x="730" y="330" width="64" height="64" xlinkHref="/images/Arch_Amazon-API-Gateway_64.svg"/>
                <text x="762" y="410" className="service-label" fontWeight="bold">Core API</text>
                <text x="762" y="430" className="service-label" fontSize="12">/core</text>

                <image x="930" y="330" width="64" height="64" xlinkHref="/images/Arch_Amazon-API-Gateway_64.svg"/>
                <text x="962" y="410" className="service-label" fontWeight="bold">Request API</text>
                <text x="962" y="430" className="service-label" fontSize="12">/request</text>

                <image x="1130" y="330" width="64" height="64" xlinkHref="/images/Arch_Amazon-API-Gateway_64.svg"/>
                <text x="1162" y="410" className="service-label" fontWeight="bold">Email API</text>
                <text x="1162" y="430" className="service-label" fontSize="12">/email</text>

                <image x="1330" y="330" width="64" height="64" xlinkHref="/images/Arch_Amazon-API-Gateway_64.svg"/>
                <text x="1362" y="410" className="service-label" fontWeight="bold">Link API</text>
                <text x="1362" y="430" className="service-label" fontSize="12">/link</text>

                <image x="1530" y="330" width="64" height="64" xlinkHref="/images/Arch_Amazon-API-Gateway_64.svg"/>
                <text x="1562" y="410" className="service-label" fontWeight="bold">Org API</text>
                <text x="1562" y="430" className="service-label" fontSize="12">/org</text>

                <image x="1730" y="330" width="64" height="64" xlinkHref="/images/Arch_Amazon-API-Gateway_64.svg"/>
                <text x="1762" y="410" className="service-label" fontWeight="bold">Admin API</text>
                <text x="1762" y="430" className="service-label" fontSize="12">/admin</text>

                {/* Arrow from API Gateway to Lambda Layer */}
                <path d="M 1200 470 L 1200 500" className="arrow"/>

                {/* Lambda Layer */}
                <rect x="50" y="500" width="2300" height="250" className="group-box"/>
                <text x="80" y="535" className="architecture-title">Lambda Functions (Node.js 22.x)</text>

                {/* Lambda Functions with Icons */}
                <image x="130" y="560" width="64" height="64" xlinkHref="/images/Arch_AWS-Lambda_64.svg"/>
                <text x="162" y="640" className="service-label" fontWeight="bold">Auth</text>
                <text x="162" y="660" className="service-label" fontSize="12">findIdentity</text>

                <image x="330" y="560" width="64" height="64" xlinkHref="/images/Arch_AWS-Lambda_64.svg"/>
                <text x="362" y="640" className="service-label" fontWeight="bold">Blog</text>
                <text x="362" y="660" className="service-label" fontSize="12">findBlog</text>

                <image x="530" y="560" width="64" height="64" xlinkHref="/images/Arch_AWS-Lambda_64.svg"/>
                <text x="562" y="640" className="service-label" fontWeight="bold">Gallery</text>
                <text x="562" y="660" className="service-label" fontSize="12">findAlbum</text>

                <image x="730" y="560" width="64" height="64" xlinkHref="/images/Arch_AWS-Lambda_64.svg"/>
                <text x="762" y="640" className="service-label" fontWeight="bold">Core</text>
                <text x="762" y="660" className="service-label" fontSize="12">findMenu</text>

                <image x="930" y="560" width="64" height="64" xlinkHref="/images/Arch_AWS-Lambda_64.svg"/>
                <text x="962" y="640" className="service-label" fontWeight="bold">Request</text>
                <text x="962" y="660" className="service-label" fontSize="12">createRequest</text>

                <image x="1130" y="560" width="64" height="64" xlinkHref="/images/Arch_AWS-Lambda_64.svg"/>
                <text x="1162" y="640" className="service-label" fontWeight="bold">Email</text>
                <text x="1162" y="660" className="service-label" fontSize="12">sendEmail</text>

                <image x="1330" y="560" width="64" height="64" xlinkHref="/images/Arch_AWS-Lambda_64.svg"/>
                <text x="1362" y="640" className="service-label" fontWeight="bold">Link</text>
                <text x="1362" y="660" className="service-label" fontSize="12">findLink</text>

                <image x="1530" y="560" width="64" height="64" xlinkHref="/images/Arch_AWS-Lambda_64.svg"/>
                <text x="1562" y="640" className="service-label" fontWeight="bold">Org</text>
                <text x="1562" y="660" className="service-label" fontSize="12">findAboutUs</text>

                <image x="1730" y="560" width="64" height="64" xlinkHref="/images/Arch_AWS-Lambda_64.svg"/>
                <text x="1762" y="640" className="service-label" fontWeight="bold">Admin</text>
                <text x="1762" y="660" className="service-label" fontSize="12">processMsg</text>

                {/* Integration Lambda */}
                <image x="930" y="670" width="64" height="64" xlinkHref="/images/Arch_AWS-Lambda_64.svg"/>
                <text x="962" y="685" className="service-label" fontWeight="bold">Integration</text>
                <text x="962" y="705" className="service-label" fontSize="12">sendEmailMsg</text>

                {/* Arrow from Lambda to Data Storage Layer */}
                <path d="M 1200 750 L 1200 780" className="arrow"/>

                {/* Data Storage Layer */}
                <rect x="50" y="780" width="2300" height="380" className="group-box"/>
                <text x="80" y="815" className="architecture-title">Data Storage Layer</text>

                {/* DynamoDB Tables */}
                <text x="80" y="860" className="text" fontWeight="bold" fontSize="18">DynamoDB Tables:</text>

                <image x="130" y="880" width="64" height="64" xlinkHref="/images/Arch_Amazon-DynamoDB_64.svg"/>
                <text x="162" y="960" className="service-label" fontWeight="bold">Auth</text>
                <text x="162" y="980" className="service-label" fontSize="12">userProfile</text>

                <image x="280" y="880" width="64" height="64" xlinkHref="/images/Arch_Amazon-DynamoDB_64.svg"/>
                <text x="312" y="960" className="service-label" fontWeight="bold">Blog</text>
                <text x="312" y="980" className="service-label" fontSize="12">blog, comment</text>

                <image x="430" y="880" width="64" height="64" xlinkHref="/images/Arch_Amazon-DynamoDB_64.svg"/>
                <text x="462" y="960" className="service-label" fontWeight="bold">Gallery</text>
                <text x="462" y="980" className="service-label" fontSize="12">gallery, photo</text>

                <image x="580" y="880" width="64" height="64" xlinkHref="/images/Arch_Amazon-DynamoDB_64.svg"/>
                <text x="612" y="960" className="service-label" fontWeight="bold">Request</text>
                <text x="612" y="980" className="service-label" fontSize="12">request, sub</text>

                <image x="730" y="880" width="64" height="64" xlinkHref="/images/Arch_Amazon-DynamoDB_64.svg"/>
                <text x="762" y="960" className="service-label" fontWeight="bold">Link</text>
                <text x="762" y="980" className="service-label" fontSize="12">link, country</text>

                <image x="880" y="880" width="64" height="64" xlinkHref="/images/Arch_Amazon-DynamoDB_64.svg"/>
                <text x="912" y="960" className="service-label" fontWeight="bold">Org</text>
                <text x="912" y="980" className="service-label" fontSize="12">people, menu</text>

                <image x="1030" y="880" width="64" height="64" xlinkHref="/images/Arch_Amazon-DynamoDB_64.svg"/>
                <text x="1062" y="960" className="service-label" fontWeight="bold">Admin</text>
                <text x="1062" y="980" className="service-label" fontSize="12">inbox</text>

                {/* S3 Buckets */}
                <text x="80" y="1025" className="text" fontWeight="bold" fontSize="18">S3 Buckets:</text>

                <image x="130" y="1040" width="64" height="64" xlinkHref="/images/Arch_Amazon-Simple-Storage-Service_64.svg"/>
                <text x="162" y="1120" className="service-label" fontSize="12">taleofddh-blogs</text>

                <image x="280" y="1040" width="64" height="64" xlinkHref="/images/Arch_Amazon-Simple-Storage-Service_64.svg"/>
                <text x="312" y="1120" className="service-label" fontSize="12">taleofddh-media</text>

                <image x="430" y="1040" width="64" height="64" xlinkHref="/images/Arch_Amazon-Simple-Storage-Service_64.svg"/>
                <text x="462" y="1120" className="service-label" fontSize="12">taleofddh-data</text>

                <image x="580" y="1040" width="64" height="64" xlinkHref="/images/Arch_Amazon-Simple-Storage-Service_64.svg"/>
                <text x="612" y="1120" className="service-label" fontSize="12">taleofddh-docs</text>

                <image x="730" y="1040" width="64" height="64" xlinkHref="/images/Arch_Amazon-Simple-Storage-Service_64.svg"/>
                <text x="762" y="1120" className="service-label" fontSize="12">taleofddh-messages</text>

                {/* CloudFront */}
                <image x="1330" y="880" width="64" height="64" xlinkHref="/images/Arch_Amazon-CloudFront_64.svg"/>
                <text x="1362" y="960" className="service-label" fontWeight="bold">CloudFront CDN</text>
                <text x="1362" y="980" className="service-label" fontSize="12">media-protected</text>

                {/* Secrets Manager */}
                <image x="1530" y="880" width="64" height="64" xlinkHref="/images/Arch_AWS-Secrets-Manager_64.svg"/>
                <text x="1562" y="960" className="service-label" fontWeight="bold">Secrets Manager</text>
                <text x="1562" y="980" className="service-label" fontSize="12">API Keys, Creds</text>

                {/* Messaging Layer */}
                <rect x="50" y="1190" width="1100" height="230" className="group-box"/>
                <text x="80" y="1225" className="architecture-title">Messaging &amp; Notification Layer</text>

                {/* SQS */}
                <image x="130" y="1250" width="64" height="64" xlinkHref="/images/Arch_Amazon-Simple-Queue-Service_64.svg"/>
                <text x="162" y="1330" className="service-label" fontWeight="bold">SQS Queue</text>
                <text x="162" y="1350" className="service-label" fontSize="12">taleofddh-message</text>

                {/* SNS Topics */}
                <image x="350" y="1250" width="64" height="64" xlinkHref="/images/Arch_Amazon-Simple-Notification-Service_64.svg"/>
                <text x="382" y="1330" className="service-label" fontWeight="bold">SNS Topic</text>
                <text x="382" y="1350" className="service-label" fontSize="12">whatsapp</text>

                <image x="570" y="1250" width="64" height="64" xlinkHref="/images/Arch_Amazon-Simple-Notification-Service_64.svg"/>
                <text x="602" y="1330" className="service-label" fontWeight="bold">SNS Topic</text>
                <text x="602" y="1350" className="service-label" fontSize="12">google-drive</text>

                {/* SES */}
                <image x="790" y="1250" width="64" height="64" xlinkHref="/images/Arch_Amazon-Simple-Notification-Service_64.svg"/>
                <text x="822" y="1330" className="service-label" fontWeight="bold">Amazon SES</text>
                <text x="822" y="1350" className="service-label" fontSize="12">Email Service</text>

                {/* Arrow from Lambda to Messaging Layer (L-shaped) */}
                <path d="M 962 734 L 962 760 L 460 760 L 460 1190" className="arrow"/>

                {/* External Services Layer */}
                <rect x="1200" y="1190" width="1150" height="230" className="group-box"/>
                <text x="1230" y="1225" className="architecture-title">External Integrations &amp; Infrastructure</text>

                {/* Gmail */}
                <image x="1280" y="1250" width="64" height="64" xlinkHref="/images/Gmail_icon_(2020).svg"/>
                <text x="1312" y="1330" className="service-label" fontWeight="bold">Gmail API</text>
                <text x="1312" y="1350" className="service-label" fontSize="12">Email Processing</text>

                {/* Google Drive */}
                <image x="1480" y="1250" width="64" height="64" xlinkHref="/images/Google_Drive_icon_(2020).svg"/>
                <text x="1512" y="1330" className="service-label" fontWeight="bold">Google Drive</text>
                <text x="1512" y="1350" className="service-label" fontSize="12">File Storage</text>

                {/* WhatsApp */}
                <image x="1680" y="1250" width="64" height="64" xlinkHref="/images/WhatsApp.svg"/>
                <text x="1712" y="1330" className="service-label" fontWeight="bold">WhatsApp API</text>
                <text x="1712" y="1350" className="service-label" fontSize="12">Messaging</text>

                {/* Route 53 */}
                <image x="1880" y="1250" width="64" height="64" xlinkHref="/images/Arch_Amazon-Route-53_64.svg"/>
                <text x="1912" y="1330" className="service-label" fontWeight="bold">Route 53</text>
                <text x="1912" y="1350" className="service-label" fontSize="12">DNS</text>

                {/* Certificate Manager */}
                <image x="2080" y="1250" width="64" height="64" xlinkHref="/images/Arch_AWS-Certificate-Manager_64.svg"/>
                <text x="2112" y="1330" className="service-label" fontWeight="bold">ACM</text>
                <text x="2112" y="1350" className="service-label" fontSize="12">SSL/TLS</text>

                {/* Arrow from Lambda to External Services (L-shaped) */}
                <path d="M 962 734 L 962 760 L 1700 760 L 1700 1190" className="arrow"/>

                {/* Security & IAM Layer */}
                <rect x="50" y="1450" width="2300" height="180" className="group-box"/>
                <text x="80" y="1485" className="architecture-title">Security &amp; Access Control</text>

                <image x="130" y="1510" width="64" height="64" xlinkHref="/images/Arch_AWS-Identity-and-Access-Management_64.svg"/>
                <text x="162" y="1590" className="service-label" fontWeight="bold">IAM</text>
                <text x="162" y="1610" className="service-label" fontSize="12">Roles &amp; Policies</text>

                <image x="380" y="1510" width="64" height="64" xlinkHref="/images/Arch_AWS-Identity-and-Access-Management_64.svg"/>
                <text x="412" y="1590" className="service-label" fontWeight="bold">IAM Authorizer</text>
                <text x="412" y="1610" className="service-label" fontSize="12">API Gateway Auth</text>

                <image x="630" y="1510" width="64" height="64" xlinkHref="/images/Arch_AWS-Key-Management-Service_64.svg"/>
                <text x="662" y="1590" className="service-label" fontWeight="bold">KMS</text>
                <text x="662" y="1610" className="service-label" fontSize="12">Encryption</text>

                <image x="880" y="1510" width="64" height="64" xlinkHref="/images/Arch_Amazon-CloudWatch_64.svg"/>
                <text x="912" y="1590" className="service-label" fontWeight="bold">CloudWatch</text>
                <text x="912" y="1610" className="service-label" fontSize="12">Monitoring</text>

                <image x="1130" y="1510" width="64" height="64" xlinkHref="/images/Arch_AWS-CloudFormation_64.svg"/>
                <text x="1162" y="1590" className="service-label" fontWeight="bold">CloudFormation</text>
                <text x="1162" y="1610" className="service-label" fontSize="12">IaC</text>

                <image x="1380" y="1510" width="64" height="64" xlinkHref="/images/Arch_AWS-X-Ray_64.svg"/>
                <text x="1412" y="1590" className="service-label" fontWeight="bold">X-Ray</text>
                <text x="1412" y="1610" className="service-label" fontSize="12">Tracing</text>

                {/* Legend */}
                <rect x="50" y="1660" width="2300" height="400" className="group-box"/>
                <text x="80" y="1695" className="architecture-title">Architecture Legend &amp; Key Features</text>

                <text x="100" y="1740" className="text" fontWeight="bold" fontSize="18">Microservices Architecture:</text>
                <text x="100" y="1770" className="text">• 9 Independent API Services (Auth, Blog, Gallery, Core, Request, Email, Link, Org, Admin)</text>
                <text x="100" y="1800" className="text">• Each service has dedicated Lambda functions, DynamoDB tables, and API Gateway endpoints</text>
                <text x="100" y="1830" className="text">• Serverless Framework v4 for deployment automation</text>
                <text x="100" y="1860" className="text">• Event-driven architecture with SQS and SNS for asynchronous processing</text>

                <text x="100" y="1905" className="text" fontWeight="bold" fontSize="18">Key Features:</text>
                <text x="100" y="1935" className="text">• Regional API Gateway with custom domain (api.taleofddh.com) and TLS 1.2</text>
                <text x="100" y="1965" className="text">• Node.js 22.x runtime for all Lambda functions</text>
                <text x="100" y="1995" className="text">• Multi-bucket S3 strategy: blogs, media, data, documents, messages</text>

                <text x="1250" y="1740" className="text" fontWeight="bold" fontSize="18">Integration Patterns:</text>
                <text x="1250" y="1770" className="text">• External integrations: Gmail API, Google Drive API, WhatsApp API</text>
                <text x="1250" y="1800" className="text">• SES for transactional email delivery</text>
                <text x="1250" y="1830" className="text">• SNS topics for fan-out messaging patterns</text>
                <text x="1250" y="1860" className="text">• SQS queues for reliable message processing</text>

                <text x="1250" y="1905" className="text" fontWeight="bold" fontSize="18">Security:</text>
                <text x="1250" y="1935" className="text">• IAM-based API authorization for protected endpoints</text>
                <text x="1250" y="1965" className="text">• KMS encryption for sensitive data at rest</text>
                <text x="1250" y="1995" className="text">• Secrets Manager for API keys and credentials</text>
            </svg>
        </>
    )
}

export default Architecture;