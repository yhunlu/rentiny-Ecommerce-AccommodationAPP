import { Avatar, Card, Divider, Typography } from 'antd';
import React from 'react'
import { User as UserData } from './../../../../lib/graphql/queries/User/__generated__/User';

interface Props {
    user: UserData["user"];
}

const { Paragraph, Text, Title } = Typography;

const UserProfile = ({ user }: Props) => {
  return (
    <div className="user-profile">
        <Card className="user-profile__card">
            <div className="user-profile__avatar">
                <Avatar size={100} src={user.avatar} />
            </div>
            <Divider />
            <div className="user-profile__details">
                <Title level={4}>Details</Title>
                <Paragraph>
                    Name: <Text strong>{user.name}</Text>
                </Paragraph>
                <Paragraph>
                    Contact: <Text strong>{user.contact}</Text>
                </Paragraph> 
            </div>
        </Card>
    </div>
  )
}

export default UserProfile