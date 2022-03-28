import { message, notification } from 'antd';

export const displaySuccessNotification = (
  message: string,
  description?: string
) => {
  notification.success({
    message,
    description,
    placement: 'top',
    style: {
      marginTop: 50,
    },
  });
};

export const displayErrorMessage = (error: string) => {
  return message.error(error);
};
