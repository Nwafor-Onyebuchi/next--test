import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import SEO from '@/components/global/SEO'


const NotFound = () => {

    const navigate = useRouter();

    const goBack = (): void => {
        navigate.back()
    }

    return (
        
        <>
            <SEO pageTitle='NextJs App - Not Found' type='page' />

            <div className="not-found bg-brandxp-dark">

                <div className="container ui-text-center">

                    <div className='font-matterbold onwhite not-found-text' style={{position: 'relative', left: '-0.55rem'}}>404</div>
                    <h3 className="mrgt2 font-mattersemibold fs-30 onwhite mrgb1">Page Not Found!</h3>
                    <Link href="" onClick={goBack} className="btn md ghost cc-red onwhite font-matterbold fs-15">Go Back</Link>

                </div>

            </div>
        </>

    )
  
}

export default NotFound