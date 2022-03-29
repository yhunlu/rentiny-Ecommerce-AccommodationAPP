import { HomeTwoTone, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { Viewer } from './../../../../lib/types';
import { LOG_OUT } from '../../../../lib/graphql/mutations';
import { LogOut as LogOutData } from './../../../../lib/graphql/mutations/LogOut/__generated__/LogOut';
import { useMutation } from '@apollo/client';
import {
    displayErrorMessage,
    displaySuccessNotification,
} from '../../../../lib/utils';

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

const { Item, SubMenu } = Menu;

const MenuItems = ({ viewer, setViewer }: Props) => {
    const [logOut] = useMutation<LogOutData>(LOG_OUT, {
        onCompleted: (data) => {
            if (data && data.logOut) {
                setViewer(data.logOut);
                displaySuccessNotification('You have successfully logged out!');
            }
        },
        onError: () => {
            displayErrorMessage(
                "Sorry! We weren't able to log you out. Please try again later!"
            );
        },
    });

    const handleLogOut = () => {
        logOut();
    };

    const subMenuLogin =
        viewer.id && viewer.avatar ? (
            <SubMenu key="profile_submenu" title={<Avatar src={viewer.avatar} />}>
                <Item key="/user">
                    <Link to={`/user/${viewer.id}`}>
                        <UserOutlined />
                        <span>Profile</span>
                    </Link>
                </Item>
                <Item key="/logout">
                    <div onClick={handleLogOut}>
                        <LoginOutlined />
                        <span>Logout</span>
                    </div>
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
