import React from 'react'
import playStoreBadge from '../../assets/images/PlayStoreButton.png'
import { PLAY_STORE_URL } from '../constants'

const PlayStoreLink = ({ className = '' }) => (
  <a
    className={`play-store-link ${className}`.trim()}
    href={PLAY_STORE_URL}
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={playStoreBadge} alt="Get it on Google Play" width={646} height={249} />
  </a>
)

export default PlayStoreLink
