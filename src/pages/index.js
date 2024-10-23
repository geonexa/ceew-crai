import Footer from '../components/Footer'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import Bg1 from "../../public/images/bg/map1.jpg"
import Image from 'next/image'
import climate_extreme from "../../public/images/climate_extreme.jpg"

const HomePage = () => {
  return (
    <>
      <Head>
        <meta name="description" content="Platform to enable climate risk-informed decision making and identify resilience strategies across sectors." />
        <title>Climate resilience atlas for India</title>
      </Head>

      <div className='main_page_container'>
        <div className="background_img">
          <div className="banner-content">
            <h1> Climate resilience <br /> atlas for India</h1>
            <h3>Platform to enable climate risk-informed decision making and <br /> identify resilience strategies across sectors.</h3>
          </div>
          <div className='home_btn'>
            <button className="VisitButton" style={{ background: "linear-gradient(to left, #ff5b36, #f59842)" }}>
              <Link href="/climate-risk"><span>Visualise the risks</span></Link>
            </button>
            <button className="VisitButton" style={{ background: "linear-gradient(to left, #86be40, #00c6ff)" }}>
              <Link href="/adaptation-tool"><span>Climate risk and adaptation tool</span></Link>
            </button>

          </div>

        </div>
      </div>


      <div className='about_para'>
        <div className='row'>
          <div className='col-md-6'>
            <p className='about_para_p'>
              The climate resilience team at CEEW envisions a future where institutions, infrastructure, economies, and people are insulated from the risks of a changing climate. We examine, identify, assess and predict risks related to extreme climate events such as floods, droughts, and cyclones, variabilities in temperature and rainfall, and the compounding impacts of associated climate events at the national and sub-national levels. We also work closely with state and district-level authorities to develop climate-action and disaster management plans. Further, we build tools to assess community resilience and adaptation capabilities and help climate-proof lives and livelihoods.
            </p>
            <button className="VisitButton" style={{ background: "linear-gradient(to left, #ff5b36, #f59842)", width:"200px", marginBottom:"20px" }}>
              <a href="https://www.ceew.in/research/climate-resilience" target='_blank'><span>Know More</span></a>
            </button>

          </div>
          <div className='col-md-6'>
            <div className='about_img'>

              <Image src={climate_extreme} alt='climate_extreme' />
              {/* <iframe style={{width:"100%", height:"100%", minHeight:"350px"}} src="https://www.youtube.com/embed/5lbxAgk2Gmk?si=mrEXZ32xu00LwAnC" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}

            </div>

          </div>

        </div>

      </div>

      {/* <div className='row home_section_container'>
        <div className='col-md-6 home_section'>
          <h1> EXPLORE THE MAP </h1>



        </div>

        <div className='col-md-6 home_section_img'>

          <Image src={Bg1} alt='Map' />

        </div>

      </div> */}




      <Footer />
    </>
  )
}

export default HomePage