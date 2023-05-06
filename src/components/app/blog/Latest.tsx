import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ILatestBlob } from '../../../utils/types'
import Placeholder from '../../partials/Placeholder'


const Latest = ({image, title, date, titleColor, dashboard, url, size, loading, target, user }: Partial<ILatestBlob>) => {
    return (
        <>
            <Link href={ url ? url : ''} className="latest-blink">
                <div className={`post-articles ${dashboard ? 'dashboard' : ''}`}>
                    {
                        loading && loading === true &&
                        <>
                            <Placeholder className='' animate={true} height='68px' minWidth='80px' width='80px' radius={'7px'} bgColor="#191747" />
                        </>
                    }
                    {
                        (!loading || loading === undefined) &&
                        <>
                            <div 
                            className={`post-article-img ui-full-bg-norm ${size ? size : ''}`} 
                            style={{ backgroundImage: `url(${image ? image : ''})`, backgroundColor: `${image ? '' : '#25224f'}` }}>
                                { 
                                    !image && 
                                    <span className={`ui-relative cp-camera reverse cp-icon`}>
                                        <i className='path1 fs-13'></i>
                                        <i className='path2 fs-13'></i>
                                    </span>
                                }
                            </div>
                        </>
                    }
                    
                    <div className={`content ${loading ? 'ui-line-height-small' : ''}`}>
                        {
                            loading && loading === true &&
                            <>
                                <Placeholder className='mb-1' animate={true} minHeight="14px" height='14px' width='180px' radius={'100px'} bgColor="#191747" />
                                <Placeholder className='mrgb' animate={true} minHeight="14px" height='14px' width='180px' radius={'100px'} bgColor="#191747" />
                                <Placeholder className='' animate={true} minHeight="9px" height='9px' width='100px' radius={'100px'} bgColor="#191747" />
                            </>
                        }

                        {
                            (!loading || loading === undefined) &&
                            <>
                                <p className={`font-freimedium fs-14 ui-line-height mb-1`} style={{ color: titleColor ? titleColor : 'onwhite' }}>{title}</p>
                                <p className='font-frei mrgb0 fs-12 ui-line-height onwhite'>By { user && user.firstName ? user.firstName : 'User' } - { date }</p>
                            </>
                        }
                        
                    </div>
                </div>
            </Link>
        </>
    )
}

export default Latest
