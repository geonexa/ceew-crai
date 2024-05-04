import React from 'react'
import WCLLogo from "../../public/images/logo.png"
import Image from 'next/image';

const Footer = () => {

  return (
    <div>
      <div className="footer_section">
        <div className="footer_container">

          <div className="footer_logo">
            <Image src={WCLLogo} className="img-fluid" alt="logo" />
          </div>


          <div className="footer-text">
            <p>
              Council on Energy, Environment and Water <br />
              ISID Campus, 4, Vasant Kunj Institutional Area<br />
              New Delhi - 110070, India</p>
          </div>





          {/* <div className="footer_cta">
            <div style={{ display: "none" }}>


              <a href="https://clustrmaps.com/site/1byts" title="Visit tracker">
                <Image alt='Website Visitor Map' src="//www.clustrmaps.com/map_v2.png?d=uVciEhEn6_RY_CsbaIh8UZk1hUcNa3WTQ4HmMGOeuVU&cl=ffffff" /></a>
            </div>

          </div> */}

        </div>


        <div className="copyright_container">
          <div className="copyright_text">
            <p>&copy; 2024 CEEW. All rights reserved.</p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer