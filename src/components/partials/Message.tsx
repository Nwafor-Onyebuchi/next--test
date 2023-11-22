import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IMessageCompProps } from '../../utils/types'

import lottieSuccess from '../../_data/dark-check.json'
import lottieError from '../../_data/check-error.json'


const MessageComp = ({
    title, 
    message, action, status, 
    lottieSize, loop, actionType, 
    buttonText, setBg, bgColor,
    buttonPosition, 
    slim, 
    slimer, className,
    displayTitle,
    displayMessage,
    titleColor,
    messageColor
}: Partial<IMessageCompProps>) => {

    const navigate = useRouter()

    useEffect(() => {

    }, [])

    const fireAction = (e: any): void => {

        if(e) e.preventDefault();

        if(actionType === 'close'){
            action(e);
        }else{

            if(typeof(action) === 'string' && action){
                navigate.push(action);
            }else{
                action(e)
            }

        }

        

    }

    return (
        <>
            <div className={`${className ? className :  ''} ${slim ? 'pdl2 pdr2' : slimer ?  'pdl4 pdr4' : ''}`}>
                <div style={ {  backgroundColor: setBg ? bgColor : 'transparent', padding: setBg ? '1.5rem 1.5rem' : '', borderRadius: setBg ? '1.5rem' : '' } }>

                    {/* <div className="mrgt0">
                        <LottiePlayer 
                        lottieData={status && status === 'success' ? lottieSuccess : lottieError} 
                        height={lottieSize ? lottieSize : 130} width={lottieSize ? lottieSize : 130} 
                        loop={loop ? loop : false} />
                    </div> */}

                    <div className='ui-text-center'>
                        <span className='link-round xlg' style={{ backgroundColor: "#171545" }}>
                            <i className='fe fe-check fs-40' style={{ color: '#26D758' }}></i>
                        </span>
                    </div>

                    <div className="ui-text-center mrgt mrgb2">
                        {
                            (displayTitle === undefined || displayTitle === true) &&
                            <h1 className="fs-23 font-freibold mrgb mrgt2" style={{ color: "#DFDFFF" }}>{ title ? title : 'No Title' }</h1>
                        }
                        
                        <div className='row mrgb2 mrgt2'>
                            <div className='col-md-8 mx-auto'>
                                <p style={{ color: "#DFDFFF" }} className="fs-15 font-frei mrgb0 ui-line-height ui-text-center">{ message ? message : 'No Message' }</p>
                            </div>
                        </div>

                        {
                            buttonPosition === 'inside' &&
                            <Link onClick={(e) => fireAction(e)} href="" className={`onwhite stretch-lg btn md bgd-yellow`}>
                                <span className='fs-13 font-freibold'>{buttonText}</span>
                                <span className='fe fe-chevrons-right fs-15 onwhite ui-relative' style={{ top: '2px', left: '5px' }}></span>
                            </Link>
                        }
                    </div>
                </div>

                {
                    buttonPosition === 'outside' &&
                    <div className='ui-text-center mrgt1'>
                        
                        <Link onClick={(e) => fireAction(e)} href="" className={`onwhite stretch btn md bgd-yellow`}>
                            <span className='fs-13 font-freibold'>{buttonText}</span>
                            <span className='fe fe-chevrons-right fs-15 onwhite ui-relative' style={{ top: '2px', left: '5px' }}></span>
                        </Link>
                        
                    </div>
                }
            </div>
        </>
    )
  
}

export default MessageComp