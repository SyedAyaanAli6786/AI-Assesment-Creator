'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { 
  HiOutlineArrowLeft, 
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
  HiOutlineWrenchScrewdriver,
  HiOutlineBookOpen,
  HiOutlineCog6Tooth
} from 'react-icons/hi2';
import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function Header({ title = 'Assignment', showBack = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showNotifs, setShowNotifs] = useState(false);
  const [allRead, setAllRead] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [completionPercent, setCompletionPercent] = useState(20);
  const [userName, setUserName] = useState("John Doe");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleUpdateNameEmail = () => {
    setShowProfile(false);
    const newName = prompt("Enter your new name:", userName);
    const newEmail = prompt("Enter your new email:");
    
    let updated = false;
    if (newName && newName !== userName) {
      setUserName(newName);
      updated = true;
    }
    if (newEmail && newEmail !== userEmail) {
      const emailRegex = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com)$/i;
      if (!emailRegex.test(newEmail)) {
        alert("Please enter a valid email address (e.g., ending with @gmail.com, @yahoo.com).");
      } else {
        setUserEmail(newEmail);
        updated = true;
      }
    }
    
    if (updated) setCompletionPercent(prev => Math.min(100, prev + 40));
  };

  const handleAddPhone = () => {
    setShowProfile(false);
    const phone = prompt("Enter your 10-digit phone number:");
    if (phone && phone !== userPhone) {
      if (!/^\d{10}$/.test(phone)) {
        alert("Invalid phone number. Please enter exactly 10 digits (numbers only).");
      } else {
        setUserPhone(phone);
        setCompletionPercent(prev => Math.min(100, prev + 40));
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getHeaderIcon = () => {
    if (pathname.includes('/groups')) return <HiOutlineUserGroup className={styles.headerIcon} />;
    if (pathname.includes('/toolkit')) return <HiOutlineWrenchScrewdriver className={styles.headerIcon} />;
    if (pathname.includes('/library')) return <HiOutlineBookOpen className={styles.headerIcon} />;
    if (pathname.includes('/settings')) return <HiOutlineCog6Tooth className={styles.headerIcon} />;
    return <HiOutlineSquares2X2 className={styles.headerIcon} />;
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {showBack && (
          <button className={styles.backBtn} onClick={() => router.back()}>
            <HiOutlineArrowLeft />
          </button>
        )}
        {getHeaderIcon()}
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.right}>
        <div className={styles.notifWrapper} ref={notifRef}>
          <button className={styles.notifBtn} onClick={() => setShowNotifs(!showNotifs)}>
            <Image src="/bell-icon.png" alt="Notifications" width={40} height={40} unoptimized />
          </button>
          
          {showNotifs && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <h3>Notifications</h3>
                <span className={styles.markRead} onClick={() => setAllRead(true)}>Mark all as read</span>
              </div>
              <div className={styles.notifList}>
                <div 
                  className={`${styles.notifItem} ${!allRead ? styles.unread : ''}`}
                  onClick={() => { setShowNotifs(false); router.push('/assignments'); }}
                >
                  {!allRead && <div className={styles.notifDot}></div>}
                  <div className={styles.notifContent}>
                    <p><strong>Science Assignment</strong> generation is complete.</p>
                    <span>2 mins ago</span>
                  </div>
                </div>
                <div 
                  className={styles.notifItem}
                  onClick={() => { setShowNotifs(false); router.push('/assignments/create'); }}
                >
                  <div className={styles.notifContent}>
                    <p>Welcome to VedaAI! Create your first assignment.</p>
                    <span>1 hour ago</span>
                  </div>
                </div>
                <div 
                  className={styles.notifItem}
                  onClick={() => { setShowNotifs(false); router.push('/toolkit'); }}
                >
                  <div className={styles.notifContent}>
                    <p>New AI Toolkit feature available: Content Simplifier.</p>
                    <span>2 days ago</span>
                  </div>
                </div>
              </div>
              <div className={styles.notifFooter}>
                View all notifications
              </div>
            </div>
          )}
        </div>
        <div className={styles.profileWrapper} ref={profileRef}>
          <div className={styles.userMenu} onClick={() => setShowProfile(!showProfile)}>
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
            <span className={styles.userName}>{userName}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: showProfile ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {showProfile && (
            <div className={styles.profileDropdown}>
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatarLarge}>
                  <Image src="/school-avatar.png" alt="Avatar" width={48} height={48} style={{ borderRadius: '50%', objectFit: 'cover' }} unoptimized />
                </div>
                <div>
                  <h4>{userName}</h4>
                  <p>Teacher at DPS Bokaro</p>
                  {userEmail && <p className={styles.contactInfo}>{userEmail}</p>}
                  {userPhone && <p className={styles.contactInfo}>{userPhone}</p>}
                </div>
              </div>
              
              <div className={styles.profileProgress}>
                <div className={styles.progressHeader}>
                  <span>Profile Completion</span>
                  <span className={styles.progressPercent}>{completionPercent}%</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: `${completionPercent}%`, transition: 'width 0.4s ease-out' }}></div>
                </div>
                <p>{completionPercent === 100 ? 'Profile 100% complete! All features unlocked.' : 'Complete your profile to unlock all features.'}</p>
              </div>

              <div className={styles.profileLinks}>
                <button className={styles.profileBtn} onClick={handleUpdateNameEmail}>
                  <span>Update Name & Email</span>
                </button>
                <button className={styles.profileBtn} onClick={handleAddPhone}>
                  <span>Add Phone Number</span>
                </button>
                <button className={styles.profileBtn} onClick={() => { setShowProfile(false); router.push('/settings'); }}>
                  <span>Manage Preferences</span>
                </button>
                <div className={styles.divider}></div>
                <button className={`${styles.profileBtn} ${styles.logoutBtn}`}>
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
