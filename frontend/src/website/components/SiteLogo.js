import React from 'react'
import PropTypes from 'prop-types'
import appLogo from '../../assets/brand/app_logo.png'

const SiteLogo = ({ className = '' }) => (
  <img
    src={appLogo}
    alt="Vehicle State Tax"
    className={`site-logo-img ${className}`.trim()}
  />
)

SiteLogo.propTypes = {
  className: PropTypes.string,
}

export default SiteLogo
