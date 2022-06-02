import { Avatar, Button, Card, Divider, Typography } from 'antd';
import { User as UserData } from './../../../../lib/graphql/queries/User/__generated__/User';

interface Props {
    user: UserData["user"];
    viewerIsUser: boolean;
}

const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_LndJ7chnMtnlb51VtNaWkdxsNgLQ6Fpy&scope=read_write`;
const { Paragraph, Text, Title } = Typography;

const UserProfile = ({ user, viewerIsUser }: Props) => {
    const redirectToStripe = () => {
        window.location.href = stripeAuthUrl;
    };

    const additionalDetailsSection = viewerIsUser ? (
        <>
            <Divider />
            <div className="user-profile__details">
                <Title level={4}>
                    Additional Details
                </Title>
                <Paragraph>
                    Interested in becoming a Rentiny Host? Register with your Stripe account!
                </Paragraph>
                <Button type="primary" className="user-profile__details-cta" onClick={redirectToStripe}>
                    Connect with Stripe
                </Button>
                <Paragraph type="secondary">
                    Rentiny uses <a href="https://stripe.com/en-US/connect" target="_blank" rel="noopener noreferrer">Stripe</a> to help transfer your earnings to your bank account.
                </Paragraph>
            </div>
        </>
    ) : null

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
                {additionalDetailsSection}
            </Card>
        </div>
    )
}

export default UserProfile