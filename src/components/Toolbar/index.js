/**
 * Toolbar
 */

import React from 'react'



const Toolbar = ({ children }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100vw",
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      {children}
    </div>
  )
}

export default Toolbar

