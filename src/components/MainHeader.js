import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import Logo from "../../public/images/logo.png"
import { useRouter } from 'next/router';
import Image from 'next/image';

const MainHeader = () => {
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();  

    const handleToggle = () => {
        setShowMenu(!showMenu);
    };

    const handleLinkClick = () => {
        setShowMenu(false);
    };

    const isActive = (path) => {
        return router.pathname === path;
    };


    return (
        <>
            <div className='navbar_main_container'>
                <div className='short_nav_container'>
                    <div className='logo_text'>
                        <h1>Climate resilience atlas for India</h1>
                    </div>

                    <div className="main_nav_logo">
                        <Image src={Logo} alt="nav_logo" />
                    </div>

                    <div className="navbar_toggle scrolled" onClick={handleToggle}>
                        {showMenu ? <FaTimes /> : <FaBars />}
                    </div>
                </div>


                <div className='navbar_container'>

                    <div className={`main_nav ${showMenu ? 'show' : ''}`}>
                        <div className="nav_content">

                            <div className='nav_list'>

                                <Link href="/" className={isActive('/') ? 'active_nav' : 'nav_item'} onClick={handleLinkClick}>
                                    Home
                                </Link>

                                <Link href="/climate-risk" className={isActive('/climate-risk') ? 'active_nav' : 'nav_item'} onClick={handleLinkClick}>
                                    Visualise climate risks
                                </Link>

                                <Link className={isActive('/decision-support') ? 'active_nav' : 'nav_item'} onClick={handleLinkClick}
                                    href="/decision-support" >
                                    Decision support
                                </Link>

                                <Link className={isActive('/adaptation-tool') ? 'active_nav' : 'nav_item'} onClick={handleLinkClick}
                                    href="/adaptation-tool" >
                                    Climate risk and adaptation tool
                                </Link>


                                <Link className={isActive('/download') ? 'active_nav' : 'nav_item'} onClick={handleLinkClick}
                                    href="/download" >
                                    Data download
                                </Link>


                                <Link
                                    className={isActive('/about') ? 'active_nav' : 'nav_item'}
                                    href="/about" onClick={handleLinkClick}>
                                    About
                                </Link>

                                <Link
                                    className={isActive('/contact') ? 'active_nav' : 'nav_item'}
                                    href="/contact" onClick={handleLinkClick}>
                                    Contact Us
                                </Link>


                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainHeader
