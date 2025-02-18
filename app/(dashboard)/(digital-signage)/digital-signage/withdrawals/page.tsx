'use client';
import {
  connectAccount,
  fetchConnectStatus
} from '@/app/api/billing/StripeConnectApi';
import { createPayout } from '@/app/api/billing/stripePayoutApi';
import { fetchUserBalance } from '@/app/api/userApi';
import { Icons } from '@/components/icons';
import PaymentMethodModal from '@/components/modal/payment-method-form';
import WithdrawalTransactions from '@/components/tables/withdrawal-tables/client';
import { toast } from '@/components/ui/use-toast';
import { UserBalance } from '@/types/User';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useEffect, useState } from 'react';

const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
);

const page = () => {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [connectedLoading, setConnectedLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);


  const [connecting, setConnecting] = useState(false);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetchConnectStatus();
      if (response) {
        setConnected(response.data?.isConnected);
      } else {
        console.error('Error checking connection status:');
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    } finally {
      setConnectedLoading(true);
    }
  };

  useEffect(() => {
    checkConnectionStatus();
    fetchBalance();
  }, []);

  const handleConnectAccount = async () => {
    if (connecting) return;

    setConnecting(true);

    try {
      const response = await connectAccount();

      if (response.data.accountLink && response.data.accountLink.url) {
        router.push(response.data.accountLink.url);
      } else {
        console.error(
          'Invalid response from /api/create-connect-account:',
          response
        );
      }
    } catch (err) {
      console.error('Error connecting account:', err);
    } finally {
      setConnecting(false);
    }
  };

  const [amount, setAmount] = useState(0); // Default amount
  // const [userBalance, setUserBalance] = useState<UserBalance>();
  const [userBalance, setUserBalance] = useState('');


  const [loadingBalance, setLoadingBalance] = useState(true);

  // const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleAmountChange = (e: any) => {
    setAmount(e.target.value);
  };

  const { data: session } = useSession();
  const user: any = session?.user;

  const handleWithdraw = async () => {
    if (!connected) {
      toast({
        title: 'Info',
        description: `Please connect to stripe`,
        variant: 'default'
      });
      return;
    }

    if(amount < 2){
      toast({
        title: 'Info',
        description: `Please input amount greater than 1`,
        variant: 'default'
      });
      return;
    }

      setSubmitLoading(true);

      const payload = {
        amount: amount
      };

      try {
        const payout = await createPayout(payload);
        if (payout.status === 200) {
          toast({
            title: 'Success',
            description: `Payout Success`,
            variant: 'default'
          });
        } else {
          toast({
            title: 'Error',
            description: `Failed payout`,
            variant: 'destructive'
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: `Failed payout`,
          variant: 'destructive'
        });
      } finally {
        setSubmitLoading(false);
        window.location.reload();
      }
  };

  const fetchBalance = async () => {
    try {
      const response = await fetchUserBalance();
      // console.log(response.data);
      setUserBalance(response.data);
    } catch (error) {
      console.error('Error fetching user balance:', error);
      // setError(error as string);
    } finally {
      setLoadingBalance(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  if (loadingBalance) return <div>Loading...</div>;
  return (
    // <ScrollArea className="h-full">
    <>
      <Elements stripe={stripePromise}>
        <PaymentMethodModal
          isOpen={open}
          customer_id={user?.stripe_customer_id}
          onClose={() => setOpen(false)}
        />
      </Elements>

      <div className="w-full flex-1 px-5">
        <div className="rounded-lg bg-white p-8 shadow-md">
          {/* Title Bar */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">WITHDRAWAL</h2>
          </div>

          {/* Balance */}
          <div className="flex justify-start gap-5">
            {/* <div className="mb-6">
              {loadingBalance ? (
                <div>Loading...</div> // Show loading message WHILE loading
              ) : userBalance ? ( // Check if userBalance exists AFTER loading is done
                <p className="text-3xl font-bold">
                  ${userBalance.total_revenue}
                </p> // Access current_balance ONLY when userBalance exists
              ) : (
                <p>No balance available.</p> // Handle the case where userBalance is null/undefined AFTER loading
              )}
              <button className="mt-2 text-sm text-gray-500 hover:underline">
                Total Revenue
              </button>
            </div> */}

            {/* <div className="mb-6">
            <p className="text-3xl font-bold">${0}</p>
            <button className="mt-2 text-sm text-gray-500 hover:underline">
              Total Withdrawal
            </button>
          </div> */}

            <div className="mb-6">
              {loadingBalance ? (
                <div>Loading...</div> // Show loading message WHILE loading
              ) : userBalance ? ( // Check if userBalance exists AFTER loading is done
                <p className="text-3xl font-bold">
                  ${userBalance}
                </p> // Access current_balance ONLY when userBalance exists
              ) : (
                <p>No balance available.</p> // Handle the case where userBalance is null/undefined AFTER loading
              )}
              <button className="mt-2 text-sm text-gray-500 hover:underline">
                Current Balance
              </button>
            </div>
          </div>

          {/* Payment Method */}
          {/* <div className="mb-6">
            <p className="font-medium">Transfer to</p>
            <div className="mt-2 flex-1 items-center">
              <div className="space-y-3">
  
              </div>
            </div>
          </div> */}

          {/* Amount Input */}
          <div className="mb-6">
            <label htmlFor="amount" className="block font-medium">
              Enter amount
            </label>
            <input
              type="number"
              id="amount"
              className="mt-2 w-full rounded border border-gray-300 px-3 py-2"
              value={amount}
              onChange={handleAmountChange}
              disabled={!connected}
            />
          </div>

          {/* Withdraw Button */}
          <div className='w-full flex justify-center'>
            <button
              className="w-1/4 rounded-lg bg-purple-500 py-3 font-medium text-white transition duration-300 hover:bg-purple-600"
              onClick={handleWithdraw}
              disabled={submitLoading}
            >
             <span className='flex justify-center'>
              Withdraw 
               {submitLoading && <Icons.spinner className="ml-2 animate-spin" />}
              </span>
            </button>

          </div>

          <div className="mt-3 text-center">
            {connectedLoading ? (
              !connected ? (
                <>
                  <span className="text-sm text-gray-500">
                    You dont have a connected account.
                  </span>
                  <button
                    className="ml-1 text-sm text-blue-500"
                    onClick={handleConnectAccount}
                    disabled={connecting}
                  >
                    {connecting ? 'Connecting...' : 'Connect Bank Account'}
                  </button>
                </>
              ) : (
                <p>Your bank account is connected!</p>
              )
            ) : (
              <p>Checking if you have a connected account...</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 px-5">
        <WithdrawalTransactions />
      </div>
    </>
    // </ScrollArea>
  );
};

export default page;
