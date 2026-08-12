import React, { useState, useMemo, useCallback } from 'react';
import type { TUser } from 'librechat-data-provider';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import { Skeleton } from './Skeleton';

export interface AvatarProps {
  user?: TUser;
  /** Direct seed string for dicebear avatar generation */
  seed?: string;
  /** Size variant: sm=24, md=32, lg=40 */
  size?: number | 'sm' | 'md' | 'lg';
  className?: string;
  alt?: string;
  showDefaultWhenEmpty?: boolean;
}

const SIZE_MAP: Record<string, number> = {
  sm: 24,
  md: 32,
  lg: 40,
};

const resolveSize = (size?: number | 'sm' | 'md' | 'lg'): number => {
  if (typeof size === 'number') return size;
  if (typeof size === 'string' && SIZE_MAP[size]) return SIZE_MAP[size];
  return 32;
};

const Avatar: React.FC<AvatarProps> = ({
  user,
  seed: seedProp,
  size: sizeProp = 32,
  className = '',
  alt,
  showDefaultWhenEmpty = true,
}) => {
  const size = resolveSize(sizeProp);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const avatarSeed = useMemo(
    () => seedProp || user?.avatar || user?.username || user?.email || '',
    [seedProp, user?.avatar, user?.username, user?.email],
  );

  const altText = useMemo(
    () => alt || `${user?.name || user?.username || user?.email || ''}'s avatar`,
    [alt, user?.name, user?.username, user?.email],
  );

  // Generate dicebear SVG data URI from seed
  const dicebearSrc = useMemo(() => {
    if (!avatarSeed) return '';
    try {
      const av = createAvatar(initials, { seed: avatarSeed, size: Math.round(size * 2) });
      return av.toDataUri();
    } catch {
      return '';
    }
  }, [avatarSeed, size]);

  const imageSrc = useMemo(() => {
    if (!avatarSeed || imageError) return '';
    // Prefer user's explicit avatar URL over generated one
    if (user?.avatar) return user.avatar;
    return dicebearSrc || '';
  }, [user?.avatar, dicebearSrc, avatarSeed, imageError]);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
  }, []);

  if (avatarSeed.length === 0 && showDefaultWhenEmpty) {
    return (
      <div
        style={{
          backgroundColor: 'rgb(121, 137, 255)',
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: 'rgba(240, 246, 252, 0.1) 0px 0px 0px 1px',
        }}
        className={`relative flex items-center justify-center rounded-full p-1 text-white ${className}`}
        aria-hidden="true"
      >
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    );
  }

  if (avatarSeed.length > 0 && !imageError) {
    return (
      <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
        {!imageLoaded && (
          <Skeleton className="rounded-full" style={{ width: `${size}px`, height: `${size}px` }} />
        )}
        <img
          style={{
            width: `${size}px`,
            height: `${size}px`,
            display: imageLoaded ? 'block' : 'none',
          }}
          className={`rounded-full ${className}`}
          src={imageSrc}
          alt={altText}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    );
  }

  if (imageError && showDefaultWhenEmpty) {
    return (
      <div
        style={{
          backgroundColor: 'rgb(121, 137, 255)',
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: 'rgba(240, 246, 252, 0.1) 0px 0px 0px 1px',
        }}
        className={`relative flex items-center justify-center rounded-full p-1 text-white ${className}`}
        aria-hidden="true"
      >
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    );
  }

  return null;
};

export default Avatar;
