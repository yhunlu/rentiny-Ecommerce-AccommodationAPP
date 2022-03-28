import { Alert } from 'antd';
import React from 'react';

interface Props {
    message?: string;
    description?: string;
}

const ErrorBanner = ({
    message = 'Something went wrong :(',
    description = 'Look like something went wrong. Please check your connection or try again later.',
}: Props) => {
    return (
        <Alert banner closable message={message} description={description} type="error" showIcon className="error-banner" />
    );
};

export default ErrorBanner;
