import React from 'react'

const PageHeading = ({ title }) => {
  return (
    <div className='page_heading_container'>
      <div className="page_heading_bg">
        <div className="page_heading_content">
          <h3>{title}</h3>
        </div>


      </div>
    </div>
  )
}

export default PageHeading