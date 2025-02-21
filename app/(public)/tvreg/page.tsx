'use client';
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';

function QrGeneratorComponent() {
  const [qrCodeData, setQrCodeData] = useState('');
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    const storedDeviceId = localStorage.getItem('deviceId');

    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
      setQrCodeData(storedDeviceId);
    } else {
      const newDeviceId = uuidv4();
      localStorage.setItem('deviceId', newDeviceId);
      setDeviceId(newDeviceId);
      setQrCodeData(newDeviceId);
    }
  }, []);

  return (
    <div className="h-full w-full bg-purple-600">
      <div className="mx-auto flex h-screen w-fit flex-col items-center justify-center rounded-lg p-8">
        {qrCodeData && (
          <QRCodeSVG value={qrCodeData} size={512} level="H" marginSize={4} />
        )}
        <p className="mt-4 font-mono text-lg text-white">Code: {qrCodeData}</p>
      </div>
    </div>
  );
}

export default QrGeneratorComponent;
