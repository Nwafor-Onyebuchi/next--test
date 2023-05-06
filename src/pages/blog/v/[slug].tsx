import React, { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Navbar from '../../../components/partials/Navbar'
import PostArticle from '../../../components/app/blog/PostArticle'
import Footer from '../../../components/partials/Footer'

import BlogContext from '../../../context/blog/blogContext'
import { IBlogContext } from '../../../utils/types'
import body from '../../../helpers/body'
import Placeholder from '../../../components/partials/Placeholder'
import moment from 'moment'
import { NextPage } from 'next'

const PostView: NextPage<any> = ({ slug }: any) => {

    const router = useRouter()

    const blogContext = useContext<IBlogContext>(BlogContext);

    const [catType, setCatType] = useState<string>('all')
    const [tagType, setTagType] = useState<string>('all')

    useEffect(() => {

        blogContext.getPostBySlug(slug, true);

    }, [])

    const formatTitle = (): string => {

        let r: string = '';

        if(slug){
            const sp = slug.split('-');
            r = sp.join(' ')
        }

        return r

    }

    return (
        <>
            <Navbar isFixed={true} />

            <section className='hero ui-full-bg-norm bg-brand-black' style={{ backgroundImage: `url(${blogContext.post.cover ? blogContext.post.cover : "../../../images/assets/bg@post-avatar02.png"})` }}>

                <div className='spost-overlay'>

                    <div className="hero-inner lmd">

                        <div className="container">

                            <div className='row'>

                                <div className='col-md-6 mx-auto ui-text-center'>

                                    {
                                        blogContext.loading && 
                                        <>
                                            <h1 className='font-freimedium onwhite mrgb fs-47 text-center ui-line-height-msmall'>
                                                Preview or inspect articles written on Concreap
                                            </h1>

                                            <div>
                                                <Placeholder className='mrgr8' animate={true} height='15px' width='60px' radius={'100px'} bgColor="#191747" />
                                                <span className='pdl pdr'></span>
                                                <Placeholder className='mrgr8' animate={true} height='15px' width='60px' radius={'100px'} bgColor="#191747" />
                                                <span className='pdl pdr'></span>
                                                <Placeholder className='mrgr8' animate={true} height='15px' width='60px' radius={'100px'} bgColor="#191747" />
                                            </div>
                                        </>
                                    }

                                    {
                                        !blogContext.loading &&
                                        <>
                                            {
                                                blogContext.response.error && body.isObjectEmpty(blogContext.post) &&
                                                <>
                                                    <p className='fs-25 font-freimedium onwhite mrgb1'>{ body.captialize(blogContext.response.errors[0]) }</p>
                                                    <Link href="/blog" className={`btn sm fs-14 stretch bgd-disable onwhite font-freibold`}>Go Back</Link>
                                                </>
                                            }

                                            {
                                                !blogContext.response.error && !body.isObjectEmpty(blogContext.post) &&
                                                <>
                                                    <div className='ui-text-center mrgb1'>
                                                        <span className='fs-13 font-freimedium onwhite'>Post Details</span>
                                                    </div>
                                        
                                                    <h1 className='font-freimedium onwhite mrgb fs-47 text-center ui-line-height-msmall'>
                                                        { blogContext.post.title }
                                                    </h1>

                                                    <div className='d-flex justify-content-center align-items-center mrgt1'>

                                                        <span className='font-freimedium fs-13 onwhite pdr2'> { moment(blogContext.post.createdAt).format('Do MMM, YYYY') } </span>
                                                        <span className='cp-icon cp-avatar active grad fs-17'></span>
                                                        <span className='font-freimedium fs-13 onwhite pdr2 pdl'> { blogContext.post.author ? blogContext.post.author.firstName + ' ' + blogContext.post.author.lastName : 'Author' } </span>

                                                        <span className='cp-icon cp-love active' style={{ top: '0px' }}>
                                                            <i className='path1 fs-16'></i>
                                                            <i className='path2 fs-16'></i>
                                                        </span>
                                                        <span className='font-freimedium fs-13 onwhite pdr2 pdl'> { blogContext.post.comments ? blogContext.post.comments.length : 0 } </span>

                                                        <span className='cp-icon cp-callout active' style={{ top: '0px' }}>
                                                            <i className='path1 fs-16'></i>
                                                            <i className='path2 fs-16'></i>
                                                        </span>
                                                        <span className='font-freimedium fs-13 onwhite pdl'> { blogContext.post.comments ? blogContext.post.comments.length : 0 } </span>
                                                        
                                                    </div>
                                                </>
                                            }

                                        </>
                                    }

                                        

                                </div>

                            </div>
                            
                        </div>

                    </div>

                </div>


            </section>

            <section className='section ui-full-bg-norm ui-wrapper-small bg-brand-black'>

                <div className="container-fluid">

                    <div className="row">

                        <div className="col-md-9 mx-auto">

                            <div className='post-html onwhite mrgb2 font-frei' 
                                dangerouslySetInnerHTML={{ __html: blogContext.post.markedHtml }} 
                            />

                        </div>

                    </div>

                </div>

            </section>

            <Footer />
        </>
    )
}

PostView.getInitialProps = async (ctx: any) => {

    const slug = ctx.query.slug;
    return { slug }

}

export default PostView
