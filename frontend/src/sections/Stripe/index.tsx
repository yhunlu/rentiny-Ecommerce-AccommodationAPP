import { useMutation } from '@apollo/client';
import { Layout, Spin } from 'antd';
import React, { useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CONNECT_STRIPE } from '../../lib/graphql/mutations';
import { displaySuccessNotification } from '../../lib/utils';
import {
    ConnectStripe as ConnectStripeData,
    ConnectStripeVariables,
} from './../../lib/graphql/mutations/ConnectStripe/__generated__/ConnectStripe';
import { Viewer } from './../../lib/types';

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;

const Stripe = ({ viewer, setViewer }: Props) => {
    const [connectStripe, { data, loading, error }] = useMutation<
        ConnectStripeData,
        ConnectStripeVariables
    >(CONNECT_STRIPE, {
        onCompleted: (data) => {
            if (data && data.connectStripe) {
                setViewer({ ...viewer, hasWallet: data.connectStripe.hasWallet });
                displaySuccessNotification(
                    "You've successfully connected your Stripe account!",
                    'You can now begin to create listings in the Host page.'
                );
            }
        },
    });

    console.log(data);

    const navigate = useNavigate();

    const connectStripeRef = useRef(connectStripe);

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get('code');

        if (code) {
            connectStripeRef.current({
                variables: {
                    input: { code },
                },
            });
        }
        else {
            navigate("/login");
        }
    }, [navigate]);

    if (data && data.connectStripe) {
        return <Navigate to={`/user/${viewer.id}`} replace />;
    }

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

    return null;
};

export default Stripe;
