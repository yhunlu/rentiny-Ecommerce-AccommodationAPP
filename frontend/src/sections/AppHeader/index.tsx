import { Input, Layout } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const onSearch = (value: string) => {
            const trimmedValue = value.trim();
            if (trimmedValue) {
                navigate(`/listings/${trimmedValue}`);
            } else {
                displayErrorMessage('Please enter a valid search term');
            }
    }
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
                        placeholder="Search"
                        enterButton
                        onSearch={onSearch
                        }
                    />
                </div>
            </div>
            <div className="app-header__menu-section">
                <MenuItems viewer={viewer} setViewer={setViewer}/>
            </div>
        </Header>
    );
};

export default AppHeader;
