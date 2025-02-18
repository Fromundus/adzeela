import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

import ReactSelect from '@/components/ui/r-select';
import { createUser, fetchUserById, updateUser } from '@/app/api/userApi';
import { Card } from '@/components/ui/card';
import { User } from '@/types/User';

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  username: z.string().nonempty('User name is required'),
  address: z.any(),
  phone: z.any(),
  // address: z.string().nonempty('Address is required'),
  email: z.string().email('Enter a valid email address'),
  // phone: z.string().nonempty('Phone number is required'),
  access: z.any(),
  subscriptions: z.any(),
  roles: z.any(),
  usertype: z.string().nonempty('user type is required'),


});

type UserFormValue = z.infer<typeof formSchema>;


interface UserInfoFormProps {
  mode: 'add' | 'edit';
  userId?: number;
  user: User | null
}

const defaultValues = {
  username: '',
  name: '',
  address: '',
  email: '',
  phone: '',
  access: '',
  subscriptions: '',
  usertype: ''
};

const UserInfoForm: React.FC<UserInfoFormProps> = ({

  mode,
  userId,
  user

}) => {

  const methods = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);


  // TODO this options should be retrieve in the backend or transfer to seperate file

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
  
  
  useEffect(() => {
      if (mode === 'edit' && userId) {
        const fetchData = async () => {
          try {
            const response = await fetchUserById(userId);
            const userData = response.data.data;
  
            console.log(userData.user_types?.user_type)
            // console.log(subscriptionOptions);
            methods.reset({
              name: userData.name ?? '',
              username: userData.username ?? '',
              email: userData.email ?? '',
              phone: userData.phone ?? '',
              address: userData.address ?? '',
              subscriptions: userData.subscriptions,
              usertype: userData?.user_types?.user_type ?? '',
              access: accessOptions.find(option => option.name === userData?.roles[0]),
            
            });

  
          } catch (error: any) {
            toast({
              title: 'Error',
              description: `Failed to load user data: ${error.message}`,
              variant: 'destructive'
            });
          }
        };
  
        fetchData();
      }
    }, [mode, userId]);


  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
      console.log(data)
      if (mode === 'add') {
        await createUser(data);
        toast({
          title: 'Success',
          description: 'User created successfully!',
          variant: 'default'
        });
        router.push('/admin/users');
      } else if (mode === 'edit' && userId) {
        await updateUser(userId, data);
        toast({
          title: 'Success',
          description: 'User updated successfully!',
          variant: 'default'
        });
        router.push('/admin/users');
      }
    } catch (error:any) {
      toast({
        title: 'Error',
        description: error.message? error.message: 'There was an error saving the user.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
   <>
    <div className="mt-4">
                <p className="mb-3 text-primary">
                {mode === 'add' ? 'Create User' : 'Edit User'}
                </p>
    </div>

    <Card>
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full space-y-4 p-6">
        <div className="grid space-x-3 space-y-3 xl:grid-cols-3">
        
        <div className="col-span-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FormField
                      control={methods.control}
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
                      control={methods.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your username..."
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
                      control={methods.control}
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
                      control={methods.control}
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
                      control={methods.control}
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
                      control={methods.control}
                      name="access"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Access</FormLabel>
                          <FormControl>
                            <ReactSelect
                              isDisabled={user?.roles?.find(
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
                      control={methods.control}
                      name="subscriptions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subscriptions</FormLabel>
                          <FormControl>
                             <ReactSelect
                              isDisabled={user?.roles?.find(
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                  <FormField
          control={methods.control}
          name="usertype"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Type</FormLabel>
              <FormControl>
                <div>
                  <label style={{ marginRight: '10px' }}> {/* Adds spacing between label and input */}
                    <input
                      type="radio"
                      {...field}
                      value="Promoter"
                      checked={field.value === 'Promoter'}
                    /> <span style={{ marginLeft: '2px' }}></span>
                    Promoter
                  </label>
                  <label style={{ marginRight: '10px' }}> {/* Adds spacing between label and input */}
                    <input
                      type="radio"
                      {...field}
                      value="Advertiser"
                      checked={field.value === 'Advertiser'}
                    /> <span style={{ marginLeft: '2px' }}></span>
                    Advertiser
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

                  </div>
                </div>
              </div>
        </div>
              <div className="mt-4 space-x-3" style={{textAlign: 'right'}}>
                <Button
                    type="button"
                    className="rounded-sm"
                    variant="outline"
                    onClick={() => router.push('/admin/users')}
                >
                    Back
                </Button>
                <Button type="submit" className="rounded-sm">
                    {mode === 'add' ? 'Create' : 'Update'}
                </Button>
            </div>
      </form>
    </FormProvider>
    </Card>
   </>

  );
};

export default UserInfoForm;
