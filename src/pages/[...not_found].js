import Head from 'next/head'
import React from 'react'

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <meta name="description" content="India Climate Resilience Atlas" />
        <title>Not Found</title>
      </Head>
      <div className='page_container'>
        <h1>Page not found</h1>
      </div>
    </>

  )
}

export default NotFoundPage