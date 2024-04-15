import { useLayoutEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useGlobalContext, useStorageContext, ReactProps } from '@global';
import UploadPostWindow from './upload-post-window.component';
import SearchSide from './search-side.component';
import { SidebarLink } from '../types/layout.d';
import styles from '../styles/components/sidebar.module.sass';
import searchStyles from '../styles/components/search-side.module.sass';
import effects from '@sass/effects.module.sass';
import logoURL from '@assets/images/logo.svg';

function Sidebar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const [minimize, setMinimize] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { setAuthenticationStorage } = useStorageContext();
  const { activeLink, setActiveLink, getActiveLink, activeLinkHandler } = useGlobalContext();

  function logoutHandler(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setAuthenticationStorage({ user: null, isAuthenticated: false });
    localStorage.removeItem('activeLink');
    setActiveLink('home');
    navigate('/login');
  }

  useLayoutEffect(() => {
    setActiveLink(activeLink);
  }, [activeLink, setActiveLink]);

  const sidebarLinks = [
    {
      name: 'home',
      icon: 'icon-home',
      path: '/',
    },
    {
      name: 'search',
      icon: 'icon-search',
      path: '#',
      onClick: () => {
        searchExitHandler();
        if (activeLink === 'create post') setShowCreatePost(!showCreatePost);
      },
    },
    {
      name: 'explore',
      icon: 'icon-compass',
      path: '/explore',
    },
    {
      name: 'create post',
      icon: 'icon-plus-squared-alt',
      path: '#',
      onClick: () => {
        createPostExitHandler();
        if (activeLink === 'search') {
          setMinimize(!minimize);
          setShowSearch(!showSearch);
        }
      },
    },
    {
      name: 'profile',
      icon: 'icon-user',
      path: `/profile/${user.id}`,
    },
    {
      name: 'logout',
      icon: 'icon-logout',
      path: '/login',
      notActive: true,
      onClick: logoutHandler,
    },
  ] as SidebarLink[];

  function searchExitHandler() {
    setMinimize(!minimize);
    setShowSearch(!showSearch);
  }
  function createPostExitHandler() {
    setShowCreatePost(!showCreatePost);
  }

  return (
    <>
      {showCreatePost && (
        <UploadPostWindow
          onExit={() => {
            createPostExitHandler();
            activeLinkHandler(getActiveLink());
          }}
          method="post"
        />
      )}
      <div className={clsx(styles.wrapper, 'h-100', 'float-start', 'd-flex')}>
        <SearchSide
          className={clsx(showSearch && searchStyles['slide-to-right'])}
          onExit={() => {
            searchExitHandler();
            activeLinkHandler('profile');
          }}
        />
        <nav
          className={clsx(
            styles.sidebar,
            effects['flicker-one'],
            'h-100',
            'd-flex flex-column',
            activeLink === 'search' && 'z-3',
            minimize && styles.minimize
          )}
        >
          <Brand onClick={() => setActiveLink('home')} />
          <ul className={clsx('d-flex flex-column align-items-center')}>
            {sidebarLinks.map((tag) => {
              return (
                <li
                  key={tag.name}
                  className={clsx(
                    styles[`sidebar-link`],
                    'mb-3 rounded-3',
                    activeLink === tag.name && `${styles.active} active`
                  )}
                  aria-current="page"
                >
                  <Link
                    to={tag.path}
                    className={clsx(
                      styles['link'],
                      'w-100 h-100',
                      'd-flex align-items-center',
                      'text-capitalize'
                    )}
                    onClick={(event) => {
                      if (tag.onClick) {
                        tag.onClick(event);
                      }
                      if (!tag.notActive) {
                        if (activeLink === 'search') searchExitHandler();
                        localStorage.setItem('activeLink', tag.name);
                        activeLinkHandler(tag.name);
                      }
                    }}
                  >
                    <i
                      className={clsx(
                        styles['link-icon'],
                        `${tag.icon}`,
                        'h-100',
                        'fs-5 position-relative'
                      )}
                    ></i>
                    <p className={clsx(styles['link-text'], 'ms-3', 'text-nowrap')}>{tag.name}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}

function Brand({ onClick }: ReactProps) {
  return (
    <Link
      to="/"
      className={clsx(styles.brand, 'my-5', 'd-flex justify-content-center align-items-center')}
      onClick={onClick}
    >
      <img src={logoURL} className={styles.logo} width={40} height={40} alt="logo" />
      <span className={clsx(styles['brand-name'], 'ms-2', 'fs-2 fw-bold')}>Bygram</span>
    </Link>
  );
}

export default Sidebar;