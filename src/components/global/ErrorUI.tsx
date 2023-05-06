import React, {useState, useEffect, useContext} from 'react'
import Link from 'next/link';
import { IErrorUIProps } from '../../utils/types';

const ErrorUI = ({ error, reset }: Partial<IErrorUIProps>) => {

    useEffect(() => {

    }, [])

    const goBack = (e: any): void => {
        if(e) { e.preventDefault() }
        reset()
    }

    return (
        <>

            <div className="not-found bg-brand-black">

                <div className="container ui-text-center">

                    <span className='cp-icon cp-error grad active fs-55'></span>
                    <h3 className="mrgt1 font-freimedium fs-23 onwhite mrgb">Oops! There was an error.</h3>
                    <p className="font-frei fs-14 onwhite mrgb2">We're sorry. Please go back and refresh the page.</p>
                    <Link href={''} onClick={(e) => goBack(e)} className="btn md bgd-yellow onwhite font-freibold fs-13 stretch">Go Back </Link>

                        
                </div>

            </div>
        </>
    )
  
}

export default ErrorUI