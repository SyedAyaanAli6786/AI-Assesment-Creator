'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { HiOutlineArrowLeft, HiOutlineSquares2X2 } from 'react-icons/hi2';
import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function Header({ title = 'Assignment', showBack = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {showBack && (
          <button className={styles.backBtn} onClick={() => router.back()}>
            <HiOutlineArrowLeft />
          </button>
        )}
        <HiOutlineSquares2X2 className={styles.headerIcon} />
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.right}>
        <button className={styles.notifBtn}>
          <Image src="/bell-icon.png" alt="Notifications" width={40} height={40} unoptimized />
        </button>
        <div className={styles.userMenu}>
          <div className={styles.avatar}>
            <Image
              src="/school-avatar.png"
              alt="User Avatar"
              width={32}
              height={32}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
              unoptimized
            />
          </div>
          <span className={styles.userName}>John Doe</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </header>
  );
}
