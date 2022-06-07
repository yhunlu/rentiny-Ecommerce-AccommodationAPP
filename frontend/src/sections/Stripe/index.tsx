import { useMutation } from '@apollo/client'
import { Layout, Spin } from 'antd'
import React, { useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom';
import { CONNECT_STRIPE } from '../../lib/graphql/mutations'
import { ConnectStripe as ConnectStripeData, ConnectStripeVariables } from './../../lib/graphql/mutations/ConnectStripe/__generated__/ConnectStripe';
import { Viewer } from './../../lib/types';

interface Props {
    viewer: Viewer;
}

const { Content } = Layout;

const Stripe = ({ viewer }: Props) => {
    const [connectStripe, { data, loading, error }] = useMutation<ConnectStripeData, ConnectStripeVariables>(CONNECT_STRIPE);

    const connectStripeRef = useRef(connectStripe)

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get('code');

        if (code) {
            connectStripeRef.current({
                variables: {
                    input: { code },
                },
            });
        }
    }, []);

    if (loading) {
        return (
            <Content className="stripe">
                <Spin size="large" tip="Connecting your Stripe account..." />
            </Content>
        );
    }

    if (error) {
        return <Navigate to={`/user/${viewer.id}?stripe_error=true`} replace />;
    }
}

export default Stripe;