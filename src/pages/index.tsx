import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import SEO from '@/components/global/SEO'
const Navbar = dynamic(async () => await import('@/components/partials/Navbar'), { ssr: false })
const Footer = dynamic(async () => await import('@/components/partials/Footer'), { ssr: false })
const WaitModal = dynamic(async () => await import('@/components/app/auth/LaunchModal'), { ssr: false })
import { NextPage } from 'next'


const Home: NextPage<any> = ({}: any) => {

  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {

  }, [])

  const toggleShow = (e: any) => {

      if(e) { e.preventDefault() }

      setShow(!show)
  }

  return (
    <>
      <SEO type='main' />

      <Navbar isFixed={true} />

      <section className='hero hero-home ui-full-bg-norm bg-brand-black ui-relative' style={{ backgroundImage: `url("../../../images/assets/bg--lg.png")` }}>

          <div className='container'>

              <div className='hero-inner'>

                  <div className='row hero-row justify-content-md-center justify-content-lg-start justify-content-start wp-100'>

                      <div className='col-md-5 col-lg-7 col-12'>

                          <h1 className='font-clashsemibold mrgb ui-line-height mrgt2 hero-header'>
                          The world's first <br />
                            platform for Tokenizing <br /> AI blockchain projects
                          </h1>

                          <div className='ui-group-button home mrgt4'>

                             {/* <Link onClick={(e) => toggleShow(e)} className="btn lg stretch bgd-yellow btn-full" href="">
                                  <span className="onwhite font-freibold onwhite fs-15 pdr">Join The Waitlist</span>
                                  <span className="fe fe-chevrons-right onwhite ui-relative fs-19" style={{ top: '0.21rem' }}></span>
                              </Link>
                              <span className='pdl pdr'></span>
                              <Link className="" href="/blog">
                                  <span className="onwhite font-freibold onwhite fs-15 pdr">Our Thoughts</span>
                                  <span className='link-round smd bgd-disable onwhite ui-relative' style={{ top: '2px' }}><i className='fe fe-chevron-right'></i></span>
                              </Link>  */}

                          </div>

                      </div>

                      <div className='col-md-6 offset-md-1'>
                          
                      </div>

                  </div>

              </div>

          </div>

      </section>

      <Footer />

      <WaitModal
          isShow={show} 
          closeModal={toggleShow} 
          modalTitle="Join Waitlist" 
          flattened={false} 
          slim="slim-mlg"
      />

    </>
  )
}

Home.getInitialProps = async (ctx: any) => {
    
    const { id } = ctx.query;
    return { id }

}

export default Home;