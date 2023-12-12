'use client'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

import { usePathname } from 'next/navigation'
import { useState } from 'react'

const Header = () => {
  const [navShow, setNavShow] = useState(false)
  const onToggleNav = () => {
    setNavShow((status) => {
      return !status
    })
  }
  const pathname = usePathname()

  return (
    <header>
      <div className="flex items-center justify-between py-10">
        <div className="text-primary">
            <div className="flex items-center justify-between ">
              {typeof siteMetadata.headerTitle === 'string' ? (
                <Link href="/" aria-label={siteMetadata.headerTitle} className="text-gray-900 dark:text-gray-100">
                  <div className="h-6 text-2xl font-semibold">{siteMetadata.headerTitle}</div>
                  </Link>
              ) : (
                <Link href="/" aria-label={siteMetadata.headerTitle} className="text-gray-900 dark:text-gray-100" >
                siteMetadata.headerTitle
                  </Link>
              )}
            </div>
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
            {headerNavLinks
              .filter((link) => link.href !== '/')
              .map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className={`hidden font-medium text-gray-900 hover:underline dark:text-gray-100 sm:block ${
                    pathname.startsWith(link.href) ? 'underline decoration-dotted' : ''
                  }`}
                >
                  {link.title}
                </Link>
              ))}
            {/* <SearchButton /> */}
            <ThemeSwitch />
          </div>
        </div>
        <button
          type="button"
          className="ml-1 mr-1 h-8 w-8 rounded sm:hidden"
          aria-label="Toggle Menu"
          onClick={onToggleNav}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div></div>
      <div className={`block sm:hidden ${navShow ? '' : 'hidden'}`}>
        <nav className="flex-col items-center justify-between">
          <hr />
          {headerNavLinks.map((link) => (
            <div key={link.title} className="px-2 py-2">
              <h4 key={link.title}>
                <Link
                  href={link.href}
                  onClick={onToggleNav}
                  className={`underline-offset-2 hover:underline ${
                    pathname.startsWith(link.href) ? 'underline decoration-dotted' : ''
                  }`}
                >
                  {link.title}
                </Link>
              </h4>
            </div>
          ))}
          <div className="px-2 py-2">
            <ThemeSwitch />
          </div>
        </nav>
        <hr />
      </div>
      {/* <MobileNav /> */}
    </header>
  )
}

export default Header
