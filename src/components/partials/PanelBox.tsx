import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IPanelBoxProps } from '../../utils/types';
import moment from 'moment'


const PanelBox = ({ display, show, animate, data, close, size  }: IPanelBoxProps) => {

    useEffect(() => {

    }, [])

    const closeX = (e: any): void => {
        if (e) e.preventDefault();
        close(e, null, 'close');
    }

    return (
        <>

            <div className={`panel-box ${show ? '' : 'ui-hide'}`}>

                <div className={`display ${size} ${animate ? 'animate-box' : ''}`}>

                    {/* Panel head */}
                    <div className='d-flex align-items-center'>

                        <h4 className='font-freimedium onwhite mrgb0 fs-15'>Subscriber Details</h4>

                        <div className='ml-auto'>
                            <Link onClick={(e) => closeX(e)} href="" className='link-round sm onwhite bgd-disable'>
                                <span className='fe fe-x fs-14'></span>
                            </Link>
                        </div>

                    </div>
                    {/* End Panel head */}

                    {/* Panel box body */}
                    <div className='panel-box-body'>

                        {
                            display === 'details' &&
                            <>
                                <div className='d-flex align-items-center justify-content-center mrgt2 mrgb'>

                                    <div 
                                    className='subber-dp ui-full-bg-norm ui-bg-center' 
                                    style={{ backgroundImage: `url(${data.dp && data.dp !== 'no-image.jpg' ? data.dp : "../../../images/assets/user-avatar.svg"})` }}></div>

                                </div>
                                <p className='mrgb2 font-frei onwhite fs-15 ui-text-center'>{ data.name }</p>
                                <div className='ui-line mrgb1' style={{ backgroundColor: "#312e67" }}></div>

                                <div className='d-flex align-items-center'>
                                    <span className='font-frei onwhite fs-13'>Name:</span>
                                    <span className='font-freimedium onwhite fs-13 ml-auto'>{ data.name }</span>
                                </div>
                                <div className='ui-line' style={{ backgroundColor: "#312e67" }}></div>
                                <div className='d-flex align-items-center'>
                                    <span className='font-frei onwhite fs-13'>Email:</span>
                                    <span className='font-freimedium onwhite fs-13 ml-auto'>{ data.email }</span>
                                </div>
                                <div className='ui-line' style={{ backgroundColor: "#312e67" }}></div>
                                <div className='d-flex align-items-center'>
                                    <span className='font-frei onwhite fs-13'>Joined at:</span>
                                    <span className='font-freimedium onwhite fs-13 ml-auto'>{ moment(data.createdAt).format('Do MMM, YYYY') }</span>
                                </div>
                                <div className='ui-line' style={{ backgroundColor: "#312e67" }}></div>
                                <div className='d-flex align-items-center'>
                                    <span className='font-frei onwhite fs-13'>Left at:</span>
                                    <span className='font-freimedium onwhite fs-13 ml-auto'>{ data.leftAt ? moment(data.leftAt).format('Do MMM, YYYY'): 'Not Yet' }</span>
                                </div>
                            </>
                        }

                    </div>
                    {/* End Panel box body */}

                </div>

            </div>
        
        </>
    )
  
}

export default PanelBox