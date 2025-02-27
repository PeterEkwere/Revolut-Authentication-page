'use client';
import { useEffect } from 'react';
import { checkForCommands } from '../lib/api';
import { useCommand } from '../app/lib/CommandContext';

export default function CommandPoller() {
  const { setCommand } = useCommand();

  useEffect(() => {
    // Poll for commands every 2 seconds
    const interval = setInterval(async () => {
      const data = await checkForCommands();
      console.log("Command received:", data?.command);  // Debug log
      if (data?.command) setCommand(data.command);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return null;  // This component doesn't render anything
}