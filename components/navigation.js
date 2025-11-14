import React from 'react';
import {useRouter} from "next/router";
import Link from 'next/link';
//import {NavLink} from "react-router-dom";
import Icon from "../common/icon";

function Navigation({menus}) {
    let menuList = menus.map((item, index) => {
        if(item.type === 'All') {
            return (
                <MenuItem key={index} menu={item} />
            )
        }
    });

    return (
        <div className="menubar">
            <div className="container">
                <div className="tabwrapper">
                    <nav id="page-nav">
                        <ul>
                            {menuList}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}

function MenuItem({menu}) {
    const router = useRouter();
    let activeClassName;
    if(menu.link === '#') {
        activeClassName = '';
    } else {
        activeClassName = 'activetab';
    }

    return (
        <li key={menu.id}>
            {menu.external ? (
                <a target="blank" href={menu.link} rel="noreferrer">
                    <p className="menuicon">
                        <Icon name={menu.icon} fill="#FFFFFF" />
                    </p>
                    {menu.name}
                </a>
            ) : (
                <Link href={menu.link} as={menu.link}>
                    <span className={router.asPath.startsWith(menu.link) ? activeClassName : ''}>
                        <p className="menuicon">
                            <Icon name={menu.icon} fill="#FFFFFF" />
                        </p>
                        {menu.name}
                    </span>
                </Link>
            )}
        </li>
    )
}

export default Navigation;