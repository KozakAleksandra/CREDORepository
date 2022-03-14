import React from 'react'
import "./WithStarBackground.css"

export const WithStarBackground = (Component) => {
  return (
    <div className='star-bg-container'><Component />
      <div className="stars1"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
    </div>
  )
}
