'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { User } from '@/types/User';
import ReactSelect from '../ui/r-select';
import { updateUser } from '@/app/api/userApi';
import { Icons } from '../icons';
import { useToast } from '../ui/use-toast';

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  address: z.any(),
  phone: z.any(),
  // address: z.string().nonempty('Address is required'),
  email: z.string().email('Enter a valid email address'),
  // phone: z.string().nonempty('Phone number is required'),
  access: z.any(),
  subscriptions: z.any()
});

type AccDetailsFormValue = z.infer<typeof formSchema>;

const defaultValues = {
  name: '',
  address: '',
  email: '',
  phone: '',
  access: '',
  subscriptions: ''
};

const accessOptions = [
  { name: 'Admin', id: 1 },
  { name: 'User', id: 2 }
];

const subscriptionOptions = [
  {
    id: 1,
    name: 'Digital Signage'
  },
  {
    id: 2,
    name: 'Online Marketing'
  },
  {
    id: 3,
    name: 'Work Place'
  },
  {
    id: 4,
    name: 'Queueing System'
  }
];

const AccountDetails = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AccDetailsFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const { handleSubmit } = form;

  const onSubmit = (data: AccDetailsFormValue) => {
    // console.log('wtF dude', data);
    setLoading(true);

    updateUser(user.id, data)
      .then((res) => {
        toast({
          title: 'Success',
          description: 'User updated successfully',
          variant: 'default'
        });

        setLoading(false);
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err?.message,
          variant: 'destructive'
        });

        setLoading(false);
      });
  };

  useEffect(() => {
    // add user data to form
    if (user) {
      form.setValue('name', user.name);
      form.setValue('address', user.address);
      form.setValue('email', user.email);
      form.setValue('phone', user.phone);
      form.setValue('access', user.roles);
      form.setValue('subscriptions', user.subscriptions);
    }
  }, [user]);

  return (
    <div className="">
      <div className="mb-5 flex justify-between">
        <p className="text-primary">Account details</p>
        <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
          Save
          {loading && <Icons.spinner className="ml-2 animate-spin" />}
        </Button>
      </div>
      <Card>
        <Form {...form}>
          <form
            id="accDetailsForm"
            // onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4 p-6"
          >
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
              <div>
                <div className="mt-2">
                  <Image
                    src="/media/images/default.png"
                    alt="Profile picture"
                    //   className="h-24 w-24"
                    //   fill="true"
                    width={300}
                    height={300}
                  />
                </div>
                <div>
                  <a href="#" className="text-xs text-primary">
                    Change{' '}
                  </a>
                </div>
              </div>
              <div className="col-span-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your Firstname..."
                              //   disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your Address..."
                              //   disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your Email..."
                              //   disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your Phone..."
                              //   disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="access"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Access</FormLabel>
                          <FormControl>
                            <ReactSelect
                              isDisabled={user.roles.find(
                                (role: any) => role.name !== 'Admin'
                              )}
                              // disabled={user.roles.find(
                              //   (role) => role.name !== 'Admin'
                              // )}
                              {...field}
                              id="access"
                              name="access"
                              options={accessOptions}
                              getOptionLabel={(option: any) => option.name}
                              getOptionValue={(option: any) => option.id}
                              // defaultValue="Admin"
                              className="w-full"
                            />
                            {/* <Input
                              type="text"
                              placeholder="Enter your Phone..."
                              //   disabled={loading}
                              {...field}
                            /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="subscriptions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subscriptions</FormLabel>
                          <FormControl>
                            <ReactSelect
                              isDisabled={user.roles.find(
                                (role: any) => role.name !== 'Admin'
                              )}
                              {...field}
                              id="subscriptions"
                              name="subscriptions"
                              isMulti
                              options={subscriptionOptions}
                              getOptionLabel={(option: any) => option.name}
                              getOptionValue={(option: any) => option.id}
                              // defaultValue="Admin"
                              className="w-full"
                            />
                            {/* <Input
                              type="text"
                              placeholder="Enter your Phone..."
                              //   disabled={loading}
                              {...field}
                            /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your Lastname"
                      //   disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </form>
        </Form>
        {/* <div className="grid grid-cols-3 p-5">
          <div>Image</div>
          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-primary">First name</label>
                <input
                  type="text"
                  className="w-full rounded border border-gray-300 p-2"
                />
              </div>
              <div>
                <label className="text-primary">Last name</label>
                <input
                  type="text"
                  className="w-full rounded border border-gray-300 p-2"
                />
              </div>
              <div className="col-span-2">
                <label className="text-primary">Address</label>
                <input
                  type="text"
                  className="w-full rounded border border-gray-300 p-2"
                />
              </div>
            </div>
          </div>
        </div> */}
      </Card>
    </div>
  );
};

export default AccountDetails;
