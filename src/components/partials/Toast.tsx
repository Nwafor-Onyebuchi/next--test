import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IToastProps } from '../../utils/types'

const Toast = ({ show, close, title, message, type, position }: Partial<IToastProps>) => {

    useEffect(() => {

    }, [])

    const closeX = (e: any) => {
        if(e) e.preventDefault();
        close(e);
    }

    const setBg = (type: any) => {

        let result = '#3eb249' 
        if(type === 'success'){
            result = '#3eb249'
        }

        if(type === 'error'){
            result = '#e74c3c'
        }

        if(type === 'info'){
            result = '#00BDE7'
        }

        if(type === 'warning'){
            result = '#FFB31F'
        }

        return result;

    }

    return (
        <>
        
            <div className={`toast-inner ${ show && show === true ? '' : 'ui-hide' } ${ position ? position : 'top-right'}`}
            style={{ backgroundColor: `${setBg(type)}` }}>

                <div className="d-flex align-items-center mb-1">
                    <h3 className="font-freibold fs-14 mrgb0 onwhite ui-line-height"> { title ? title : 'No Title'} </h3>
                    <Link href="" className="ml-auto" onClick={(e) => closeX(e)}><span className="fe fe-x fs-15 onwhite"></span></Link>
                </div>

                <p className="font-freimedium fs-13 onwhite mrgb0">
                    {message ? message : 'No message'}
                </p>

           </div>

        </>
    )
  
}

export default Toast