import React from 'react'
import PropTypes from 'prop-types'

const PageHero = ({ title, subtitle }) => (
  <div className="page-hero">
    <div className="container">
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  </div>
)

PageHero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
}

export default PageHero
