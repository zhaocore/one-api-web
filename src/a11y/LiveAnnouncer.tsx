import React, { useState, useCallback, useRef, useEffect } from 'react';

interface LiveAnnouncerProps {
  children: React.ReactNode;
}

const LiveAnnouncer: React.FC<LiveAnnouncerProps> = ({ children }) => {
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announce = useCallback((msg: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(msg);
    timeoutRef.current = setTimeout(() => setMessage(''), 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>
    </>
  );
};

export default LiveAnnouncer;
