'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { HiOutlineCog6Tooth } from 'react-icons/hi2';
import { useStore } from '../../store/useStore';
import styles from './Sidebar.module.css';

const navItems = [
  { label: 'Home', iconSrc: '/home-icon.png', path: '/' },
  { label: 'My Groups', iconSrc: '/groups-icon.png', path: '/groups' },
  { label: 'Assignments', iconSrc: '/assignments-icon.png', path: '/assignments', hasBadge: true },
  { label: 'AI Teacher\'s Toolkit', iconSrc: '/toolkit-icon.png', path: '/toolkit' },
  { label: 'My Library', iconSrc: '/library-icon.png', path: '/library' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const assignmentCount = useStore((s) => s.assignments.length);

  const isActive = (path: string) => {
    if (path === '/assignments') {
      return pathname === '/assignments' || pathname.startsWith('/assignments');
    }
    return pathname === path;
  };

  return (
    <aside className={styles.sidebar}>
      {/* TOP SECTION */}
      <div className={styles.topSection}>
        {/* LOGO */}
        <div className={styles.logo} onClick={() => router.push('/')}>
          <div className={styles.logoIcon}>
            <Image
              src="/vedaai-logo.png"
              alt="VedaAI Logo"
              width={40}
              height={40}
              style={{ objectFit: 'contain' }}
              priority
              unoptimized
            />
          </div>
          <span className={styles.logoText}>VedaAI</span>
        </div>

        {/* CREATE BUTTON */}
        <button
          className={styles.createBtn}
          onClick={() => router.push('/assignments/create')}
        >
          <Image src="/stars-icon.png" alt="Stars" width={20} height={20} className={styles.createIcon} unoptimized />
          Create Assignment
        </button>

      </div>

      {/* MENU ITEMS */}
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`${styles.navItem} ${isActive(item.path) ? styles.navItemActive : ''}`}
            onClick={() => router.push(item.path)}
          >
            <Image src={item.iconSrc} alt={item.label} width={20} height={20} className={styles.navIcon} unoptimized />
            <span className={styles.navLabel}>{item.label}</span>
            {item.hasBadge && assignmentCount > 0 && (
              <span className={styles.badge}>{assignmentCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* BOTTOM SECTION */}
      <div className={styles.bottomSection}>
        <button className={styles.navItem} onClick={() => router.push('/settings')}>
          <HiOutlineCog6Tooth className={styles.navIcon} />
          <span className={styles.navLabel}>Settings</span>
        </button>

        {/* PROFILE CARD */}
        <div className={styles.schoolInfo}>
          <div className={styles.schoolAvatar}>
            <Image
              src="/school-avatar.png"
              alt="School Avatar"
              width={44}
              height={44}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
              unoptimized
            />
          </div>
          <div className={styles.schoolDetails}>
            <span className={styles.schoolName}>Delhi Public School</span>
            <span className={styles.schoolLocation}>Bokaro Steel City</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
