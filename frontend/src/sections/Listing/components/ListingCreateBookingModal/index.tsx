import { Button, Divider, Modal, Typography } from 'antd';
import moment, { Moment } from 'moment';
import { KeyOutlined } from '@ant-design/icons';
import { displayErrorMessage, displaySuccessNotification, formatListingPrice } from '../../../../lib/utils';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useMutation } from '@apollo/client';
import { CREATE_BOOKING } from '../../../../lib/graphql/mutations';
import { CreateBooking as CreateBookingData, CreateBookingVariables } from './../../../../lib/graphql/mutations/CreateBooking/__generated__/CreateBooking';

interface Props {
  id: string;
  price: number;
  modalVisible: boolean;
  checkInDate: Moment;
  checkOutDate: Moment;
  setModalVisible: (modalVisible: boolean) => void;
  clearBookingData: () => void;
  // Promise because async function!
  handleListingRefetch: () => Promise<void>;
}

const { Paragraph, Text, Title } = Typography;

const ListingCreateBookingModal = ({
  id,
  price,
  modalVisible,
  checkInDate,
  checkOutDate,
  setModalVisible,
  clearBookingData,
  handleListingRefetch,
}: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [createBooking, { loading: createBookingLoading }] = useMutation<CreateBookingData, CreateBookingVariables>(CREATE_BOOKING, {
    onCompleted: () => {
      clearBookingData();
      handleListingRefetch();
      displaySuccessNotification("You've successfully booked the listing!", "Booking history can always be found in your User page.");
    },
    onError: (error) => {
      displayErrorMessage(`Sorry! We weren't able to book the listing. Please try again later; ${error.message}`);
    }
  });

  const daysBooked = checkOutDate.diff(checkInDate, 'days') + 1;
  const listingPrice = price * daysBooked;
  //   const rentinyFee = 0.05 * listingPrice;
  //   const totalPrice = listingPrice + rentinyFee;
  const totalPrice = listingPrice;

  const handleCreateBooking = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      return displayErrorMessage("Sorry! We weren't able to connect with Stripe. Please try again later.");
    }

    const card = elements.getElement(CardElement)!;
    const { token: stripeToken, error } = await stripe.createToken(card);

    if (stripeToken) {
      createBooking({
        variables: {
          input: {
            id,
            source: stripeToken.id,
            checkIn: moment(checkInDate).format("YYYY-MM-DD"),
            checkOut: moment(checkOutDate).format("YYYY-MM-DD"),
          },
        },
      });
    } else {
      displayErrorMessage(error && error.message ? error.message : "Sorry! We weren't able to process your payment. Please try again later.");
    }
  };

  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Title className="listing-booking-modal__intro-title">
            <KeyOutlined />
          </Title>
          <Title level={3} className="listing-booking-modal__intro-title">
            Book your trip
          </Title>
          <Paragraph>
            Enter your payment information to book the listing from the dates
            between{' '}
            <Text mark strong>
              {moment(checkInDate).format('MMMM Do YYYY')}
            </Text>
            {' and '}
            <Text mark strong>
              {moment(checkOutDate).format('MMMM Do YYYY')}
            </Text>
            , inclusive.
          </Paragraph>
        </div>
        <Divider />
        <div className="listing-booking-modal__charge-summary">
          <Paragraph>
            {formatListingPrice(price, false)} * {daysBooked} days ={' '}
            <Text strong>{formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
          <Paragraph className="listing-booking-modal__charge-summary-total">
            Total = <Text mark>{formatListingPrice(totalPrice, false)}</Text>
          </Paragraph>
        </div>

        <Divider />
        
        <div className="listing-booking-modal__stripe-card-section">
          <CardElement id="card-element" className="listing-booking-modal__stripe-card" options={{hidePostalCode: true}}/>
          <Button
            size="large"
            type="primary"
            className="listing-booking-modal__cta"
            loading={createBookingLoading}
            onClick={handleCreateBooking}
          >
            Book
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default ListingCreateBookingModal;
