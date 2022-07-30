import { useMutation } from '@apollo/client';
import { Avatar, Button, Card, Divider, Tag, Typography } from 'antd';
import { DISCONNECT_STRIPE } from '../../../../lib/graphql/mutations';
import {
  displayErrorMessage,
  displaySuccessNotification,
  formatListingPrice,
} from '../../../../lib/utils';
import { User as UserData } from './../../../../lib/graphql/queries/User/__generated__/User';
import { DisconnectStripe as DisconnectStripeData } from '../../../../lib/graphql/mutations/DisconnectStripe/__generated__/DisconnectStripe';
import { Viewer } from './../../../../lib/types';

interface Props {
  user: UserData['user'];
  viewer: Viewer;
  viewerIsUser: boolean;
  setViewer: (viewer: Viewer) => void;
  handleUserRefetch: () => Promise<void>;
}

const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_LndJ7chnMtnlb51VtNaWkdxsNgLQ6Fpy&scope=read_write`;
const { Paragraph, Text, Title } = Typography;

const UserProfile = ({ user, viewer, viewerIsUser, setViewer, handleUserRefetch }: Props) => {

  const [disconnectStripe, { loading }] = useMutation<DisconnectStripeData>(
    DISCONNECT_STRIPE,
    {
      onCompleted: (data) => {
        if (data && data.disconnectStripe) {
          setViewer({ ...viewer, hasWallet: data.disconnectStripe.hasWallet });
          handleUserRefetch();
          displaySuccessNotification(
            "You've successfully disconnected your Stripe account.",
            "You'll have to reconnect with Stripe to continue to create listings."
          );
        }
      },
      onError: (error) => {
        displayErrorMessage(error.message);
      },
    }
  );

  const redirectToStripe = () => {
    window.location.href = stripeAuthUrl;
  };

  const additionalDetails = user.hasWallet ? (
    <>
      <Paragraph>
        <Tag color="green">Stripe Registered</Tag>
      </Paragraph>
      <Paragraph>
        Income Earned:{' '}
        <Text strong>
          {user.income ? formatListingPrice(user.income) : `$0`}
        </Text>
      </Paragraph>
      <Button
        type="primary"
        className="user-profile__details-cta"
        loading={loading}
        onClick={() => disconnectStripe()}
      >
        Disconnect Stripe
      </Button>
      <Paragraph type="secondary">
        By disconnecting, you won't be able to receive{' '}
        <Text strong> any further payments</Text>. This will prevent users from
        booking listings that you might have already created.
      </Paragraph>
    </>
  ) : (
    <>
      <Paragraph>
        Interested in becoming a Rentiny Host? Register with your Stripe
        account!
      </Paragraph>
      <Button
        type="primary"
        className="user-profile__details-cta"
        onClick={redirectToStripe}
      >
        Connect with Stripe
      </Button>
      <Paragraph type="secondary">
        Rentiny uses{' '}
        <a
          href="https://stripe.com/en-US/connect"
          target="_blank"
          rel="noopener noreferrer"
        >
          Stripe
        </a>{' '}
        to help transfer your earnings to your bank account.
      </Paragraph>
    </>
  );

  const additionalDetailsSection = viewerIsUser ? (
    <>
      <Divider />
      <div className="user-profile__details">
        <Title level={4}>Additional Details</Title>
        {additionalDetails}
      </div>
    </>
  ) : null;

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
  );
};

export default UserProfile;
