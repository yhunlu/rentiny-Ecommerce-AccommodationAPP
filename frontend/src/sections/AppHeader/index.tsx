import { Layout } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import logo from './assets/rentiny-logo.png';
import { MenuItems } from './components';
import { Viewer } from './../../lib/types';

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

const { Header } = Layout;

const AppHeader = ({ viewer, setViewer }: Props) => {
    return (
        <Header className="app-header">
            <div className="app-header__logo-search-section">
                <div className="app-header__logo">
                    <Link to="/">
                        <img src={logo} alt="logo" />
                    </Link>
                </div>
            </div>
            <div className="app-header__menu-section">
                <MenuItems viewer={viewer} setViewer={setViewer}/>
            </div>
        </Header>
    );
};

export default AppHeader;
