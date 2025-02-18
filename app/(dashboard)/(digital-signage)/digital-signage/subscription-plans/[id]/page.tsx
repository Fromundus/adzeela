'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Plan } from '@/types/Plan';
import { fetchPlanById } from '@/app/api/billing/stripePlanApi';
import { containsKeyword } from '@/components/utils/containsKeyword';
import { fetchPaymentMethodByCustomer } from '@/app/api/billing/stripeCustomerApi';
import { PaymentMethod } from '@/types/PaymentMethod';
import PaymentMethodModal from '@/components/modal/payment-method-form';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import { createSubscriptions } from '@/app/api/billing/stripeSubscriptionApi';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
);

const PaymentCard = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState<Plan>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod[]>([]);

  const none = ['none', 'no', 'etc'];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingPaymentMethod, setLoadingPaymentMethod] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const router = useRouter();

  const onConfirm = async () => {

    
    const payload = {
      payment_method_id: selectedPaymentMethod,
      customer_id: user?.stripe_customer_id,
      price_id: plan?.price_id
    };


    console.log(payload)

    try {
        await createSubscriptions(payload);
        toast({
          title: 'Success',
          description: `You have successfully subscribed to plan ${plan?.name}`,
          variant: 'default'
        });
      router.push('/digital-signage/subscription-plans');

    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to subscribed. ${error}`,
        variant: 'destructive'
      });
    }
  };


  const handleChangePayment = (event:  any) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const { data: session } = useSession();
  const user: any = session?.user;

  const fetchPlanData = async () => {
    try {
      const stringId = String(id);
      const response = await fetchPlanById(stringId);
      setPlan(response.data);
      // console.log(response.data)
    } catch (error) {
      console.error('Error fetching plan:', error);
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const stringId = user?.stripe_customer_id;
      const response = await fetchPaymentMethodByCustomer(stringId);
      // console.log(response.data);
      setPaymentMethod(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error as string);
      setPaymentMethod([]);
    } finally {
      setLoadingPaymentMethod(false);
    }
  };

  useEffect(() => {
    fetchPlanData();
    fetchPaymentMethods();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <>
      <Elements stripe={stripePromise}>
        <PaymentMethodModal isOpen={open} customer_id={user?.stripe_customer_id} onClose={() => setOpen(false)} />
      </Elements>

        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-lg">
            <div className="rounded-t-2xl bg-primary p-6 text-white">
              <h1 className="text-4xl font-bold">
                ${plan?.amount}
                <span className="text-xl font-normal">/{plan?.interval}</span>
              </h1>
              <p className="mt-1 text-sm">$199/year</p>
              <h2 className="mt-4 text-lg font-semibold">{plan?.name}</h2>
              <p className="mt-1 text-sm">
                Enjoy complete access to UnifiedHR Shield features for a full
                year.
              </p>
              <div className="mt-4">
                <h3 className="mb-2 font-semibold">This plan gets</h3>
                <ul className="space-y-2">
                               {/* For promoters  */}
                             {user?.user_type === 'Promoter' ? ( 
                               <>
                               <li>{!containsKeyword(plan?.plan_details?.max_tv_screens || '', none) ? "✔ " : "✖ "}{plan?.plan_details?.max_tv_screens}</li>
                               <li>{!containsKeyword(plan?.plan_details?.advertising || '', none) ? "✔ " : "✖ "}{plan?.plan_details?.advertising}</li>
                               <li>{!containsKeyword(plan?.plan_details?.playlist_creation || '', none) ? "✔ " : "✖ "}{plan?.plan_details?.playlist_creation}</li>
                               <li>{!containsKeyword(plan?.plan_details?.content_scheduling || '', none) ? "✔ " : "✖ "}{plan?.plan_details?.content_scheduling}</li>
                               <li>{!containsKeyword(plan?.plan_details?.additional_users || '', none) ? "✔ " : "✖ "}{plan?.plan_details?.additional_users}</li>
                               <li>{!containsKeyword(plan?.plan_details?.analytics_insights || '', none) ? "✔ " : "✖ "}{plan?.plan_details?.analytics_insights}</li>
                               <li>{!containsKeyword(plan?.plan_details?.support_details || '', none) ? "✔ " : "✖ "}{plan?.plan_details?.support_details}</li>
                               </>
                             )
                             :
                             (
                               <>
                               <li>{!containsKeyword(plan?.plan_details?.ads_limit || '', none) ? "✔ " : "✖ "}{plan?.plan_details?.ads_limit}</li>
                               <li>{!containsKeyword(plan?.plan_details?.advertising_areas || '', none) ? "✔ " : "✖ "}{plan?.plan_details?.advertising_areas}</li>
                               <li>{!containsKeyword(plan?.plan_details?.scheduling_options || '', none) ? "✔ " : "✖ "}{plan?.plan_details?.scheduling_options}</li>
                               <li>{!containsKeyword(plan?.plan_details?.playlist_creation || '', none) ? "✔ " : "✖ "}{plan?.plan_details?.playlist_creation}</li>
                               <li>{!containsKeyword(plan?.plan_details?.analytics_reporting || '', none) ? "✔ " : "✖ "}{plan?.plan_details?.analytics_reporting}</li>
                               <li>{!containsKeyword(plan?.plan_details?.priority_support || '', none) ? "✔ " : "✖ "}{plan?.plan_details?.priority_support}</li> 
                               </>
                             )}
                </ul>
              </div>
            </div>

            <div className="p-6">
              <h3 className="mb-4 font-semibold text-gray-700">
                Payment Methods
              </h3>
              <div className="space-y-3">
                {loadingPaymentMethod ? (
                  <div>Loading...</div>
                ) : paymentMethod.length > 0 ? (
                  paymentMethod.map((paymentMethod, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-gray-300 p-3"
                    >
                      <div className="flex items-center">
                        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                          {paymentMethod?.card?.display_brand}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            *****{paymentMethod?.card?.last4}
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires {paymentMethod?.card?.exp_month}/
                            {paymentMethod?.card?.exp_year}
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        value={paymentMethod?.id}
                        checked={selectedPaymentMethod === paymentMethod?.id} // Make it a controlled component
                        onChange={handleChangePayment}

                        className="form-radio text-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  ))
                ) : (
                  <div>No payment method available</div>
                )}
              </div>

              <button
                onClick={() => setOpen(true)}
                className="mt-4 w-full rounded border border-purple-500 py-1 text-purple-500 hover:text-purple-600"
              >
                Add payment or debit card
              </button>
              <button 
                onClick={() => onConfirm()}
              
              className="mt-4 w-full rounded-lg bg-primary py-3 font-semibold text-white hover:bg-purple-700">
                Pay Now
              </button>

              <p className="mt-4 text-center text-xs text-gray-500">
                Payment is held by UnifiedHR until the task is completed to your
                satisfaction.{' '}
                <a href="#" className="text-purple-500 underline">
                  View Terms
                </a>
              </p>
            </div>
          </div>
        </div>
    </>
  );
};

export default PaymentCard;
