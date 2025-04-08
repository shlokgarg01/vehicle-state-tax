import React from 'react'
import './Loader.css'

const Loader = ({ small }) => {
  return (
    <div className={small ? 'loading_sm' : 'loading'}>
      <div />
    </div>
  )
}

export default Loader
