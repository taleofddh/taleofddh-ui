import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {API} from "aws-amplify";
import {MEDIA_HOST, MONTH_NAMES} from "../common/constants";
import {postAuditEntry} from "../common/common";
import {useIndex} from '../common/hook'
import {getSessionCookie} from "../common/session";
import MetaTag from "../components/metatag";
import Title from "../components/title";
import Loader from "../components/loader";
import Icon from "../common/icon";
import ResponsiveNavigation from "../components/responsivenavigation";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

const pagetitle = 'Blog'
const source = 'blog';

function Blog({ menuList, handleLogout, data }) {
    const router = useRouter();
    const index = useIndex();
    const [url, setUrl] = useState('');
    const ddhomeCountry = getSessionCookie('ddhomeCountry');

    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip_address,
                page: 'blog',
                message: 'Blog Page Accessed'
            }
        );
    }, [ddhomeCountry])

    const handleClick = async (clickEvent, object) => {
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
    }

    return (
        <>
            <ResponsiveNavigation menus={menuList} />
            <Header country={ddhomeCountry} menus={menuList} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <MetaTag page={source} index={index} url={url} />
            <div className="boxouter">
                <div className="container">
                    <div className="blogframe">
                        <Title message={pagetitle} />
                        <ul className="bloggroup">
                            {data.map((item, index) => (
                                <li key={index} className="blogitem" onClick={(e) => handleClick(e, item)}>
                                    <div style={{float: 'left'}}>
                                        <p className="blogheader">{item.header}</p>
                                        <div className="blogpiccontrol">
                                            <img src={MEDIA_HOST + '/images/mobile/' + item.titlePhoto} alt={item.titlePhoto} />
                                        </div>
                                        <div className="blogsummary">
                                            <p className="blogauthor">{item.category +' ' + source + ' by ' + item.author + ' on ' + new Date(item.endDate).getDate() + " " + MONTH_NAMES[new Date(item.endDate).getMonth()] + ", " + new Date(item.endDate).getFullYear()}</p>
                                            <p className="blogtitle">{item.title}</p>
                                            <p className="blogshare"><Icon name="view" width="1rem" height="1rem"/>&nbsp;&nbsp;{item.viewCount}&nbsp;&nbsp;<Icon name="share" width="1rem" height="1rem"/></p>
                                        </div>
                                    </div>
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
export const getStaticProps = async (context) => {
    // Call an external API endpoint to get data
    let res = await API.get(
        'findMenuList',
        '/menuList/true',
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );
    const menuList = await res.data;

    res = await API.get(
        'findBlogList',
        '/blogList',
        {
            response: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );
    const data = await res.data;

    // return the data
    return {
        props: {
            menuList,
            data
        },
    }
}


export default Blog;