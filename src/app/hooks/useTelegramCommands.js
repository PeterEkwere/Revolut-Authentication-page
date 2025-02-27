import { useEffect, useState } from 'react';

export const useTelegramCommands = (userId) => {
  const [command, setCommand] = useState(null);

  useEffect(() => {
    const checkCommands = async () => {
      try {
        const response = await fetch('http://18.144.169.247:5000/get-command', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.command) {
            setCommand(data.command);
          }
        }
      } catch (error) {
        console.error('Error checking commands:', error);
      }
    };

    const interval = setInterval(checkCommands, 1500);  // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [userId]);

  return command;
};