'use client';

import React, { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Extend the Window interface to include Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Configure Laravel Echo with Pusher
    window.Pusher = Pusher;

    const echo = new Echo({
      broadcaster: "pusher",
      key: "bf8161f035227566ce8c", // Replace with your Pusher app key
      cluster: "ap1", // Replace with your Pusher cluster
      forceTLS: true, // Ensure secure connection
    });

    // Subscribe to the notifications channel
    echo.channel("notifications").listen("HourlyApiCallEvent", (data: { message: string }) => {
      console.log("Notification received:", data.message);
      setNotifications((prev) => [...prev, data.message]);
    });

    // Cleanup the connection when the component unmounts
    return () => {
      echo.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Real-Time Notifications</h1>
      <ul>
        {notifications.map((message, index) => (
          <li key={index}>🔔 {message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
