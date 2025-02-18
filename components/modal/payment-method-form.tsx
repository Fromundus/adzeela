import React, { useState, FormEvent, useRef } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeCardElementChangeEvent } from '@stripe/stripe-js'; // Import the correct type
import { StripeCardElement } from '@stripe/stripe-js';
import { Modal } from '../ui/modal';
import { createPaymentMethod } from '@/app/api/billing/stripePaymentApi';
import { toast } from '../ui/use-toast';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer_id: string;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
  customer_id
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const cardElementRef = useRef<any>(null);
  const [isCardValid, setIsCardValid] = useState(false);

  const handleChange = (event: StripeCardElementChangeEvent) => {
    setIsCardValid(event.complete);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !cardElementRef.current) {
      return;
    }

    setProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const { token, error: stripeError } = await stripe.createToken(cardElementRef.current);


      if (error) {
        setError(error);
      } else if (token) {
        console.log('Payment Method:', token);

        const payload = {
          id: token?.id,
          type: token?.type,
          stripe_customer_id: customer_id
        };

        console.log(payload)

       if (await createPaymentMethod(payload)) {
           toast({
             title: 'Payment method created successfully',
             description:
               'The payment method has been created.',
             variant: 'default'
           });
       } else {
        toast({
            title: 'Payment method creation failed',
            description:
              'There is an errpr creating payment method',
            variant: 'destructive'
          });
       }
      }
    } finally {
      setProcessing(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Payment Method"
      description="Add payment method"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 w-full max-w-md rounded-lg bg-white p-6 shadow-md"
      >
        <CardElement
          options={CARD_ELEMENT_OPTIONS}
          onChange={handleChange}
          onReady={(element) => {
            cardElementRef.current = element;
          }}
        />
        {error && <div className="mt-2 text-red-500">{error}</div>}
        {success && <div className="mt-2 text-green-500">Card Registered!</div>}
        <button
          type="submit"
          disabled={!stripe || !elements || !isCardValid || processing}
          className={`mt-4 rounded px-6 py-3 ${
            processing
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-blue-500 font-bold text-white hover:bg-blue-700'
          }`}
        >
          {processing ? 'Processing...' : 'Register Card'}
        </button>
      </form>
    </Modal>
  );
};

export default PaymentMethodModal;
