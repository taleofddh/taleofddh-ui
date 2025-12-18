import React, {useEffect} from 'react'
import Link from "next/link";
import {serverGet} from "../../common/server-config";
import {PAGE_REVALIDATE_PERIOD, HOST_NAME, INDEX_FLAG, MEDIA_HOST, MONTH_NAMES} from "../../common/constants";
import {capitalizeFirstLetters} from "../../common/common";
import { getSessionCookie } from "../../common/session";
import Header from '../../components/header';
import Navigation from '../../components/navigation';
import ResponsiveNavigation from "../../components/responsive-navigation";
import Footer from "../../components/footer";
import {postAuditEntry} from "../../common/common";
import Title from "../../components/title";
import Image from "next/image";
import Icon from "../../common/icon";

const pageTitle = "Blogs";

function BlogCategories({menuList, handleLogout, authenticated, /*upcomingEventData,*/ historicalBlogData, category, source, index, url}) {
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
                {
                    date: new Date(),
                    hostName: window.location.hostname,
                    countryCode: ddhomeCountry.country_code,
                    ipAddress: ddhomeCountry.ip,
                    page: 'albums',
                    message: category + ' Blogs Page Accessed'
                }
        );
    }, [ddhomeCountry, category]);

    /*const handleClick = async (clickEvent, object) => {
        clickEvent.preventDefault();
        let blogName = object.name;
        let blogCategory = object.category;
        await router.push(object.link + '/' + blogCategory + '/' + blogName,
                object.link + '/' + blogCategory + '/'  + blogName,
                {
                    index: index,
                    blog: {
                        category: blogCategory,
                        name: blogName
                    }
                });
    }*/

    return (
            <>
                <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
                <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
                <Navigation menus={menuList} />
                <div className="boxouter">
                    <div className="container">
                        <div className="blogframe">
                            <Title message={category + ' ' + pageTitle} />
                            <ul className="bloggroup">
                                {historicalBlogData.map((item, index) => (
                                    <li key={index} className="blogitem">
                                        <Link href={'/' + source + '/' + category.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase() + '/' + item.name.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase()} as={'/' + source + '/' + category.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase() + '/' + item.name.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase()}>
                                            <div>
                                                <p className="blogheader">{item.header}</p>
                                                <div className="blogpiccontrol">
                                                    <Image src={MEDIA_HOST + '/images/mobile/' + item.titlePhoto} alt={item.titlePhoto} layout='responsive' width={3} height={2} />
                                                </div>
                                                <div className="blogsummary">
                                                    <p className="blogauthor">{item.category +' ' + source + ' by ' + item.author + ' on ' + new Date(item.endDateTime).getDate() + " " + MONTH_NAMES[new Date(item.endDateTime).getMonth()] + ", " + new Date(item.endDateTime).getFullYear()}</p>
                                                    <p className="blogtitle">{item.title}</p>
                                                    <p className="blogshare"><Icon name="view" width="1rem" height="1rem" fill="rgb(255, 255, 255)"/>&nbsp;&nbsp;{item.viewCount}&nbsp;&nbsp;<Icon name="share" width="1rem" height="1rem" fill="rgb(255, 255, 255)"/></p>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <Footer menus={menuList} />
            </>
    )
}

// This function gets called at build time
export const getStaticPaths = async ({context}) => {
    // Call an external API endpoint to get data
    const historicalEventCategories = await serverGet('findBlogCategories', '/blogCategories');

    // Get the paths we want to pre-render based on posts
    const paths = historicalEventCategories.map((category) => ({
        params: { category: category.replace(/&/g, 'and').replace(/ /g, '-').toLowerCase() },
    }))
    //console.log("paths", paths);

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    // { fallback: 'blocking' } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: 'blocking' }
}

// This function gets called at build time
export const getStaticProps = async ({ context, params }) => {
    const source = 'blogs';
    const index = INDEX_FLAG;
    const url = HOST_NAME;

    // Call an external API endpoint to get data
    const menuList = await serverGet('findMenuList', '/menuList', [true]);

    const category = capitalizeFirstLetters(`${params.category}`.replace(/-/g, ' ').replace(/ and /g, ' & '));

    const historicalBlogData = await serverGet('findHistoricalBlogNames', '/blogHistoricalNames', [category]);
    //console.log(historicalBlogData);
    const hdr = capitalizeFirstLetters(`${params.category}`.replace(/-/g, ' ').replace(/ and /g, ' & ')) + ' - Blogs | taleofddh';

    // return the data
    return {
        props: {
            menuList,
            historicalBlogData,
            category,
            source,
            index,
            url,
            hdr
        },
        revalidate: PAGE_REVALIDATE_PERIOD * 48, // In seconds
    }
}

export default BlogCategories;