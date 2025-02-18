'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchPlans } from '@/app/api/billing/stripePlanApi';
import { Plan } from '@/types/Plan';
import { containsKeyword } from '@/components/utils/containsKeyword';
import { useSession } from 'next-auth/react';
import ConfirmDialog from '@/components/confirm-dialog';
import { toast } from '@/components/ui/use-toast';
import { cancelSubscription } from '@/app/api/billing/stripeSubscriptionApi';

const page = () => {
  const [data, setData] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const none = ['none', 'no', 'etc'];
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { data: session } = useSession();
  const user: any = session?.user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPlans();
        console.log(response.data);
        setData(response.data);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data]);

  const handleDelete = async () => {
    try {
      await cancelSubscription();

      toast({
        title: 'Success',
        description: '`You have successfully subscribed to plan free plan',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to subscribed',
        variant: 'destructive'
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <>
      <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={handleDelete}
        title="Confirmation"
        message="Are you sure you want to change to free plan? This will cancel your current subscription"
        button="Proceed"
        onClose={() => setIsDialogOpen(false)}
      />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-4 gap-4">
            {data.map((plan, index) => (
              <div
                key={index}
                className="flex flex-col border border-gray-200 bg-white p-4 text-center"
              >
                <h3 className="mb-2 text-lg font-bold text-gray-700">
                  {plan.name}
                </h3>
                <p className="text-2xl font-bold text-primary">
                  {plan?.amount}
                </p>
                <p className="text-xs text-gray-500">{plan?.interval + 'ly'}</p>

                <ul className="my-4 space-y-4 text-left text-sm">
                  {/* For promoters  */}
                  {user?.user_type === 'Promoter' ? (
                    <>
                      <li>
                        {!containsKeyword(
                          plan.plan_details?.max_tv_screens || '',
                          none
                        )
                          ? '✔ '
                          : '✖ '}
                        {plan.plan_details?.max_tv_screens}
                      </li>
                      <li>
                        {!containsKeyword(
                          plan.plan_details?.advertising || '',
                          none
                        )
                          ? '✔ '
                          : '✖ '}
                        {plan.plan_details?.advertising}
                      </li>
                      <li>
                        {!containsKeyword(
                          plan.plan_details?.playlist_creation || '',
                          none
                        )
                          ? '✔ '
                          : '✖ '}
                        {plan.plan_details?.playlist_creation}
                      </li>
                      <li>
                        {!containsKeyword(
                          plan.plan_details?.content_scheduling || '',
                          none
                        )
                          ? '✔ '
                          : '✖ '}
                        {plan.plan_details?.content_scheduling}
                      </li>
                      <li>
                        {!containsKeyword(
                          plan.plan_details?.additional_users || '',
                          none
                        )
                          ? '✔ '
                          : '✖ '}
                        {plan.plan_details?.additional_users}
                      </li>
                      <li>
                        {!containsKeyword(
                          plan.plan_details?.analytics_insights || '',
                          none
                        )
                          ? '✔ '
                          : '✖ '}
                        {plan.plan_details?.analytics_insights}
                      </li>
                      <li>
                        {!containsKeyword(
                          plan.plan_details?.support_details || '',
                          none
                        )
                          ? '✔ '
                          : '✖ '}
                        {plan.plan_details?.support_details}
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        {!containsKeyword(
                          plan.plan_details?.ads_limit || '',
                          none
                        )
                          ? '✔ '
                          : '✖ '}
                        {plan.plan_details?.ads_limit}
                      </li>
                      <li>
                        {!containsKeyword(
                          plan.plan_details?.advertising_areas || '',
                          none
                        )
                          ? '✔ '
                          : '✖ '}
                        {plan.plan_details?.advertising_areas}
                      </li>
                      <li>
                        {!containsKeyword(
                          plan.plan_details?.scheduling_options || '',
                          none
                        )
                          ? '✔ '
                          : '✖ '}
                        {plan.plan_details?.scheduling_options}
                      </li>
                      <li>
                        {!containsKeyword(
                          plan.plan_details?.playlist_creation || '',
                          none
                        )
                          ? '✔ '
                          : '✖ '}
                        {plan.plan_details?.playlist_creation}
                      </li>
                      <li>
                        {!containsKeyword(
                          plan.plan_details?.analytics_reporting || '',
                          none
                        )
                          ? '✔ '
                          : '✖ '}
                        {plan.plan_details?.analytics_reporting}
                      </li>
                      <li>
                        {!containsKeyword(
                          plan.plan_details?.priority_support || '',
                          none
                        )
                          ? '✔ '
                          : '✖ '}
                        {plan.plan_details?.priority_support}
                      </li>
                    </>
                  )}
                </ul>

                {plan.name.includes('Free') ? (
                  <div>
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className={`mt-auto rounded-md px-4 py-2 font-medium text-white ${
                      plan.is_current_plan
                        ? 'cursor-not-allowed bg-gray-400'
                        : 'bg-primary'
                    }`}
                    disabled={plan.is_current_plan}
                  >
                    {plan.is_current_plan ? 'CURRENT PLAN' : 'CHOOSE PLAN'}
                  </button>
                  </div>
                ) : (
                  <Link href={`/digital-signage/subscription-plans/${plan.id}`}>
                    <button
                      className={`mt-auto rounded-md px-4 py-2 font-medium text-white ${
                        plan.is_current_plan
                          ? 'cursor-not-allowed bg-gray-400'
                          : 'bg-primary'
                      }`}
                      disabled={plan.is_current_plan}
                    >
                      {plan.is_current_plan ? 'CURRENT PLAN' : 'CHOOSE PLAN'}
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
