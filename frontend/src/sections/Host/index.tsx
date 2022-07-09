import {
  Button,
  Form,
  Input,
  InputNumber,
  Layout,
  Radio,
  Typography,
  Upload,
} from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { Viewer } from '../../lib/types';
import { Link, Navigate } from 'react-router-dom';
import { ListingType } from '../../lib/graphql/globalTypes';
import {
  BankTwoTone,
  CloudUploadOutlined,
  HomeTwoTone,
  LoadingOutlined,
} from '@ant-design/icons';
import {
  displayErrorMessage,
  displaySuccessNotification,
} from '../../lib/utils';
import { FormEvent, useState } from 'react';
import { useMutation } from '@apollo/client';
import { HOST_LISTING } from '../../lib/graphql/mutations';
import {
  HostListing as HostListingData,
  HostListingVariables,
} from './../../lib/graphql/mutations/HostListing/__generated__/HostListing';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Item } = Form;

interface Props {
  viewer: Viewer;
}

const beforeImageUpload = (file: File) => {
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/jpg' ||
    file.type === 'image/png';
  if (!isJpgOrPng) {
    displayErrorMessage("You're only able to upload valid JPG or PNG files!");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    displayErrorMessage(
      "You're only able to upload valid image files of under 2MB in size!"
    );
    return false;
  }
  return isJpgOrPng && isLt2M;
};

const getBase64Value = (
  img: File | Blob,
  callback: (imageBase64Value: string) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    callback(reader.result as string);
  };
};

const Host = ({ viewer }: Props) => {
  const [form] = Form.useForm();
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

  const [hostListing, { loading: hostLoading, data: hostData }] = useMutation<
    HostListingData,
    HostListingVariables
  >(HOST_LISTING, {
    onCompleted: () => {
      displaySuccessNotification('You have successfully created your listing!');
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to create your listing. Please try again later."
      );
    },
  });

  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === 'uploading') {
      setImageLoading(true);
      return;
    }

    if (file.status === 'done' && file.originFileObj) {
      getBase64Value(file.originFileObj, (imageBase64Value) => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };

  const handleHostListing = async (e: FormEvent) => {
    // e.preventDefault();

    form
      .validateFields()
      .then((values) => {
        const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.postalCode}`;

        const input = {
          ...values,
          address: fullAddress,
          image: imageBase64Value,
          price: values.price * 100,
        };

        delete input.city;
        delete input.state;
        delete input.postalCode;

        hostListing({
          variables: {
            input,
          },
        });
      })
      .catch((errors) => {
        displayErrorMessage('Please fill in all required fields');
        console.log(errors);
      });
  };

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={4} className="host__form-title">
            You'll have to be signed in and connected with Stripe to host a
            listing!
          </Title>
          <Text type="secondary">
            We only allow users who've signed in to our application and have
            connected with Stripe to host new listings. You can sign in at the{' '}
            <Link to="/login">LOGIN</Link> page and connect with Stripe shortly
            after.
          </Text>
        </div>
      </Content>
    );
  }

  if (hostLoading) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Please wait!
          </Title>
          <Text type="secondary">we're creating your listing now.</Text>
        </div>
      </Content>
    );
  }

  if (hostData && hostData.hostListing) {
    return <Navigate to={`/listing/${hostData.hostListing.id}`} />;
  }

  return (
    <Content className="host-content">
      <Form layout="vertical" form={form} onFinish={handleHostListing}>
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Hi! Let's get started listing your place.
          </Title>
          <Text type="secondary">
            In this form, we'll collect some basic and additional information
            about your listing.
          </Text>
        </div>

        <Form.Item
          label="Accommodation Type"
          name="type"
          rules={[{ required: true, message: 'Please select a home type!' }]}
        >
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <BankTwoTone /> <span>Apartment</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <HomeTwoTone /> <span>House</span>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Item
          label="Max # of Guests"
          name="numOfGuests"
          rules={[
            {
              required: true,
              message: 'Please enter a maximum number of guests!',
            },
          ]}
        >
          <InputNumber min={1} placeholder="4" />
        </Item>

        <Item
          label="Title"
          extra="Max character count of 45"
          name="title"
          rules={[
            {
              required: true,
              message: 'Please enter a title for your listing!',
            },
          ]}
        >
          <Input
            maxLength={45}
            placeholder="The iconic and luxurious Bel-Air mansion"
          />
        </Item>

        <Item
          label="Description of listing"
          extra="Max character count of 400"
          name="description"
          rules={[
            {
              required: true,
              message: 'Please enter a description for your listing!',
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            maxLength={400}
            placeholder="Modern, clean, and iconic home of the Fresh Price. Situated in the heart of Bel-Air, Los Angeles."
          />
        </Item>

        <Item
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: 'Please enter an address for your listing!',
            },
          ]}
        >
          <Input placeholder="251 North Bristol Avenue" />
        </Item>

        <Item
          label="City/Town"
          name="city"
          rules={[
            {
              required: true,
              message: 'Please enter a city or town for your listing!',
            },
          ]}
        >
          <Input placeholder="Los Angeles" />
        </Item>

        <Item
          label="State/Province"
          name="state"
          rules={[
            {
              required: true,
              message: 'Please enter a state or province for your listing!',
            },
          ]}
        >
          <Input placeholder="California" />
        </Item>

        <Item
          label="Zip/Postal Code"
          name="postalCode"
          rules={[
            {
              required: true,
              message: 'Please enter a zip or postal code for your listing!',
            },
          ]}
        >
          <Input placeholder="Please enter a zip code for your listing!" />
        </Item>

        <Item
          label="Image"
          extra="Images have to be under 2MB in size and of type JPEG or PNG"
          name="image"
          rules={[
            {
              required: true,
              message: 'Please upload an image for your listing!',
            },
          ]}
        >
          <div className="host__form-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              action="//www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}
            >
              {imageBase64Value ? (
                <img
                  src={imageBase64Value}
                  alt="Listing"
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <div>
                  {imageLoading ? <LoadingOutlined /> : <CloudUploadOutlined />}
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Item>

        <Item
          label="Price"
          extra="All prices in $USD/day"
          name="price"
          rules={[
            {
              required: true,
              message: 'Please enter a price for your listing!',
            },
          ]}
        >
          <InputNumber min={0} placeholder="120" />
        </Item>

        <Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Item>
      </Form>
    </Content>
  );
};

export default Host;
