import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IFooterProps } from '../../utils/types'
import LaunchModal from '../app/auth/LaunchModal'

const Footer = ({ bgColor, className }: Partial<IFooterProps>) => {

    let cDate = new Date()
    const [show, setShow] = useState<boolean>(false)

    useEffect(() => {

    }, [])
    const toggleShow = (e: any) => {

        if(e) { e.preventDefault() }

        setShow(!show)
    }


    return (
        <>

            <footer id="footer" className={`footer bg-brand-black ${className && className}`}>

                <div className='ui-wrapper-large bg-brand-bluedark'>

                    <div className='container'>

                        <div className='row'>

                            <div className='col-md-3'>

                                <Link href="/" className='footer-logo ui-relative ui-hide-mobile-only' style={{ top: '-8px' }}>
                                    <img src="../../../images/assets/logo-white.svg" alt="brand-logo" />
                                </Link>

                            </div>

                            <div className='col-md-9'>

                                <div className='row'>

                                    <div className='col-md-12'>

                                        <div className='row'>

                                            <div className='col-md-3 col-6'>
                                                <div className=' mt-md-0 mt-5'>

                                                    <h4 className='onwhite fs-16 font-clashsemibold mrgb0'>Company</h4>
                                                    <ul className='ui-list block mrgt3'>
                                                        <li><Link onClick={(e) => toggleShow(e)} href="" className='font-frei fs-14 onwhite'>About</Link></li>
                                                        <li><Link onClick={(e) => toggleShow(e)} href="" className='font-frei fs-14 onwhite'>Diversity + Inclusion</Link></li>
                                                        <li><Link onClick={(e) => toggleShow(e)} href="" className='font-frei fs-14 onwhite'>Careers</Link></li>
                                                        <li><Link onClick={(e) => toggleShow(e)} href="" className='font-frei fs-14 onwhite'>Privacy Policy</Link></li>
                                                    </ul>
                                                </div>


                                            </div>

                                            <div className='col-md-3 col-6'>
                                                <div className=' mt-md-0 mt-5'>

                                                    <h4 className='onwhite fs-16 font-clashsemibold mrgb0'>Resources</h4>
                                                    <ul className='ui-list block mrgt3'>
                                                        <li><Link onClick={(e) => toggleShow(e)} href="" className='font-frei fs-14 onwhite'>Courses</Link></li>
                                                        <li><Link onClick={(e) => toggleShow(e)} href="" className='font-frei fs-14 onwhite'>Blog</Link></li>
                                                        <li><Link onClick={(e) => toggleShow(e)} href="" className='font-frei fs-14 onwhite'>Tutorials</Link></li>
                                                        <li><Link onClick={(e) => toggleShow(e)} href="" className='font-frei fs-14 onwhite'>Podcast</Link></li>
                                                        <li><Link onClick={(e) => toggleShow(e)} href="" className='font-frei fs-14 onwhite'>FAQs</Link></li>
                                                    </ul>
                                                </div>


                                            </div>

                                            <div className='col-md-3 col-6'>
                                                <div className=' mt-md-0 mt-5'>

                                                    <h4 className='onwhite fs-16 font-clashsemibold mrgb0'>Products</h4>
                                                    <ul className='ui-list block mrgt3'>
                                                        <li><Link onClick={(e) => toggleShow(e)} href="" className='font-frei fs-14 onwhite'>For Schools</Link></li>
                                                        <li><Link onClick={(e) => toggleShow(e)} href="" className='font-frei fs-14 onwhite'>For Startups</Link></li>
                                                        <li><Link onClick={(e) => toggleShow(e)} href="" className='font-frei fs-14 onwhite'>For Businesses</Link></li>
                                                        <li><Link onClick={(e) => toggleShow(e)} href="" className='font-frei fs-14 onwhite'>For Educators</Link></li>
                                                    </ul>

                                                </div>

                                            </div>

                                            <div className='col-md-3 col-6'>

                                                <div className='pdr3 mt-md-0 mt-5'>

                                                    <h4 className='onwhite fs-16 font-clashsemibold mrgb0'>Contact</h4>

                                                    <ul className="social_media ui-list inline mrgt3 mrgb2">
                                                        <li className="onwhite"><a href="https://twitter.com/concreap" target="_blank" className="fb link-underlined bg-btgradient onwhite hover"><i className="fab fa-twitter onwhite fs-15" aria-hidden="true"></i></a></li>
                                                        <li className="onwhite"><a href="https://www.instagram.com/concreap/" target="_blank" className="ig link-underlined hover onwhite bg-pgradient"><i className="fab fa-instagram onwhite fs-15" aria-hidden="true"></i></a></li>
                                                        <li className="onwhite"><a href="https://www.linkedin.com/company/concreap/" target="_blank" className="lkd link-underlined bg-bfgradient onwhite hover"><i className="fab fa-linkedin onwhite fs-15" aria-hidden="true"></i></a></li>
                                                    </ul>

                                                    <div>
                                                        <a href='mailto:hello@concreap.com' className='fs-14'>
                                                            <span className='fe fe-mail fs-14 onwhite ui-relative' style={{ top: '1px' }}></span>
                                                            <span className='font-frei fs-14 onwhite pdl'>hello@concreap.com</span>
                                                        </a>
                                                    </div>

                                                    <div>
                                                        <a href='tel:+2348137031202' className='fs-14'>
                                                            <span className='fe fe-phone fs-14 onwhite ui-relative' style={{ top: '1px' }}></span>
                                                            <span className='font-frei fs-14 onwhite pdl'>+2348137031202</span>
                                                        </a>
                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>



                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                <div className='copyright ui-wrapper-medium'>

                    <div className='row'>

                        <div className='col-md-6 ui-text-center mx-auto'>

                            <span className='font-frei fs-14' style={{ color: '#938FBD' }}>
                                Copyright @ {cDate.getFullYear()}, Concreap Technologies.  All rights reserverd.
                            </span>

                        </div>

                    </div>

                </div>

            </footer>

            <LaunchModal
                isShow={show} 
                closeModal={toggleShow} 
                modalTitle="Coming Soon!" 
                flattened={false} 
                slim="slim-mlg"
            />

        </>
    )

}

export default Footer