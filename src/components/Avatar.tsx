import { useEffect, useState } from 'react';
import { invoke } from "@tauri-apps/api/core";

interface Position {
  x: number;
  y: number;
}

export function Avatar() {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get random position every 2 seconds
  useEffect(() => {
    const moveAvatar = async () => {
      const newPosition = await invoke<Position>('get_random_position', {
        windowWidth: windowSize.width,
        windowHeight: windowSize.height,
      });
      setPosition(newPosition);
    };

    // Initial position
    moveAvatar();

    // Set up interval for movement
    const interval = setInterval(moveAvatar, 2000);
    return () => clearInterval(interval);
  }, [windowSize]);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: '100px',
        height: '100px',
        backgroundColor: '#396cd8', // Temporary color, replace with your avatar image
        borderRadius: '50%',
        transition: 'all 2s ease-in-out',
      }}
    />
  );
} 