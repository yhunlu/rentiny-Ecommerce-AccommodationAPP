import React from 'react';
import { Card, List, Skeleton } from 'antd';

import listingLoadingCardCover from '../../assets/listing-loading-card-cover.jpg';

const ListingsSkeleton = () => {

    //grepper Typescript listings-Skeleton in ant-design.
    const emptyData = [{}, {}, {}, {}, {}, {}, {}, {}];

    return (
        <div>
            <Skeleton paragraph={{ rows: 1 }} />
            <List
                grid={{
                    gutter: 8,
                    xs: 1,
                    sm: 2,
                    lg: 4,
                }}
                dataSource={emptyData}
                renderItem={() => (
                    <List.Item>
                        <Card
                            cover=
                            {
                                <div
                                    style={{ backgroundImage: `url(${listingLoadingCardCover})` }}
                                    className="Listings-skeleton__card-cover-img"
                                ></div>
                            }
                            loading
                            className="Listings-skeleton__card"
                        />
                    </List.Item>
                )}
            />
        </div>
    );
    //end grepper
};

export default ListingsSkeleton;
