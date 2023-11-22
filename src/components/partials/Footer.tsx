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

                <div className=' bg-brand-bluedark'>

                    <div className='container'>

                        <div className='row'>

                            <div className='col-md-9'>

                                <div className='row'>

                                    <div className='col-md-12'>

                                        <div className='row'>

                                            

                                            

                                            

                                            <div className=''>

                                      

                                                <div className=' mt-md-0 mt-5 footer-content'>

                
                                                    <div className='col-md-6 ui-text-center mx-auto'>

                                                        <span className='font-frei fs-14' style={{ color: '#938FBD' }}>
                                                        © Creon {cDate.getFullYear()}. All rights reserved.
                                                        </span>

                                                    </div>
                                                    <ul className="social_media ui-list inline mrgt3 mrgb2">
                                                    <li className="onwhite"><a href="#" target="_blank" className="lkd link-underlined bg-bfgradient onwhite hover"><i className="fab fa-telegram onwhite fs-15" aria-hidden="true"></i></a></li>
                                                        <li className="onwhite"><a href="#" target="_blank" className="ig link-underlined hover onwhite bg-pgradient"><i className="fab fa-discord onwhite fs-15" aria-hidden="true"></i></a></li>
                                                        <li className="onwhite"><a href="#" target="_blank" className="fb link-underlined bg-btgradient onwhite hover"><i className="fab fa-twitter onwhite fs-15" aria-hidden="true"></i></a></li>
                                                    </ul>

                                                

                                                   

                                                </div>

                                            </div>

                                        </div>

                                    </div>



                                </div>

                            </div>

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