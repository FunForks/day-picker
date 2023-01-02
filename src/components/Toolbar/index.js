/**
 * Toolbar
 */

import React from 'react'



const Toolbar = ({ children }) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
      }}
    >
      {children}
    </div>
  )
}

export default Toolbar

