import Footer from '../components/Footer'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

const HomePage = () => {
  return (
    <>
      <Head>
        <meta name="description" content="India Climate Resilience Atlas" />
        <title>India Climate Resilience Atlas</title>
      </Head>

      <div className='main_page_container'>
        <div className="background_img">
          <div className="banner-content">
            <h1> Climate resilience <br /> atlas for India</h1>
            <h3>Platform to enable climate risk-informed decision making and <br /> identify resilience strategies across sectors</h3>
          </div>
          <div className='home_btn'>
            <button className="VisitButton" style={{ background: "linear-gradient(to left, #ff5b36, #f59842)" }}>
              <Link href="/climate-risk"><span>Visualise the risks</span></Link>
            </button>
            <button className="VisitButton" style={{ background: "linear-gradient(to left, #86be40, #00c6ff)" }}>
              <Link href="/decision-support"><span>Identify resilience strategies</span></Link>
            </button>

          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default HomePage