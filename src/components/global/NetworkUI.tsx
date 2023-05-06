import React, {useEffect} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const NetworkUI = () => {

    const navigate = useRouter()

    useEffect(() => {

    }, [])

    const goBack = (e: any) => {
        
        if(e) e.preventDefault();
        navigate.back()

    };

    return (
        <>

            <div className="not-found bg-brand-black">

                <div className="container ui-text-center">

                    <span className='cp-icon cp-wifi grad active fs-55'></span>
                    <h3 className="mrgt1 font-freimedium fs-23 onwhite mrgb">Oops! Network error.</h3>
                    <p className="font-frei fs-14 onwhite mrgb2">There's an error network is unstable. Please refresh</p>
                    <Link href="" onClick={(e) => goBack(e)} className="btn md bgd-yellow onwhite font-freibold fs-13 stretch">Go Back </Link>

                        
                </div>

            </div>
        </>
    )
  
}

export default NetworkUI