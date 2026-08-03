import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { NAV_LINKS } from '../constants'
import SiteLogo from './SiteLogo'

const SiteHeader = () => {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="logo" to="/" onClick={() => setNavOpen(false)}>
          <SiteLogo />
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-label="Menu"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((open) => !open)}
        >
          ☰
        </button>
        <nav className={`nav ${navOpen ? 'open' : ''}`}>
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              onClick={() => setNavOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
