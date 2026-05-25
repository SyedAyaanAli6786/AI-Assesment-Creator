'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2';
import styles from './MobileHeader.module.css';
import headerStyles from '../Header/Header.module.css';

export default function MobileHeader() {
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const [allRead, setAllRead] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.mobileHeader}>
      <div className={styles.logo} onClick={() => router.push('/')} style={{cursor: 'pointer'}}>
        <Image src="/vedaai-logo.png" alt="VedaAI" width={32} height={32} unoptimized />
        <span className={styles.logoText}>VedaAI</span>
      </div>
      <div className={styles.right}>
        {/* Notifications */}
        <div className={styles.notifBtnWrapper} ref={notifRef}>
          <div className={styles.notifBtn} onClick={() => setShowNotifs(!showNotifs)}>
            <Image src="/bell-icon.png" alt="Notifications" width={32} height={32} unoptimized />
            {!allRead && <span className={styles.notifDot}></span>}
          </div>
          
          {showNotifs && (
            <div className={`${headerStyles.notifDropdown} ${styles.mobileNotifDropdown}`}>
              <div className={headerStyles.notifHeader}>
                <h3>Notifications</h3>
                <span className={headerStyles.markRead} onClick={() => setAllRead(true)}>Mark all as read</span>
              </div>
              <div className={headerStyles.notifList}>
                <div 
                  className={`${headerStyles.notifItem} ${!allRead ? headerStyles.unread : ''}`}
                  onClick={() => { setShowNotifs(false); router.push('/assignments'); }}
                >
                  {!allRead && <div className={headerStyles.notifDot}></div>}
                  <div className={headerStyles.notifContent}>
                    <p><strong>Science Assignment</strong> generation is complete.</p>
                    <span>2 mins ago</span>
                  </div>
                </div>
                <div 
                  className={headerStyles.notifItem}
                  onClick={() => { setShowNotifs(false); router.push('/assignments/create'); }}
                >
                  <div className={headerStyles.notifContent}>
                    <p>Welcome to VedaAI! Create your first assignment.</p>
                    <span>1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile / Menu */}
        <div ref={menuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image src="/school-avatar.png" alt="User" width={32} height={32} className={styles.avatar} unoptimized onClick={() => setShowMenu(!showMenu)} style={{cursor: 'pointer'}} />
          <div onClick={() => setShowMenu(!showMenu)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {showMenu ? <HiOutlineXMark className={styles.hamburger} /> : <HiOutlineBars3 className={styles.hamburger} />}
          </div>
          
          {showMenu && (
            <div className={`${headerStyles.profileDropdown} ${styles.mobileMenuDropdown}`}>
              <div className={headerStyles.profileHeader}>
                <div className={headerStyles.profileAvatarLarge}>
                  <Image src="/school-avatar.png" alt="Avatar" width={48} height={48} style={{ borderRadius: '50%', objectFit: 'cover' }} unoptimized />
                </div>
                <div>
                  <h4>John Doe</h4>
                  <p>Teacher at DPS Bokaro</p>
                </div>
              </div>
              
              <div className={headerStyles.profileLinks}>
                <button className={headerStyles.profileBtn} onClick={() => { setShowMenu(false); router.push('/settings'); }}>
                  <span>Settings</span>
                </button>
                <div className={headerStyles.divider}></div>
                <button className={`${headerStyles.profileBtn} ${headerStyles.logoutBtn}`} onClick={() => setShowMenu(false)}>
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
