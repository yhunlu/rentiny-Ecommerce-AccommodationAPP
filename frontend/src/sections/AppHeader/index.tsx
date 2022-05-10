import { Input, Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import logo from './assets/rentiny-logo.png';
import { MenuItems } from './components';
import { Viewer } from './../../lib/types';
import { displayErrorMessage } from '../../lib/utils';

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

const { Header } = Layout;
const { Search } = Input;

const AppHeader = ({ viewer, setViewer }: Props) => {
    const [search, setSearch] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const onSearch = (value: string) => {
        const trimmedValue = value.trim();
        if (trimmedValue) {
            navigate(`/listings/${trimmedValue}`);
        } else {
            displayErrorMessage('Please enter a valid search term');
        }
    };

    useEffect(() => {
        const { pathname } = location;
        const pathnameSubStrings = pathname.split('/');

        if (!pathname.includes('/listings')) {
            setSearch('');
            return;
        }

        if (pathname.includes('/listings') && pathnameSubStrings.length === 3) {
            setSearch(pathnameSubStrings[2].replace("%20", " "));
            return;
        }
    }, [location]);

    return (
        <Header className="app-header">
            <div className="app-header__logo-search-section">
                <div className="app-header__logo">
                    <Link to="/">
                        <img src={logo} alt="logo" />
                    </Link>
                </div>
                <div className="app-header__search-input">
                    <Search
                        placeholder="Search a place you'll love to stay at"
                        enterButton
                        value={search}
                        onChange={(evt) => setSearch(evt.target.value)}
                        onSearch={onSearch}
                    />
                </div>
            </div>
            <div className="app-header__menu-section">
                <MenuItems viewer={viewer} setViewer={setViewer} />
            </div>
        </Header>
    );
};

export default AppHeader;
