import { Alert, Divider, Skeleton } from 'antd';
import React from 'react';
import './styles/ListingSkeleton.css';

type Props = {
  title: string;
  error?: boolean;
};

const ListingsSkeleton = ({ title, error = false }: Props) => {
  const errorAlert = error ? (
    <Alert
      type="error"
      message="Something went wrong. Please try again later."
    />
  ) : null;

  return (
    <div className="listings-skeleton">
      {error ? (
        errorAlert
      ) : (
        <>
          <h2>{title}</h2>
          <Skeleton active paragraph={{ rows: 1 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 1 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 1 }} />
        </>
      )}
    </div>
  );
};

export default ListingsSkeleton;
