import { fetchUserTransactions } from '@/app/api/userApi';
import { UserTransactions } from '@/types/User';
import React, { useEffect, useState } from 'react';

export default function WithdrawalTransactions() {
  const [userTransactions, setUserTransactions] = useState<UserTransactions[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await fetchUserTransactions('withdrawal');
      console.log(response.data);
      setUserTransactions(response.data);
    } catch (error) {
      console.error('Error fetching user transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);


  if (loading) return <div className='mt-3'>Loading withdrawal transactions...</div>;
  return (
    <div className="bg-gray-100 p-2">
      <h2 className="mb-4 text-lg font-semibold">Transaction details</h2>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b px-4 py-3 font-medium text-gray-700">
                Date
              </th>
              <th className="border-b px-4 py-3 font-medium text-gray-700">
                Amount
              </th>
              <th className="border-b px-4 py-3 font-medium text-gray-700">
                Details
              </th>
              <th className="border-b px-4 py-3 font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {userTransactions.map((userTransaction, index) => (
              <tr>
                <td className="border-b px-4 py-3">{userTransaction?.created_at}</td>
                <td className="border-b px-4 py-3">${userTransaction?.amount}</td>
                <td className="border-b px-4 py-3">{userTransaction?.details}</td>
                <td className="border-b px-4 py-3">
                  <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-medium text-white">
                    Sent
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

