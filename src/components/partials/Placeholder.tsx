import React, { useEffect, useState } from 'react'
import { IPlaceholder } from '../../utils/types'

const Placeholder = ({ height, width, bgColor, animate, radius, className, minHeight, minWidth }: Partial<IPlaceholder>) => {

    // https://jamesinkala.com/blog/make-animated-content-placeholders-with-html-and-css/
    
    useEffect(() => {

    }, [])

    return (
        <>

            <div className={`placeholder ${className}`} 
            style={{ 
                height: height,
                width: width,
                minHeight: minHeight,
                minWidth: minWidth,
                backgroundColor: bgColor,
                borderRadius: `${radius}`
            }}
            >
                <div className={`activity ${animate ? 'flicker': ''}`}></div>
            </div>

        </>
    )
}

export default Placeholder