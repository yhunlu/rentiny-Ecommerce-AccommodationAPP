import { HomeTwoTone, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { Viewer } from './../../../../lib/types';

interface Props {
    viewer: Viewer;
}

const { Item, SubMenu } = Menu;

const MenuItems = ({ viewer }: Props) => {
    const subMenuLogin =
        viewer.id && viewer.avatar ? (
            <SubMenu title={<Avatar src={viewer.avatar} />}>
                <Item key="/user">
                    <UserOutlined />
                    <span>Profile</span>
                </Item>
                <Item key="/logout">
                    <LoginOutlined />
                    <span>Logout</span>
                </Item>
            </SubMenu>
        ) : (
            <Item key="/login">
                <Link to="/login">
                    <Button type="primary" icon={<LoginOutlined />}>
                        Sign In
                    </Button>
                </Link>
            </Item>
        );

    return (
        <Menu mode="horizontal" selectable={false} className="menu">
            <Item key="/host">
                <Link to="/host">
                    <HomeTwoTone />
                    <span>Host</span>
                </Link>
            </Item>
            {subMenuLogin}
        </Menu>
    );
};

export default MenuItems;
