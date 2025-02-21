'use client';
import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { registerTvScreen } from '@/app/api/tvScreenApi';
import { useParams, useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

const TvScreenQrScanner = () => {
  const { id } = useParams();

  const [inputCode, setInputCode] = useState('');
  const [isQr, setIsQr] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: { width: 512, height: 512 },
      aspectRatio: 1.0
    };
    const qrCodeSuccessCallback = (decodedText: string, decodedResult: any) => {
      console.log(`Scan result: ${decodedText}`, decodedResult);
      setIsQr(true);
      setInputCode(decodedText);
    };
    const qrCodeErrorCallback = (errorMessage: string) => {
      console.error(`QR Code scan error: ${errorMessage}`);
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      'qr-reader',
      config,
      false
    );
    html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);

    return () => {
      html5QrcodeScanner.clear();
    };
  }, []);

  const registerTvScreenAttempt = async () => {
    console.log('id', id);
    console.log('url', inputCode);

    let deviceId = inputCode;

    if (!deviceId) {
      return alert('Code required');
    }
    console.log('Device ID:', deviceId);
    try {
      await registerTvScreen(Number(id), deviceId);
      toast({
        title: 'Success',
        description: 'Tv Screen registered successfully',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to register tv screen. ${error}`,
        variant: 'destructive'
      });
      console.error(error);
    } finally {
      router.push('/digital-signage/tv-screen');
    }
  };

  const clearEntry = async () => {
    setIsQr(false);
    setInputCode('');
  };

  return (
    <div>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1>Register TV Screen</h1>
        <div className="w-full max-w-sm">
          <div id="qr-reader" className="mb-4 w-full max-w-sm"></div>
        </div>
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          className="mt-4 w-1/2 rounded border border-purple-500 p-2"
          placeholder="Enter code here"
          disabled={isQr}
        />
        <div>
          <button
            onClick={clearEntry}
            className="border-black-100 mr-3 mt-4 rounded border p-2"
          >
            Clear
          </button>

          <button
            onClick={registerTvScreenAttempt}
            className="mt-4 rounded bg-purple-600 p-2 text-white hover:bg-purple-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TvScreenQrScanner;
