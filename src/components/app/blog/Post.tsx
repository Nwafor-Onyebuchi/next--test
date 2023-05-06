import React, { useEffect, useContext, useState } from 'react'
import Placeholder from '../../partials/Placeholder'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IPostComp } from '../../../utils/types'
import Cookies from 'universal-cookie';


const Post = ({ title, position, bracket, category, comments, likes, date, author, thumbnail, url, post }: Partial<IPostComp>) => {

    const cookie = new Cookies();
    const navigate = useRouter();

    const exp = new Date(
        Date.now() + 24 * 60 * 60 * 1000
    )

    useEffect(() => {

    }, [])

    const routePost = (e: any) => {

        if(e) { e.preventDefault() }

        cookie.set("post",{
            title,
            hadline: post.headline,
            thumbnail,
            tags: post.tags,
            premalink: post.premalink
        }, {
            path: '/',
            expires: exp
        })

        navigate.push(url ? url : '/blog')

    }
    
    return (
        <>

            <div className={`post-box ${position ? position : 'left'}`}>

                <Link onClick={(e) => routePost(e)} href={''} className='post-link'>
                    <div className='post-item parent ui-relative'>

                        <div className='overlay ui-absolute'>

                            <div className='d-flex align-items-center'>

                                {
                                    bracket && <span className='custom-badge font-freimedium fs-13 onwhite bgd-purple'>{ bracket }</span>
                                }
                                {
                                    category && <span className='custom-badge font-freimedium fs-13 onwhite bgd-green'>{ category }</span>
                                }

                                <div className='ml-auto'>

                                    <span className='cp-icon cp-callout active' style={{ top: '4px' }}>
                                        <i className='path1 fs-20'></i>
                                        <i className='path2 fs-20'></i>
                                    </span>
                                    <span className='font-freimedium fs-14 onwhite pdl'> { comments ? comments.toString() : '0' } </span>
                            
                                </div>

                            </div>

                            <div className='ui-absolute' style={{ bottom: '1.55rem', width: '85%' }}>
                                
                                <h1 className='font-freibold onwhite mrgb0 fs-26 mt-2'>
                                    { title ? title : 'Title for post and it may be long or not that too long' }
                                </h1>

                                <div className='d-flex align-items-center mrgt1 post-bracket'>
                                    <span className='font-frei fs-13 onwhite pdr1'> { date } </span>
                                    <span className='cp-icon cp-avatar grad active fs-17'></span>
                                    <span className='font-frei fs-13 onwhite pdr1 pdl'> { author } </span>
                                    <span className='cp-icon cp-love active purple' style={{ top: '1px' }}>
                                        <i className='path1 fs-16'></i>
                                        <i className='path2 fs-16'></i>
                                    </span>
                                    <span className='font-frei fs-13 onwhite pdr pdl'> { likes ? likes.toString() : '0' } </span>
                                </div>

                            </div>

                        </div>

                        <div className='child-box ui-full-bg-norm ui-bg-center' style={{ backgroundImage: `url(${thumbnail ? thumbnail : "../../../images/assets/bg@post-01.jpg"})` }}>
                            
                        </div>

                    </div>
                </Link>

            </div>

        </>
    )
}

export default Post