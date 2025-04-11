import React from 'react'

export default function Button({
  title,
  onClick,
  btnSmall,
  marginTop,
  marginBottom,
  btnLarge,
  fullWidth,
  fullHeight,
  disabled = false,
  color = 'primary',
  type = 'button',
}) {
  return (
    <button
      type={type}
      className={`btn text-light btn-${color}
              ${btnSmall ? 'btn-sm' : ''} 
                ${btnLarge ? 'btn-lg' : ''}
              ${marginTop ? 'mt-3' : ''} 
              ${marginBottom ? 'mb-3' : ''} 
              ${fullWidth ? 'w-100' : ''} 
     ${fullHeight ? 'h-[80%]' : ''}
`}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  )
}
