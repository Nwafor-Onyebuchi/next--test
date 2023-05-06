import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const EmptyPost = () => {
    return (
        <>
            <section className="section bg-dashtable d-flex justify-content-center align-items-center mrgt2 ui-rounded-medium" style={{ height: '80vh' }}>
                <div className="row justify-content-center">
                    <div className="col-md-7">
                        <div className="ui-text-center mrgb2">
                            <span style={{ position: 'relative', left: '0', top: '1px', color: '#fff' }} className={`ui-relative cp-blog cp-icon blog `}>
                                <i className='path1 fs-47'></i>
                                <i className='path2 fs-47'></i>
                            </span>

                        </div>
                        <p className='font-frei fs-17 brand-auth text-center pdb'>There are no posts to display currently. You have not created any posts</p>
                        <div className='ui-text-center'>

                            <Link href="/dashboard/blog/posts" className=' stretch btn sm bgd-yellow onwhite'>
                                <span className='font-freimedium fs-13 stretch-md'>Add a post</span>
                            </Link>
                        </div>

                    </div>
                </div>

            </section>
        </>
    )
}

export default EmptyPost