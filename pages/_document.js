import { Html, Head, Main, NextScript } from 'next/document';
import {GOOGLE_MAP_API_KEY, GOOGLE_MAP_API_URL, GTAG_MEASUREMENT_ID} from "../common/constants";

function Document() {
    return (
        <Html>
            <Head>
                {/* Global Site Tag (gtag.js) - Google Analytics */}
                <script
                    async
                    src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_MEASUREMENT_ID}`}
                    crossOrigin="anonymous"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GTAG_MEASUREMENT_ID}', {
                          page_path: window.location.pathname,
                        });
                      `,
                    }}
                />
                <script async src="https://cdn.polyfill.io/v2/polyfill.min.js" crossOrigin="anonymous"></script>
                <script async src={`${GOOGLE_MAP_API_URL}?key=${GOOGLE_MAP_API_KEY}&libraries=places`}></script>
                <link rel="icon" type="image/png" href="images/icon-taleofddh.png"/>
                <link rel="shortcut icon" type="image/x-icon" href="images/fav-taleofddh.ico"/>

                <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet"/>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

export default Document;
