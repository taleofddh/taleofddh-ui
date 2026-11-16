import React, {useState, useEffect} from 'react';
import {get} from 'aws-amplify/api';
import {serverGet} from "../../common/server-config";
import {hasPermission} from "../../common/permissions";
import {onError} from "../../common/error";
import NoAccess from "../../components/no-access";
import {getSessionCookie} from "../../common/session";
import Title from "../../components/title";
import {HOST_NAME, INDEX_FLAG} from "../../common/constants";
import ResponsiveNavigation from "../../components/responsive-navigation";
import Header from "../../components/header";
import Navigation from "../../components/navigation";
import Loader from "../../components/loader";
import {postAuditEntry} from "../../common/common";
import Footer from "../../components/footer";
import BlogForm, {BLOG_CATEGORIES} from "../../components/blog-form";
const pageTitle = 'Blog Management';
const PERMISSION = 'blog:createOrUpdateBlog';
// Public list endpoint; no sign-in needed to read it
const loadCategory = async (category) => {
    const {body} = await get({
        apiName: 'findCategorizedBlogList',
        path: '/blogListCategorized/' + encodeURIComponent(category) + '/false',
        options: {headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}}
    }).response;
    const list = await body.json();
    return Array.isArray(list) ? list : [];
};
function BlogManagement({menuList, handleLogout, authenticated, permissions, source, index, url}) {
    const [blogs, setBlogs] = useState({});
    const [loading, setLoading] = useState(true);
    // {}: new blog (opens first, like Gallery); {category, name}: edit; null: search/edit list
    const [editing, setEditing] = useState({});
    const listing = editing === null;
    const allowed = hasPermission(permissions, PERMISSION);
    const ddhomeCountry = getSessionCookie('ddhomeCountry');
    useEffect(() => {
        postAuditEntry(
            {
                date: new Date(),
                hostName: window.location.hostname,
                countryCode: ddhomeCountry.country_code,
                ipAddress: ddhomeCountry.ip,
                page: 'blog management',
                message: 'Blog Management Page Accessed by ' + getSessionCookie("credential").sub
            }
        );
    }, [ddhomeCountry]);
    useEffect(() => {
        if (!allowed || !listing) {
            return;
        }
        const onLoad = async () => {
            setLoading(true);
            try {
                const lists = await Promise.all(BLOG_CATEGORIES.map(loadCategory));
                setBlogs(Object.fromEntries(BLOG_CATEGORIES.map((category, i) => [category, lists[i]])));
            } catch (e) {
                onError(e);
            }
            setLoading(false);
        };
        onLoad();
    }, [allowed, listing]);
    return (
        <>
            <ResponsiveNavigation menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Header country={ddhomeCountry} menus={menuList} isAuthenticated={authenticated} onLogout={handleLogout} />
            <Navigation menus={menuList} />
            <div className="boxouter">
                <div className="container">
                    <div className="contactusframe">
                        {!allowed ? (
                            <NoAccess title={pageTitle} />
                        ) : (
                            <>
                                <Title message={pageTitle} />
                                <div className="contactuscontainer">
                                    {editing ? (
                                        <BlogForm key={editing.name || 'new'}
                                                  target={editing.name ? editing : null}
                                                  source={source}
                                                  onDone={() => setEditing(null)} />
                                    ) : (
                                        <div className="blogmanagementlist">
                                            <div className="galleryfieldcontainer">
                                                <label className="gallerylink">
                                                    <div onClick={() => setEditing({})}>New Blog</div>
                                                </label>
                                            </div>
                                            {loading ? (
                                                <Loader loading={loading} />
                                            ) : BLOG_CATEGORIES.map((category) => (
                                                <div key={category} className="blogmanagementcategory">
                                                    <h3>{category}</h3>
                                                    {(blogs[category] || []).length === 0 ? (
                                                        <p>No blogs</p>
                                                    ) : (
                                                        <ul>
                                                            {blogs[category].map((item) => (
                                                                <li key={item.name + item.startDateTime}>
                                                                    <span>{item.header || item.title || item.name}</span>
                                                                    <button type="button" className="blogmanagementedit"
                                                                            onClick={() => setEditing({category: item.category, name: item.name})}>
                                                                        Edit
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer menus={menuList} />
        </>
    )
}
// This function gets called at build time
export const getStaticProps = async () => {
    const source = 'my-account';
    const index = INDEX_FLAG;
    const url = HOST_NAME;
    const menuList = await serverGet('findMenuList', '/menuList', [true]);
    return {
        props: {
            menuList,
            source,
            index,
            url
        },
    }
}
export default BlogManagement;
