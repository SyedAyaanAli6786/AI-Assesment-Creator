import React from 'react';
import Image from 'next/image';
import { HiOutlineBars3 } from 'react-icons/hi2';
import styles from './MobileHeader.module.css';

export default function MobileHeader() {
  return (
    <div className={styles.mobileHeader}>
      <div className={styles.logo}>
        <Image src="/vedaai-logo.png" alt="VedaAI" width={32} height={32} unoptimized />
        <span className={styles.logoText}>VedaAI</span>
      </div>
      <div className={styles.right}>
        <div className={styles.notifBtn}>
          <Image src="/bell-icon.png" alt="Notifications" width={32} height={32} unoptimized />
          <span className={styles.notifDot}></span>
        </div>
        <Image src="/school-avatar.png" alt="User" width={32} height={32} className={styles.avatar} unoptimized />
        <HiOutlineBars3 className={styles.hamburger} />
      </div>
    </div>
  );
}
