'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
//ボタン
import { SideMenuLogoutButton } from '@/components/ui/buttons/member/SideMenuLogoutButton';
import { SideMenuLoginButton } from '@/components/ui/buttons/member/SideMenuLoginButton';
import { SideMenuSignUpButton } from '@/components/ui/buttons/member/SideMenuSignUpButton';
//アイコン
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
//型定義
import { HeaderProps } from '@/types/member/Header';
//コンフィグ
import { texts } from '@/config/texts';
//CSS
import styles from '@/styles/Header.module.css';

export function HeaderComponent({ userId, userName, logoImagePath, nologinView, memberRegistrationFlg, pageSettingList, optionMemInvoice, liveauction, livebit }: HeaderProps) {
  const [isMemberMenuOpen, setMemberMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMemberMenu = () => setMemberMenuOpen(!isMemberMenuOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen)

  const [isMobileSubMenusOpen, setIsMobileSubMenusOpen] = useState<{ [key: string]: boolean }>({});


  const toggleSubMenu = (menu: string) => {
    setIsMobileSubMenusOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          {userId ? (
            <Link href="/member/top">
              <Image
                src={logoImagePath}
                alt=""
                className={styles.logo}
                width={100}
                height={100}
                style={{ width: 'auto', height: 'auto', objectFit: 'cover' }}
                priority
              />
            </Link>
          ) : (
            <Link href="/top">
              <Image
                src={logoImagePath}
                alt=""
                className={styles.logo}
                width={100}
                height={100}
                style={{ width: 'auto', height: 'auto', objectFit: 'cover' }}
                priority
              />
            </Link>
          )}


        </div>
        {userId ? (
          //ログイン済み
          <>
            <nav className={styles.menu}>
              <ul>
                <li><Link href="/member/calender">{texts.menu.memberAuction}</Link></li>
                {(liveauction || livebit) && (
                  <li><Link href="/member/live/bid">{texts.menu.memberJoinLive}</Link></li>
                )}
                <li className={styles.toggleMenu} onClick={toggleMemberMenu}>{texts.menu.memberMyPage}</li>
                <li><Link href="/member/contact">{texts.menu.memberContact}</Link></li>
                {pageSettingList.map((page) => (
                  <li key={page.pageSeq}><Link href={page.pageUrl}>{page.pageName}</Link></li>
                ))}
              </ul>

            </nav>
            <span className={styles.menu}>{userName || ''}様</span>
          </>
        ) : (
          //未ログイン
          <>
            <nav className={styles.menu}>
              <ul>
                {nologinView && (
                  <>

                    <li><Link href="/calender">{texts.menu.memberAuction}</Link></li>
                  </>
                )}
                {memberRegistrationFlg && (
                  <li><Link href="/signup">{texts.button.newSignup}</Link></li>
                )}

                <li><Link href="/contact">{texts.menu.memberContact}</Link></li>
                {pageSettingList.map((page) => (
                  <li key={page.pageSeq}><Link href={page.pageUrl} target="_brank">{page.pageName}</Link></li>
                ))}
              </ul>
            </nav>

            <span className={styles.menu}><Link href="/login">{texts.button.login}</Link></span>
          </>
        )}
        <button className={styles.menuIcon} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {isMemberMenuOpen && (
          <ul className={styles.dropdown}>
            <li><Link href="/member/mypage/results">{texts.menu.memberRakusatsu}</Link></li>
            {optionMemInvoice && (
              <li><Link href="/member/mypage/invoice">{texts.menu.memberInvoice}</Link></li>
            )}
            <li><Link href="/member/mypage/account">{texts.menu.memberAccount}</Link></li>
            <li><Link href="/member/mypage/changePassword">{texts.menu.changePassword}</Link></li>
            <li><Link href="/login">{texts.button.logout}</Link></li>
          </ul>
        )}
        {isMobileMenuOpen && (
          <nav className={styles.sideMenu}>
            <ul>
              <li>
                <div className={styles.menuItem}>
                  {userId ? (
                    <Link href="/member/calender">{texts.menu.memberAuction}</Link>
                  ) : (
                    nologinView && <Link href="/calender">{texts.menu.memberAuction}</Link>
                  )}
                </div>

                {userId && (
                  <>
                    <div className={styles.menuItem} onClick={() => toggleSubMenu('mypage')}>
                      {texts.menu.memberMyPage}
                      <span>{isMobileSubMenusOpen['mypage'] ? <RemoveIcon /> : <AddIcon />}</span>
                    </div>
                    {isMobileSubMenusOpen['mypage'] && (
                      <ul className={styles.subMenu}>
                        <li><Link href="/member/mypage/results">{texts.menu.memberRakusatsu}</Link></li>
                        {optionMemInvoice && (
                          <li><Link href="/member/mypage/invoice">{texts.menu.memberInvoice}</Link></li>
                        )}

                        <li><Link href="/member/mypage/account">{texts.menu.memberAccount}</Link></li>
                        <li><Link href="/member/mypage/changePassword">{texts.menu.changePassword}</Link></li>
                      </ul>
                    )}
                  </>
                )}

                {pageSettingList.map((page) => (
                  <div className={styles.menuItem} key={page.pageSeq}>

                    <li ><Link href={page.pageUrl}>{page.pageName}</Link></li>

                  </div>
                ))}
                <div className={styles.menuItem}>
                  {userId ? (
                    <Link href="/member/contact">{texts.menu.memberContact}</Link>
                  ) : (
                    <Link href="/contact">{texts.menu.memberContact}</Link>
                  )}
                </div>
              </li>
            </ul>
            <div className={styles.buttonContainer}>
              {userId ? (

                <SideMenuLogoutButton isAdmin={false} />

              ) : (
                <>
                  <SideMenuLoginButton />
                  <SideMenuSignUpButton />
                </>
              )}
            </div>
          </nav>
        )}

      </header>
      <>

      </>
    </>
  );
}

