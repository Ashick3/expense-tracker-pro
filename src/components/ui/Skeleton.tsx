"use client";

import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rect' | 'circle';
  className?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({ 
  width, 
  height, 
  variant = 'rect', 
  className = '',
  style: customStyle
}: SkeletonProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...customStyle
  };

  return (
    <div 
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={style}
    />
  );
}
