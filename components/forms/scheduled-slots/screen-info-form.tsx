'use client';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { createScheduledSlot } from '@/app/api/scheduledSlotsApi';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { TvScreen } from '@/types/TvScreen';
import Select, { MultiValue } from 'react-select';
import { RadioGroup, Radio } from 'react-radio-group';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Icons } from '@/components/icons';
import { UploadCloud, XCircle } from 'lucide-react';
import Image from 'next/image';
import closeBtn from '@/public/media/images/close-btn.svg';
import { removeExtensionName } from '@/components/utils/removeExtensionName';
import { Separator } from '@/components/ui/separator';
import { PaymentMethod } from '@/types/PaymentMethod';
import { fetchPaymentMethodByCustomer } from '@/app/api/billing/stripeCustomerApi';
import { useSession } from 'next-auth/react';

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  tvscreenname: z.any(),
  fileType: z.enum(['file', 'folder']),
  scheduler_days: z.any(),
  scheduleType: z.any(),
  address: z.string().optional(), // Add this line,
  total_price: z.number().optional()
});

type ScheduledSlotFormValue = z.infer<typeof formSchema>;

export default function TvScreenForm({ tvscreens }: { tvscreens: any }) {
  const methods = useForm<ScheduledSlotFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileType: 'file'
    }
  });

  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [previews, setPreviews] = useState<
    { url: string; name: string; file: File; base64: string }[]
  >([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [acceptType, setAcceptType] = useState<string>('');
  const [selectedFileType, setSelectedFileType] = useState<string>('');
  const [typeSelected, setTypeSelected] = useState<boolean>(false);
  const [scheduleDays, setScheduleDays] = useState<string[]>([]);
  const [scheduleTimeSlots, setScheduleTimeSlots] = useState<string[]>([]);

  const [tvScreensWithPrice, setSelectedTvScreensWithPrice] = useState<any[]>(
    []
  );

  const [selectedTvScreen, setSelectedTvScreen] = useState<string[]>([]);
  const [selectedTvScreenId, setSelectedTvScreenId] = useState<string[]>([]);

  const [tvScreenPrices, setTvScreenPrices] = useState<number>(0);

  const [scheduleTotalHours, setScheduleTotalHours] = useState<number>(0);
  const [scheduleTotalPrice, setScheduleTotalPrice] = useState<number>(0);

  //payment method
  const [error, setError] = useState<string | null>(null);
  const [loadingPaymentMethod, setLoadingPaymentMethod] = useState(true);
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    const { data: session } = useSession();
    const user: any = session?.user;

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
        fetchPaymentMethods();
      }, []);
    

  const handleChangePayment = (event: any) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const calculateTotalHours = (timeRanges: string[]) => {
    if (!Array.isArray(timeRanges) || timeRanges.length === 0) {
      return 'No time ranges provided'; // Or handle the error as you prefer
    }

    const timeToMinutes = (time: any) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const timePairs = timeRanges.map((timeRange) => timeRange.split(' - '));

    // Check for invalid time ranges
    if (timePairs.some((pair) => pair.length !== 2)) {
      return 'Invalid time range format';
    }

    const durations = timePairs.map(
      ([startTime, endTime]) =>
        timeToMinutes(endTime) - timeToMinutes(startTime)
    );
    const totalMinutes = durations.reduce((sum, duration) => sum + duration, 0);
    const totalHours = totalMinutes / 60;

    return totalHours; // Return the total hours as a decimal
  };

  const calculateCost = (hours: number) => {
    if (typeof hours !== 'number' || isNaN(hours) || hours < 0) {
      return 'Invalid input. Hours must be a non-negative number.';
    }

    const costPerHour = 10; // $10 per hour
    const costPerHalfHour = 5; // $5 per half hour

    const wholeHours = Math.floor(hours); // Get the whole number of hours
    const remainingMinutes = (hours - wholeHours) * 60; // Calculate remaining minutes

    let totalCost = 0;

    totalCost += wholeHours * costPerHour; // Cost for whole hours

    if (remainingMinutes >= 30) {
      // Check if remaining minutes are at least 30 (half an hour)
      totalCost += costPerHalfHour;
    }

    return totalCost;
  };

  const handleViewChange = () => {
    setView((prev) => (prev === 'list' ? 'grid' : 'list'));
  };

  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');

  useEffect(() => {
    switch (selectedFileType) {
      case 'Images':
        setAcceptType('image/*');
        break;
      case 'Videos':
        setAcceptType('video/*');
        break;
      case 'Audio':
        setAcceptType('audio/*');
        break;
      case 'Documents':
        setAcceptType('.pdf,.doc,.docx,.xls,.xlsx');
        break;
      case 'Webpages':
        setAcceptType('.html,.htm');
        break;
      default:
        setAcceptType('');
    }
    setTypeSelected(!!selectedFileType);
    setPreviews([]);
    setMediaFiles([]);
  }, [selectedFileType]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const newPreviews = await Promise.all(
        fileArray.map(async (file) => {
          const base64 = await convertToBase64(file);
          const fileURL = URL.createObjectURL(file);
          return { url: fileURL, name: file.name, file, base64 };
        })
      );
      setPreviews(newPreviews);
      setMediaFiles(fileArray);
    } else {
      setPreviews([]);
      setMediaFiles([]);
    }
  };

  const handleRemoveFile = async (fileToRemove: {
    url: string;
    name: string;
  }) => {
    setPreviews((prev) => {
      const newPreviews = prev.filter(
        (preview) => preview.name !== fileToRemove.name
      );
      return newPreviews;
    });

    URL.revokeObjectURL(fileToRemove.url);

    const updatedMediaFiles = mediaFiles.filter(
      (file) => file.name !== fileToRemove.name
    );
    setMediaFiles(updatedMediaFiles);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const typeOptions = [
    { value: 'images', label: 'Images' },
    { value: 'videos', label: 'Videos' }
  ];

  const weekdaysOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const handleDayChange = (
    newValue: MultiValue<{ value: string; label: string }>
  ) => {
    // Extract the values (days) from the selected options
    const selectedDays = newValue.map((option: any) => option.value);

    // Update state and form values
    setScheduleDays(selectedDays);
    methods.setValue('scheduler_days', selectedDays);
  };

  const handleTvScreenChange = (newValue: any) => {
    // console.log("handleTvScreenChange",newValue);
    const selectedTvScreen = newValue.map((option: any) => option.name);
  

    const selectedPrices = newValue.map((option: any) => {
      const foundTv = tvscreens.find(
        (tv: any) => tv.id === option.id || tv.name === option.name
      ); // Find the TV object

      return foundTv ? Number(foundTv.price) : 0; // Return price, or 0 if not found
    });

    const findTv = newValue.map((option: any) => {
      return tvscreens.find(
        (tv: any) => tv.id === option.id || tv.name === option.name
      ); // Find the TV object
    });


    const findTvId = newValue.map((option: any) => {
      const tv = tvscreens.find(
        (tv: any) => tv.id === option.id || tv.name === option.name
      ); // Find the TV object

      return tv.id;
    });


    setSelectedTvScreensWithPrice(findTv);

    // Update state and form values
    setSelectedTvScreen(selectedTvScreen);
    setSelectedTvScreenId(findTvId);
    setTvScreenPrices(
      selectedPrices.reduce((sum: number, price: number) => sum + price, 0)
    ); // Directly sum numbers

    methods.setValue('tvscreenname', selectedTvScreen);
    
  };

  const handleRemoveTvScreen = (index: any) => {
    const updatedOptions = selectedTvScreen.filter((tv, i) => i !== index);
    const updatedTvPriceOptions = tvScreensWithPrice.filter(
      (tv, i) => i !== index
    );

    setSelectedTvScreensWithPrice(updatedTvPriceOptions);

    setSelectedTvScreen(updatedOptions);
  };

  useEffect(() => {
    const selectedPrices = tvScreensWithPrice.map((option: any) => {
      const foundTv = tvscreens.find((tv: any) => tv.id === option.id); // Find the TV object

      return foundTv ? Number(foundTv.price) : 0; // Return price, or 0 if not found
    });
    setTvScreenPrices(
      selectedPrices.reduce((sum: number, price: number) => sum + price, 0)
    ); // Directly sum numbers
  }, [tvScreensWithPrice]); // This effect will run whenever 'count' changes

  const handleRemoveDay = (index: number) => {
    const updatedDays = scheduleDays.filter((day, i) => i !== index);
    setScheduleDays(updatedDays);
  };

  const [selectedStartTime, setSelectedStartTime] = useState<
    string | undefined
  >(undefined);
  const [selectedEndTime, setSelectedEndTime] = useState<string | undefined>(
    undefined
  );

  const timeOptions = [...Array(24).keys()].flatMap((hour) => {
    return [...Array(60).keys()]
      .filter((minute) => minute % 30 === 0)
      .map((minute) => ({
        value: `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`,
        label: `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`
      }));
  });

  const handleTimeSlots = () => {
    if (
      selectedStartTime?.length !== undefined &&
      selectedEndTime?.length !== undefined
    ) {
      const newTimeSlot = `${selectedStartTime} - ${selectedEndTime}`;
      const [startHour, startMinute] = selectedStartTime.split(':').map(Number);
      const [endHour, endMinute] = selectedEndTime.split(':').map(Number);
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;

      if (endTimeInMinutes - startTimeInMinutes >= 30) {
        setScheduleTimeSlots((prev) => {
          if (!prev.includes(newTimeSlot)) {
            let timeRange = calculateTotalHours([...prev, newTimeSlot]);
            setScheduleTotalHours(Number(timeRange));
            setScheduleTotalPrice(
              scheduleTotalPrice + Number(calculateCost(scheduleTotalHours))
            );

            return [...prev, newTimeSlot];
          }
          return prev;
        });
        // Reset selectedStartTime and selectedEndTime
        setSelectedStartTime(undefined);
        setSelectedEndTime(undefined);
      } else {
        alert('End time must be at least 30 minutes after start time.');
      }
    }
  };
  useEffect(() => {
    if (selectedEndTime) {
      handleTimeSlots();
    }
  }, [selectedEndTime]);

  const handleRemoveTime = (index: number) => {
    const updatedTime = scheduleTimeSlots.filter((timeSlots, i) => i !== index);
    setScheduleTotalHours(Number(updatedTime));

    setScheduleTimeSlots(updatedTime);
  };

  useEffect(() => {
    setScheduleTotalPrice(Number(calculateCost(scheduleTotalHours)));
  }, [scheduleTotalHours]);

  const [selectedOption, setSelectedOption] = useState('daily');
  const handleRadioChange = (event: any) => {
    setSelectedOption(event.target.value);
    methods.setValue('scheduleType', event.target.value);
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const onSubmit = async (data: ScheduledSlotFormValue) => {
    setLoading(true);
    try {
      const formData = new FormData();
      const total_price = scheduleTotalPrice + tvScreenPrices;
      formData.append('name', data.name);
      formData.append('tvscreenname', data.tvscreenname);
      formData.append('tvscreenlist', selectedTvScreenId.join(',')); // Convert array to comma-separated string
      formData.append('scheduler_days', scheduleDays.join(',')); // Convert array to comma-separated string
      formData.append('fileType', data.fileType);
      formData.append('scheduleType', selectedOption.toString()); //data.scheduleType
      formData.append('timeSlots', scheduleTimeSlots.join(',')); // Convert array to comma-separated string
      formData.append('total_price', total_price.toString());
      formData.append('payment_method', selectedPaymentMethod);
      formData.append('schedule_slot_hours', scheduleTotalPrice.toString());


      const mFiles = await Promise.all(
        mediaFiles.map(async (file) => {
          const base64 = await convertToBase64(file);
          const fileURL = URL.createObjectURL(file);
          return {
            url: fileURL,
            name: removeExtensionName(file.name),
            file,
            base64
          };
        })
      );

      mFiles.forEach((mFile, index) => {
        formData.append(`media_files[${index}][file]`, mFile.file);
        // formData.append(`media_files[${index}][url]`, mFile.url);
        formData.append(`media_files[${index}][name]`, mFile.name);
        formData.append(`media_files[${index}][base64]`, mFile.base64);
      });

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await createScheduledSlot(formData);

      console.log('Scheduler created successfully:', response.data);
      toast({
        title: 'Success',
        description: 'Scheduler created successfully!',
        variant: 'default'
      });
      setTimeout(() => {
        router.push('/digital-signage/scheduled-slots');
      }, 500);
    } catch (error) {
      console.error('Error creating Scheduler:', error);
      toast({
        title: 'Error',
        description: 'There was an error creating the Scheduler.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="bg-white p-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="w-full">
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ads Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter File Name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-col">
            <FormField
              control={methods.control}
              name="scheduleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule</FormLabel>
                  <FormControl className="flex flex-row gap-4">
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="radio-buttons-group"
                      selectedValue={selectedOption} // Use selectedValue instead of value
                      onChange={(value) => setSelectedOption(value)} // Update the state
                    >
                      <Radio value="daily" /> Daily
                      <Radio value="customize" /> Customize
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormItem>
              <FormLabel>File Type</FormLabel>
              <FormControl>
                <Select
                  options={typeOptions}
                  placeholder="Select Type"
                  onChange={(option: any) => {
                    console.log('option', option);
                    const selectedType = option?.value as string;
                    setSelectedFileType(selectedType);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
          {selectedOption === 'customize' && (
            <div className="w-full">
              <FormField
                control={methods.control}
                name="scheduler_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Days </FormLabel>
                    <FormControl>
                      <Select
                        isMulti
                        {...field}
                        options={weekdaysOptions}
                        placeholder="Select Days"
                        onChange={handleDayChange}
                        className="w-full"
                        value={scheduleDays.map((day) => ({
                          value: day,
                          label: day
                        }))}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="grid w-full grid-cols-2 justify-start gap-2 md:grid-cols-3">
                      {scheduleDays.map((day, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-1 rounded-[50px] border border-solid border-zinc-400 px-2 py-1 transition duration-300 hover:border-zinc-600 hover:shadow-md"
                        >
                          <span className="my-auto self-stretch text-sm font-medium text-zinc-600 md:text-base">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </span>
                          <Image
                            loading="lazy"
                            src={closeBtn}
                            alt="closeBtn"
                            className="my-auto w-[20px] cursor-pointer self-end"
                            onClick={() => handleRemoveDay(index)}
                          />
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="w-full">
            <FormField
              control={methods.control}
              name="tvscreenname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <FormControl>
                    <Select
                      isMulti
                      {...field}
                      options={tvscreens}
                      placeholder="Select Tv Screen..."
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      onChange={handleTvScreenChange}
                      value={selectedTvScreen.map((tv) => ({
                        id: tv,
                        name: tv
                      }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormItem>
              <FormLabel>Add time slots</FormLabel>
              <FormControl className="w-full">
                <div className="flex flex-row gap-5">
                  <Select
                    value={timeOptions.find(
                      (option) => option.value === selectedStartTime
                    )}
                    options={timeOptions}
                    onChange={(option: any) => {
                      const selectedStartTime = option?.value as string;
                      setSelectedStartTime(selectedStartTime);
                    }}
                    placeholder="Start"
                  />
                  <Select
                    value={timeOptions.find(
                      (option) => option.value === selectedEndTime
                    )}
                    options={timeOptions}
                    onChange={(option: any) => {
                      const selectedEndTime = option?.value as string;
                      setSelectedEndTime(selectedEndTime);
                    }}
                    placeholder="End"
                  />
                  {/* <div
                    className={`${selectedStartTime?.length == undefined || selectedEndTime?.length == undefined ? 'cursor-default' : 'cursor-pointer'} bg-blue-700 rounded-3xl px-4 py-1 text-white my-auto text-[16px]`}
                    onClick={handleTimeSlots}
                  >
                    add
                  </div> */}
                </div>
              </FormControl>

              <div className="grid w-full grid-cols-1 justify-start gap-2 md:grid-cols-2">
                {scheduleTimeSlots.map((scheduleTime, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-1 rounded-[50px] border border-solid border-zinc-400 px-2 py-1 transition duration-300 hover:border-zinc-600 hover:shadow-md"
                  >
                    <span className="my-auto self-stretch text-sm font-medium text-zinc-600 md:text-base">
                      {scheduleTime}
                    </span>
                    <Image
                      loading="lazy"
                      src={closeBtn}
                      alt="closeBtn"
                      className="my-auto w-[20px] cursor-pointer self-end"
                      onClick={() => handleRemoveTime(index)}
                    />
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          </div>

          <div className="w-full">
          </div>

          <div className="w-full">
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
          </div>

          <div className="w-full">
            <div className="flex justify-between">
              <div className="w-full justify-start gap-2 ">
                <h1 className='mb-3'>Order Summary</h1>
                {tvScreensWithPrice.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="my-auto self-stretch text-sm font-bold font-medium">
                      {option.name}
                    </span>

                    <span className="my-auto self-stretch text-sm font-bold font-medium">
                      {option.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <p className="font-bold">
                time slots ({scheduleTotalHours} hours)
              </p>
              <h3 className="text-xl font-bold">${scheduleTotalPrice}</h3>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between">
              <p className="font-bold">Total</p>
              <h3 className="text-xl font-bold text-yellow-500">
                ${tvScreenPrices + scheduleTotalPrice}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-span-3 mb-[25px] mt-[40px] space-y-4">
          <div className="mt-5 grid items-center justify-center">
            <h3 className="mb-2 text-center font-bold text-primary">
              Upload videos from your device
            </h3>
            <p className="text-center text-sm">Maximum size allowed is 1GB</p>
          </div>

          <div
            className={`relative mt-[50px] cursor-pointer rounded-lg border-2 border-dashed bg-transparent p-5 ${
              !typeSelected ? 'bg-gray-100' : ''
            }`}
          >
            <input
              type="file"
              multiple
              accept={acceptType}
              onChange={handleFileChange}
              className={`absolute inset-0 opacity-0 ${
                typeSelected ? '' : 'cursor-not-allowed'
              }`}
              disabled={!typeSelected}
            />
            <div className="flex h-full flex-col items-center justify-center">
              <UploadCloud
                className={`mb-2 text-gray-500 ${
                  !typeSelected ? 'opacity-50' : ''
                }`}
                size={40}
              />
              <p
                className={`font-bold text-gray-500 ${
                  !typeSelected ? 'text-gray-400' : ''
                }`}
              >
                {typeSelected
                  ? 'Drag or drop files here'
                  : 'Select a file type first'}
              </p>
            </div>
          </div>

          <div className="border-gray relative mt-[50px] rounded-lg border-2 bg-transparent p-5">
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center"
                  >
                    {preview.file.type.startsWith('video/') ? (
                      <video
                        width="100%"
                        height="auto"
                        controls
                        src={preview.url}
                        className="w-full max-w-[150px]"
                      />
                    ) : (
                      <Image
                        src={preview.url}
                        alt={preview.name}
                        width={150}
                        height={150}
                        className="rounded-lg"
                      />
                    )}
                    <div className="mt-2 flex items-center justify-center">
                      <span className="text-sm">{preview.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(preview)}
                        className="ml-2 text-red-500"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-3 flex flex-row justify-end gap-5">
          <Button
            type="reset"
            onClick={() => router.push('/digital-signage/scheduled-slots')}
            className="border-1 border bg-white text-black"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            Pay
            {loading && <Icons.spinner className="ml-2 animate-spin" />}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
