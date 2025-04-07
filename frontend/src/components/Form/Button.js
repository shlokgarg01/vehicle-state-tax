import React from 'react'

export default function Button({
  title,
  onClick,
  btnSmall,
  marginTop,
  marginBottom,
  fullWidth,
  disabled = false,
  color = 'primary',
  type = 'button',
}) {
  return (
    <button
      type={type}
      className={`btn text-light btn-${color}
              ${btnSmall ? 'btn-sm' : ''} 
              ${marginTop ? 'mt-3' : ''} 
              ${marginBottom ? 'mb-3' : ''} 
              ${fullWidth ? 'w-100' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  )
}
