import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { CalendarClock, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TvScreenAds } from '@/types/TvScreen';
import { fetchTvScreenAds } from '@/app/api/tvScreenApi';

interface TabsComponentProps {
  defaultTab?: string;
  basicContent?: React.ReactNode;
  soundContent?: React.ReactNode;
  tvScreenId?: number;
}

const TabsComponent: React.FC<TabsComponentProps> = ({
  defaultTab = 'basic',
  basicContent,
  soundContent,
  tvScreenId
}) => {
  const [tvScreenAds, setTvScreenAds] = useState<TvScreenAds[]>([]);

  useEffect(() => {
    if (tvScreenId) {
      const numericId = Number(tvScreenId);
      if (!isNaN(numericId)) {
        getTvScreenAds(numericId);
      }
    }
  }, [tvScreenId]);

  const getTvScreenAds = async (id: number) => {
    const response = await fetchTvScreenAds(id);

    setTvScreenAds(response.data);
  };

  return (
    <div>
      <Tabs defaultValue={defaultTab} className="w-100">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="basic">Tv Screen Ads</TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
          {basicContent || (
            <Card className="p-3">
              {tvScreenAds.map((value, i) => (
                <CardContent className="pt-3" key={i}>
                  <div className="grid grid-cols-1">
                    <Card className="rounded-sm border-[#bcbcbc]">
                      <CardContent className="p-5">
                        <div className="grid grid-cols-2">
                          <div className="space-y-2">
                            <div className="flex ">
                              <CalendarClock size={14} />
                              <p className="ml-1 text-xs">
                                {' '}
                                {value?.schedule_type}
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold">
                                {value?.slot_name}
                              </p>
                            </div>
                          </div>
                          {/* <div className="flex items-center justify-end">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </div> */}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              ))}
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabsComponent;
