'use client';
import React, { useState,useEffect,useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
//コンフィグ
import { texts } from '@/config/texts';
//コンポーネント
import { hasPermission, KengenMap } from '@/components/admin/PermissoionsComponent';
//ボタン
import { SideMenuLogoutButton } from '@/components/ui/buttons/member/SideMenuLogoutButton';
//スタイル
import styles from '@/styles/Header.module.css';
//アイコン
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


interface HeaderProps {
  userName: string | null;
  logoImagePath: string;
  kengen: KengenMap[];
}


export function HeaderComponent({ userName, logoImagePath, kengen }: HeaderProps) {

  const [isMemberMenuOpen, setMemberMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMemberMenu = () => setMemberMenuOpen(!isMemberMenuOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen)

  const [isSubMenusOpen, setIsSubMenusOpen] = useState<{ [key: string]: boolean }>({});

  const toggleSubMenu = (menu: string) => {
    setIsSubMenusOpen((prev) => {
      const newIsSubMenusOpen = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false; // 他のサブメニューをすべて閉じる
        return acc;
      }, {} as { [key: string]: boolean });
      newIsSubMenusOpen[menu] = !prev[menu]; // 対象のサブメニューのみトグルする
      return newIsSubMenusOpen;
    });
  };

  const dropdownRef = useRef<HTMLUListElement | null>(null);
  

  const router = useRouter();
  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}logout`, {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/admin/login');
  };



  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
        <Link href="/admin/dashboard">
        <Image
          src={logoImagePath}
          alt=""
          className={styles.logo}
          width={100}
          height={100} // 明示的に指定
          style={{ width: '100px', height: '50px', objectFit: 'contain' }} 
          priority
        />
        </Link>
        </div>
        <nav className={styles.menu}>
         <ul ref={dropdownRef}>
            <li className={styles.toggleMenu} onClick={() => toggleSubMenu('member')}>{texts.menu.adminMemberTitle}</li>
            {isSubMenusOpen['member'] && (
              <ul className={styles.adminDropdown}>
                {hasPermission(kengen, 101) && <li ><Link href="/admin/member/register">{texts.menu.adminMemberRegist}</Link></li>}
                {hasPermission(kengen, 102) && <li><Link href="/admin/member/search">{texts.menu.adminMemberList}</Link></li>}
                {hasPermission(kengen, 103) && <li><Link href="/admin/member/addinfoItemRegister">{texts.menu.adminMemberAddinfoItemRegist}</Link></li>}
                {hasPermission(kengen, 104) && <li><Link href="/admin/member/torihikijisseki/search">{texts.menu.adminTorihikiJisseki}</Link></li>}
              </ul>
            )}
            <li className={styles.toggleMenu} onClick={() => toggleSubMenu('goods')}>{texts.menu.adminGoodsTitle}</li>
            {isSubMenusOpen['goods'] && (
              <ul className={styles.adminDropdown}>
                {hasPermission(kengen, 201) && <li><Link href="/admin/goods/register">{texts.menu.adminGoodsRegist}</Link></li>}
                {hasPermission(kengen, 202) && <li><Link href="/admin/goods/search">{texts.menu.adminGoodsList}</Link></li>}
                {hasPermission(kengen, 203) && <li><Link href="/admin/goods/bulkRegister">{texts.menu.adminGoodsBulkRegist}</Link></li>}
                {hasPermission(kengen, 206) && <li><Link href="/admin/goods/addinfoItemRegister">{texts.menu.adminGoodsAddinfoItemRegist}</Link></li>}
                {hasPermission(kengen, 207) && <li><Link href="/admin/goods/category">{texts.menu.adminCategoryRegist}</Link></li>}
              </ul>
            )}
            <li className={styles.toggleMenu} onClick={() => toggleSubMenu('auction')}>{texts.menu.adminAuctionTitle}</li>
            {isSubMenusOpen['auction'] && (
              <ul className={styles.adminDropdown}>
                {hasPermission(kengen, 301) && <li><Link href="/admin/auction/register">{texts.menu.adminKaisaiRegist}</Link></li>}
                {hasPermission(kengen, 302) && <li><Link href="/admin/auction/bid/search">{texts.menu.adminBidList}</Link></li>}
                {hasPermission(kengen, 303) && <li><Link href="/admin/auction/bid/logSearch">{texts.menu.adminBidLogList}</Link></li>}
                {hasPermission(kengen, 304) && <li><Link href="/admin/live/auctioner">{texts.menu.adminLiveAuctioner}</Link></li>}
                {hasPermission(kengen, 305) && <li><Link href="/admin/live/bidunit">{texts.menu.adminLiveBidUnitRegist}</Link></li>}
                {hasPermission(kengen, 306) && <li><Link href="/admin/live/message">{texts.menu.adminLiveMessageRegist}</Link></li>}
              </ul>
            )}
            <li className={styles.toggleMenu} onClick={() => toggleSubMenu('staff')}>{texts.menu.adminStaffTitle}</li>
            {isSubMenusOpen['staff'] && (
              <ul className={styles.adminDropdown}>
                {hasPermission(kengen, 401) && <li><Link href="/admin/staff/register">{texts.menu.adminStaffRegist}</Link></li>}
                {hasPermission(kengen, 402) && <li><Link href="/admin/staff/search">{texts.menu.adminStaffList}</Link></li>}
                {hasPermission(kengen, 403) && <li><Link href="/admin/staff/kengen">{texts.menu.adminKengenRegist}</Link></li>}
              </ul>
            )}
            <li className={styles.toggleMenu} onClick={() => toggleSubMenu('setting')}>{texts.menu.adminSettingTitle}</li>
            {isSubMenusOpen['setting'] && (
              <ul className={styles.adminDropdown}>
                {hasPermission(kengen, 501) && <li><Link href="/admin/setting/info/register">{texts.menu.adminInfoRegist}</Link></li>}
                {hasPermission(kengen, 502) && <li><Link href="/admin/setting/topImage/register">{texts.menu.adminTopImageRegist}</Link></li>}
                {hasPermission(kengen, 503) && <li><Link href="/admin/setting/system/register">{texts.menu.adminSystemRegist}</Link></li>}
                {hasPermission(kengen, 504) && <li><Link href="/admin/setting/admin/register">{texts.menu.adminAdminRegist}</Link></li>}
                {hasPermission(kengen, 505) && <li><Link href="/admin/setting/mail/register">{texts.menu.adminMailRegist}</Link></li>}
                {hasPermission(kengen, 506) && <li><Link href="/admin/setting/page/register">{texts.menu.adminPageSetting}</Link></li>}
              </ul>
            )}
          </ul>

        </nav>
        <nav className={styles.menu}>
        <ul ref={dropdownRef}>
        <li className={styles.toggleMenu }  onClick={() => toggleSubMenu('mypage')}>{userName || ''}様</li>
        {isSubMenusOpen['mypage'] && (
            <ul className={styles.adminDropdown}>
              <li><Link href="/admin/changePassword">{texts.menu.changePassword}</Link></li>
             
            </ul>
          )}
          </ul>
          <li onClick={handleLogout} className={`${styles.logoutBtn} ${styles.toggleMenu}`}>{texts.button.logout}</li>
        </nav>


        <button className={styles.menuIcon} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        {isMobileMenuOpen && (
          <>
            <nav className={styles.sideMenu}>
              <ul>
                <li>
                  <div className={styles.menuItem} onClick={() => toggleSubMenu('member')}>
                    {texts.menu.adminMemberTitle}
                    <span>{isSubMenusOpen['member'] ? <RemoveIcon /> : <AddIcon />}</span>
                  </div>
                  {isSubMenusOpen['member'] && (
                    <ul className={styles.subMenu}>
                      {hasPermission(kengen, 101) && <li ><Link href="/admin/member/register">{texts.menu.adminMemberRegist}</Link></li>}
                      {hasPermission(kengen, 102) && <li><Link href="/admin/member/search">{texts.menu.adminMemberList}</Link></li>}
                      {hasPermission(kengen, 103) && <li><Link href="/admin/member/addinfoItemRegister">{texts.menu.adminMemberAddinfoItemRegist}</Link></li>}
                    </ul>
                  )}
                  <div className={styles.menuItem} onClick={() => toggleSubMenu('goods')}>
                    {texts.menu.adminGoodsTitle}
                    <span>{isSubMenusOpen['goods'] ? <RemoveIcon /> : <AddIcon />}</span>
                  </div>
                  {isSubMenusOpen['goods'] && (
                    <ul className={styles.subMenu}>
                      {hasPermission(kengen, 201) && <li><Link href="/admin/goods/register">{texts.menu.adminGoodsRegist}</Link></li>}
                      {hasPermission(kengen, 202) && <li><Link href="/admin/goods/search">{texts.menu.adminGoodsList}</Link></li>}
                      {hasPermission(kengen, 203) && <li><Link href="/admin/goods/bulkRegister">{texts.menu.adminGoodsBulkRegist}</Link></li>}
                      {hasPermission(kengen, 206) && <li><Link href="/admin/goods/addinfoItemRegister">{texts.menu.adminGoodsAddinfoItemRegist}</Link></li>}
                      {hasPermission(kengen, 207) && <li><Link href="/admin/category/register">{texts.menu.adminCategoryRegist}</Link></li>}
                    </ul>
                  )}
                  <div className={styles.menuItem} onClick={() => toggleSubMenu('auction')}>
                    {texts.menu.adminAuctionTitle}
                    <span>{isSubMenusOpen['auction'] ? <RemoveIcon /> : <AddIcon />}</span>
                  </div>
                  {isSubMenusOpen['auction'] && (
                    <ul className={styles.subMenu}>
                      {hasPermission(kengen, 301) && <li><Link href="/admin/auction/register">{texts.menu.adminKaisaiRegist}</Link></li>}
                      {hasPermission(kengen, 204) && <li><Link href="/admin/bid/search">{texts.menu.adminBidList}</Link></li>}
                      {hasPermission(kengen, 205) && <li><Link href="/admin/bid/logSearch">{texts.menu.adminBidLogList}</Link></li>}
                    </ul>
                  )}
                  <div className={styles.menuItem} onClick={() => toggleSubMenu('staff')}>
                    {texts.menu.adminStaffTitle}
                    <span>{isSubMenusOpen['staff'] ? <RemoveIcon /> : <AddIcon />}</span>
                  </div>
                  {isSubMenusOpen['staff'] && (
                    <ul className={styles.subMenu}>
                      {hasPermission(kengen, 401) && <li><Link href="/admin/staff/register">{texts.menu.adminStaffRegist}</Link></li>}
                      {hasPermission(kengen, 402) && <li><Link href="/admin/staff/search">{texts.menu.adminStaffList}</Link></li>}
                      {hasPermission(kengen, 403) && <li><Link href="/admin/kengen/register">{texts.menu.adminKengenRegist}</Link></li>}
                    </ul>
                  )}
                  <div className={styles.menuItem} onClick={() => toggleSubMenu('setting')}>
                    {texts.menu.adminSettingTitle}
                    <span>{isSubMenusOpen['setting'] ? <RemoveIcon /> : <AddIcon />}</span>
                  </div>
                  {isSubMenusOpen['setting'] && (
                    <ul className={styles.subMenu}>
                      {hasPermission(kengen, 501) && <li><Link href="/admin/info/register">{texts.menu.adminInfoRegist}</Link></li>}
                      {hasPermission(kengen, 502) && <li><Link href="/admin/topImage/register">{texts.menu.adminTopImageRegist}</Link></li>}
                      {hasPermission(kengen, 503) && <li><Link href="/admin/system/register">{texts.menu.adminSystemRegist}</Link></li>}
                      {hasPermission(kengen, 504) && <li><Link href="/admin/admin/register">{texts.menu.adminAdminRegist}</Link></li>}
                      {hasPermission(kengen, 505) && <li><Link href="/admin/mail/register">{texts.menu.adminMailRegist}</Link></li>}
                      {hasPermission(kengen, 506) && <li><Link href="/admin/page/register">{texts.menu.adminPageSetting}</Link></li>}
                      
                    </ul>
                  )}

                </li>
              </ul>
              <div className={styles.buttonContainer}>
                 <SideMenuLogoutButton  isAdmin={true} /> 
              </div>
            </nav>
          </>
        )}


      </header>
    </>
  );
};

