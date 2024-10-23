import { React } from 'react'
import '../../styles/global.css';
import '../../styles/responsive.css';

// import ScrollToTop from '@/components/ScrollToTop';
import MainHeader from '../components/MainHeader';
import WrapContexts from '../context/wrapContexts';


function MyApp({ Component, pageProps }) {


  return (
    <>
      <WrapContexts>
        <MainHeader />
        <Component {...pageProps} />
      </WrapContexts>
    </>
  )
}

export default MyApp
