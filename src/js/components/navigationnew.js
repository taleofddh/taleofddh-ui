'use strict';

import React from 'react';
import {Link, NavLink} from "react-router-dom";
import PropTypes from 'prop-types';
import Menu, { SubMenu, Item as MenuItem, Divider } from 'rc-menu';
import '../../scss/components/navigation.scss';

function Navigation(props) {
    return (
        <div className="menubar">
            <div className="container">
                <div className="tabwrapper">
                    <nav id="page-nav">
                        <CommonMenu
                            mode="horizontal"
                            openAnimation="slide-up"
                            triggerSubMenuAction="hover"
                        />
                    </nav>
                </div>
            </div>
        </div>
    )
}

function handleClick(info) {
    console.log(`clicked ${info.key}`);
    console.log(info);
}

function onOpenChange(value) {
    console.log('onOpenChange', value);
}

const children = [
    <SubMenu title={<span className="submenu-title-wrapper">Legal</span>} key="1">
        <SubMenu title={<span className="submenu-title-wrapper">Legal Documentation</span>} key="1-1">
            <MenuItem key="1-1-1">Will Writing</MenuItem>
            <MenuItem key="1-1-2">Power of Attorney</MenuItem>
            <MenuItem key="1-1-3">Notarisation</MenuItem>
            <MenuItem key="1-1-4">Succession Certificate</MenuItem>
            <MenuItem key="1-1-5">Legal Heir Certificate</MenuItem>
        </SubMenu>
    </SubMenu>,
    <SubMenu title={<span className="submenu-title-wrapper">Property</span>} key="2">
        <SubMenu title={<span className="submenu-title-wrapper">Property Buy & Sell</span>} key="2-1">
            <MenuItem key="2-1-1">Property Valuation</MenuItem>
            <MenuItem key="2-1-2">Agreement for Sale</MenuItem>
            <MenuItem key="2-1-3">Sale Deed Registration</MenuItem>
            <MenuItem key="2-1-4">Possesion Delay</MenuItem>
            <MenuItem key="2-1-5">TDS Certificate</MenuItem>
            <MenuItem key="2-1-6">Lower/Nil Tax Certificate from AO</MenuItem>
            <MenuItem key="2-1-7">Conveyancing</MenuItem>
        </SubMenu>
        <SubMenu title={<span className="submenu-title-wrapper">Property Rental</span>} key="2-2">
            <MenuItem key="2-2-1">Rental Search</MenuItem>
        </SubMenu>
    </SubMenu>,
    <SubMenu title={<span className="submenu-title-wrapper">Tax</span>} key="3">
        <SubMenu title={<span className="submenu-title-wrapper">Tax & Accounting</span>} key="3-1">
            <MenuItem key="3-1-1">Self-Assessment Income Tax Return</MenuItem>
            <MenuItem key="3-1-2">Company Corporation Tax Return</MenuItem>
            <MenuItem key="3-1-3">Capital Gains Tax Submission</MenuItem>
            <MenuItem key="3-1-4">PAYE Income Tax Refund</MenuItem>
            <MenuItem key="3-1-5">UK Secondment Tax Relief</MenuItem>
        </SubMenu>
    </SubMenu>,
    <SubMenu title={<span className="submenu-title-wrapper">Immigration</span>} key="4">
        <SubMenu title={<span className="submenu-title-wrapper">UK & EU Relationship</span>} key="4-1">
            <MenuItem key="4-1-1">UK Business Trading with EU</MenuItem>
            <MenuItem key="4-1-2">EU Citizen Staying in UK</MenuItem>
        </SubMenu>
    </SubMenu>,
    <MenuItem key="5">Suppliers</MenuItem>,
    <MenuItem key="5">Partner Login</MenuItem>,
];

function CommonMenu(props) {
    return (
        <div>

            <Menu
                onClick={handleClick}
                triggerSubMenuAction={props.triggerSubMenuAction}
                onOpenChange={onOpenChange}
                selectedKeys={['3']}
                mode={props.mode}
                openAnimation={props.openAnimation}
                defaultOpenKeys={props.defaultOpenKeys}
            >
                {children}
            </Menu>
        </div>
    )
}

CommonMenu.propTypes = {
    mode: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    triggerSubMenuAction: PropTypes.string,
    defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
    updateChildrenAndOverflowedIndicator: PropTypes.bool,
};

export default Navigation;