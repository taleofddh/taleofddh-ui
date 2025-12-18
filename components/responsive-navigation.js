import React, { useState } from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import { slide as Menu } from 'react-burger-menu';
import Icon from "../common/icon";
import {useSessionContext} from "../common/session";
import {signOut} from "aws-amplify/auth";

function ResponsiveNavigation({menus, isAuthenticated, onLogout}) {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleStateChange = (state) => {
        setMenuOpen(state.isOpen);
    }

    const closeMenu = (clickEvent) => {
        setMenuOpen(false);
    }

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const handleLogout = async () => {
        onLogout();
    }

    return (
        <div className="mobilemenuwrapper" id="outer-container">
            <div className="right">
                <Menu right={true}
                      outerContainerId="outer-container"
                      width="280px"
                      burgerButtonClassName="burger-button"
                      burgerBarClassName="burger-bars"
                      crossButtonClassName="cross-button"
                      crossClassName="cross"
                      menuClassName="menu"
                      morphShapeClassName="morph-shape"
                      itemListClassName="item-list"
                      overlayClassName="overlay"
                      isOpen={menuOpen}
                      onStateChange={(state) => handleStateChange(state)}>
                    {menus.map((item, index) => {
                        return (
                            <label key={index} className="itemwrapper" onClick={closeMenu}>
                                <HamburgerMenuItem menu={item} isAuthenticated={isAuthenticated} onClick={closeMenu} onLogout={handleLogout}/>
                            </label>
                        )
                    })}
                </Menu>
            </div>
        </div>
    )

}

function HamburgerMenuItem({menu, isAuthenticated, onLogout}) {
    const router = useRouter();
    //var isActive = this.props.location.pathname === this.props.menu.link;
    var activeClassName;
    if(menu.link === '#') {
        activeClassName = '';
    } else {
        activeClassName = 'activeitem'
    }
    let exact = {};
    if(menu.link === '/') {
        exact = {"exact": true};
    }
    let visible = false;
    if(menu.type === 'NA') {
        visible = false;
    } else if(menu.condition === 'NA') {
        visible = true;
    } else if (menu.condition === 'No Auth' && !isAuthenticated) {
        visible = true;
    } else if (menu.condition === 'Auth' && isAuthenticated) {
        visible = true;
    } else {
        visible = false;
    }

    const handleClick = (event) => {
        event.preventDefault();
        onLogout() && onLogout(event)
    }

    return (
        visible && (<>
            {menu.external ? (
                <a href={menu.link} className="item" rel="noreferrer">
                    <p className="menuitem">
                        <span className="menuitemicon">
                            <Icon name={menu.icon} fill="#431C5D" />
                        </span>
                        <span className="menuitemname">
                            &nbsp;&nbsp;&nbsp;
                            {menu.name}
                        </span>
                    </p>
                </a>
            ) : (
                <>
                    {menu.name === 'Sign-out' ? (
                        <p className="menuitem">
                            <span className="menuitemicon">
                                <Icon name={menu.icon} fill="#FFFFFF" />
                            </span>
                            <span className="menuitemname" onClick={handleClick}>
                                &nbsp;&nbsp;&nbsp;
                                {menu.name}
                            </span>
                        </p>
                    ) : (
                        <Link href={menu.link} as={menu.link}>
                            <p className="menuitem">
                                <span className={menu.link === '/' && router.asPath === menu.link ||
                                    menu.link !== '/' && router.asPath.startsWith(menu.link) ? activeClassName : ''}>
                                    <span className="menuitemicon">
                                        <Icon name={menu.icon} fill="#FFFFFF" />
                                    </span>
                                    <span className="menuitemname">
                                        &nbsp;&nbsp;&nbsp;
                                        {menu.name}
                                    </span>
                                </span>
                            </p>
                        </Link>
                    )}

                {/*<Link href={menu.link} as={menu.link}>
                    <p className="menuitem">
                        <span className={menu.link === '/' && router.asPath === menu.link ||
                    menu.link !== '/' && router.asPath.startsWith(menu.link) ? 'item ' + activeClassName : 'item'}>
                            <span className="menuitemicon">
                                <Icon name={menu.icon} fill="#FFFFFF" />
                            </span>
                            {menu.name === 'Sign-out' ? (
                                <span className="menuitemname" onClick={handleClick}>
                                    &nbsp;&nbsp;&nbsp;
                                    {menu.name}
                                </span>
                            ) : (
                                <span className="menuitemname">
                                    &nbsp;&nbsp;&nbsp;
                                    {menu.name}
                                </span>
                            )}
                        </span>
                    </p>
                </Link>*/}
                </>
            )}
        </>)
    )

}

export default ResponsiveNavigation;