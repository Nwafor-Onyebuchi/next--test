import React, { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import BlogContext from '../../../context/blog/blogContext'
import UserContext from '../../../context/user/userContext'
import { IBlogContext, IUserContext } from '../../../utils/types'


const BlogOverview = () => {

    const blogContext = useContext<IBlogContext>(BlogContext)
    const userContext = useContext<IUserContext>(UserContext)


    useEffect(() => {

    }, [])

    return (
        <>
            <section className='section ui-wrapper-small overview'>

                <div className='over-row'>

                    <div className='over-item blue'>

                        <div className='d-flex align-items-center'>
                            <h3 className='mrgb0 font-freimedium fs-16 onwhite'>All Articles</h3>
                            <Link href="" className='ml-auto link-round smd' style={{ backgroundColor: "#385CCD" }}>
                                <span className='cp-icon cp-long-arrow-right fs-10 white'></span>
                            </Link>
                        </div>

                        <div className='mrgt mrgb1'>
                            <h2 className='mrgb0 font-freibold fs-65 onwhite'>{ blogContext.overview.posts ? blogContext.overview.posts.total : 0 }</h2>
                        </div>

                        {/* <div className='mt-4'></div> */}

                        <div className='d-flex align-items-center'>
                            <div className='pdr2 ui-line-height-small'>
                                <p className='mrgb0 onwhite font-freimedium fs-13'>{ blogContext.overview.posts ? blogContext.overview.posts.published : 0 }</p>
                                <span className='font-frei fs-13 muted'>Published</span>
                            </div>
                            <div className='pdl3 ui-line-height-small'>
                                <p className='mrgb0 onwhite font-freimedium fs-13'>{ blogContext.overview.posts ? blogContext.overview.posts.pending : 0 }</p>
                                <span className='font-frei fs-13 muted'>Pending</span>
                            </div>
                        </div>

                    </div>

                    <div className={`over-item purple ${userContext.userType === 'writer' ? '' : 'ui-hide'}`}>

                        <div className='d-flex align-items-center'>
                            <h3 className='mrgb0 font-freimedium fs-16 onwhite'>Comments</h3>
                            <Link href="" className='ml-auto link-round smd' style={{ backgroundColor: "#824EDD" }}>
                                <span className='cp-icon cp-long-arrow-right fs-10 white'></span>
                            </Link>
                        </div>

                        <div className='mrgt mrgb1'>
                            <h2 className='mrgb0 font-freibold fs-65 onwhite'>{ blogContext.overview.comments ? blogContext.overview.comments.total : 0}</h2>
                        </div>

                        {/* <div className='mt-4'></div> */}

                        <div className='d-flex align-items-center'>
                            <div className='pdr2 ui-line-height-small'>
                                <p className='mrgb0 onwhite font-freimedium fs-13'>0 Post</p>
                                <span className='font-frei fs-13 muted'>Supporters</span>
                            </div>
                            <div className='pdl3 ui-line-height-small'>
                                <p className='mrgb0 onwhite font-freimedium fs-13'>{ blogContext.overview.comments ? blogContext.overview.comments.disabled : 0}</p>
                                <span className='font-frei fs-13 muted'>disabled</span>
                            </div>
                        </div>

                    </div>

                    <div className={`over-item purple ${(userContext.userType === 'superadmin' || userContext.userType === 'admin') ? '' : 'ui-hide'}`}>

                        <div className='d-flex align-items-center'>
                            <h3 className='mrgb0 font-freimedium fs-16 onwhite'>Subscribers</h3>
                            <Link href="" className='ml-auto link-round smd' style={{ backgroundColor: "#824EDD" }}>
                                <span className='cp-icon cp-long-arrow-right fs-10 white'></span>
                            </Link>
                        </div>

                        <div className='mrgt mrgb1'>
                            <h2 className='mrgb0 font-freibold fs-65 onwhite'>{ blogContext.overview.subscribers ? blogContext.overview.subscribers.total : 0}</h2>
                        </div>

                        {/* <div className='mt-4'></div> */}

                        <div className='d-flex align-items-center'>
                            <div className='pdr2 ui-line-height-small'>
                                <p className='mrgb0 onwhite font-freimedium fs-13'>{ blogContext.overview.users ? blogContext.overview.users.writers : 0}</p>
                                <span className='font-frei fs-13 muted'>Writers</span>
                            </div>
                            <div className='pdl3 ui-line-height-small'>
                                <p className='mrgb0 onwhite font-freimedium fs-13'>{ blogContext.overview.users ? blogContext.overview.users.total : 0}</p>
                                <span className='font-frei fs-13 muted'>Users</span>
                            </div>
                        </div>

                    </div>

                    <div className='over-item grey'>

                        <div className='d-flex align-items-center'>

                            <div className='pdr2 ui-line-height-small'>
                                <p className='mrgb onwhite font-freimedium fs-16'>Categories</p>
                                <span className='font-frei fs-13 muted'>{ blogContext.overview.categories ? blogContext.overview.categories.disabled : 0} disabled</span>
                            </div>

                            <h2 className='mrgb0 font-freibold fs-45 ml-auto onwhite'>{ blogContext.overview.categories ? blogContext.overview.categories.total : 0}</h2>

                        </div>

                        <div className='ui-line' style={{ backgroundColor: '#534D96' }}></div>

                        <div className='d-flex align-items-center mrgb'>

                            <div className='pdr2 ui-line-height-small'>
                                <p className='mrgb onwhite font-freimedium fs-16'>Tags</p>
                                <span className='font-frei fs-13 muted'>{ blogContext.overview.tags ? blogContext.overview.tags.disabled : 0} disabled</span>
                            </div>

                            <h2 className='mrgb0 font-freibold fs-45 ml-auto onwhite'>{ blogContext.overview.tags ? blogContext.overview.tags.total : 0}</h2>

                        </div>

                        <p className='mrgb0 muted font-frei fs-13'>NB: Only Admins can create categories</p>

                    </div>

                </div>

            </section>
        </>
    )

}

export default BlogOverview