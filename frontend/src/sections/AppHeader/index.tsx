import { Layout } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import logo from './assets/rentiny-logo.png';

const { Header } = Layout;

const AppHeader = () => {
    return (
        <Header className="app-header">
            <div className="app-header__logo-search-section">
                <div className="app-header__logo">
                    <Link to="/">
                        <img src={logo} alt="logo" />
                    </Link>
                </div>
            </div>
        </Header>
    );
};

export default AppHeader;
