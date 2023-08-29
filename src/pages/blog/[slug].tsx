import React, { useContext, useState, useEffect } from 'react'
import Navbar from '../../components/partials/Navbar'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PostArticle from '../../components/app/blog/PostArticle'
import Footer from '../../components/partials/Footer'
import Axios from 'axios';

import body from '../../helpers/body'
import Placeholder from '../../components/partials/Placeholder'
import moment from 'moment'
import SubscribeForm from '../../components/app/blog/SubscribeForm'
import PostBar from '../../components/app/blog/PostBar'
import storage from '../../helpers/storage'
import { useTrackCampaign } from '../../helpers/hooks'
import SEO from '../../components/global/SEO'
import Cookies from 'universal-cookie';
import BlogContext from '@/context/blog/blogContext'
import { IBlogContext } from '@/utils/types'
import { NextPage } from 'next'


const Single: NextPage<any> = ({ slug, qdt, post }: any) => {

    const cookie = new Cookies();
    const navigate = useRouter()

    const blogContext = useContext<IBlogContext>(BlogContext);

    const [catType, setCatType] = useState<string>('all')
    const [tagType, setTagType] = useState<string>('all')
    const [loadList, setLoadlist] = useState<Array<number>>([]);


    useEffect(() => {

        body.fixPostBar()

        setLoadlist([1,2,3,4,5])

        blogContext.getPostBySlug(slug, false);

        if(body.isArrayEmpty(blogContext.tags)){
            blogContext.getAllTags(30,1)
        }

        if(body.isArrayEmpty(blogContext.latest)){
            blogContext.getLatestPosts()
        }

        return (() => {
            cookie.remove('post')
        })

    }, [])

    useTrackCampaign(qdt);

    const formatTitle = (): string => {

        let r: string = '';

        if(slug){
            const sp = slug.split('-');
            r = sp.join(' ')
        }

        return r

    }

    const formatTags = (data: Array<any>) => {
        let mapped: Array<any> = data.map((x: any) => { return x.name })
        let result = mapped.join(', ');
        return result;
    }

    const getCopost = () => {
        return cookie.get('post')
    }

    return (
        <>
            <SEO
                type={'page'}
                pageTitle={ post ? post.title : formatTitle()}
                description={ post ? post.headline : '' }
                image={ post ? post.thumbnail : blogContext.post.headline }
                keywords={post &&  post.tags && post.tags.length > 0 ? formatTags(post.tags) : ''}
                url={post ? post.premalink : ''}
                author={{
                    email: post && post.author ? post.author.eamil : blogContext.post.author ? blogContext.post.author.email : 'hello@concreap.com',
                    name: post && post.author ? `${post.author.firstName} ${post.author.lastName}` : blogContext.post.author ? blogContext.post.author.firstName + ' ' + blogContext.post.author.lastName : 'Concreap',
                    image: 'https://storage.googleapis.com/concreap-buckets/concreap-seo.jpg'
                }}
                site={{
                    siteName: 'Concreap',
                    searchUrl: post ? post.premalink : blogContext.post.premalink
                }}
                language={'en-US'}
            />

            <Navbar isFixed={true} />

            {
                !blogContext.loading &&
                <PostBar 
                isFixed={true} 
                post={blogContext.post}
                share={{
                    twitter: true,
                    facebook: true,
                    whatsapp: true,
                    linkedin: true,
                    discord: true,
                    telegram: true
                }}
                />
            }

            <section className='hero post-single-hero ui-full-bg-norm bg-brand-black' style={{ backgroundImage: `url(${blogContext.post.cover ? blogContext.post.cover : "../../../images/assets/bg@post-avatar02.png"})` }}>

                <div className='spost-overlay'>

                    <div className="hero-inner lmd">

                        <div className="container">

                        <div className='row'>

                            <div className='col-md-6 mx-auto ui-text-center'>

                                {
                                    blogContext.loading && 
                                    <>
                                        <h1 className='font-freimedium onwhite mrgb fs-47 text-center ui-line-height-msmall'>
                                            { formatTitle() }
                                        </h1>

                                        <div>
                                            <Placeholder className='mrgr8' animate={true} height='15px' width='60px' radius={'100px'} bgColor="#191747" />
                                            <span className='pdl pdr ui-hide-mobile-only'></span>
                                            <Placeholder className='mrgr8 ui-hide-mobile-only' animate={true} height='15px' width='60px' radius={'100px'} bgColor="#191747" />
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
                                                    <Link href="/blog" className='fs-13 font-freimedium onblue pdr'>Blog</Link>
                                                    <span className='fe fe-chevrons-right fs-15 onwhite ui-relative' style={{ top: '2px' }}></span>
                                                    <span className='fs-13 font-freimedium onwhite pdl'>Details</span>
                                                </div>

                                                <h1 className='font-freimedium onwhite mrgb fs-47 text-center ui-line-height-msmall'>
                                                    { blogContext.post.title }
                                                </h1>

                                                <div className='d-flex justify-content-center align-items-center mrgt1'>

                                                    <span className='font-freimedium fs-13 onwhite pdr2'> { moment(blogContext.post.createdAt).format('Do MMM, YYYY') } </span>

                                                    <span className='cp-icon cp-avatar active grad fs-17 ui-hide-mobile-only'></span>
                                                    <span className='font-freimedium fs-13 onwhite pdr2 pdl ui-hide-mobile-only'> { blogContext.post.author ? blogContext.post.author.firstName + ' ' + blogContext.post.author.lastName : 'Author' } </span>

                                                    <span className='ui-show-mobile-only pdl'></span>
                                                    <span className='cp-icon cp-love active' style={{ top: '0px' }}>
                                                        <i className='path1 fs-16'></i>
                                                        <i className='path2 fs-16'></i>
                                                    </span>
                                                    <span className='font-freimedium fs-13 onwhite pdr2 pdl'> { blogContext.post.comments ? blogContext.post.comments.length : 0 } </span>
                                                    <span className='ui-show-mobile-only pdl'></span>

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

            <section className='section post-body ui-full-bg-norm ui-wrapper-small bg-brand-black'>

                <div className="container-fluid">

                    <div className="row">

                        <div className="col-md-9">

                            <div className="pdr3">

                                <div className='ad-box xsmh d-flex align-items-center ui-full-bg-norm' style={{ backgroundImage: `url("../../../images/assets/bg@ad-03.png")` }}>

                                    <div style={{ width: '50%' }}>
                                        <h3 className='mrgb0 font-freimedium fs-26 ui-line-height-msmall' style={{ color: "#A3A1C9" }}>
                                            Place your compelling Ads on our Blog and make amazing sales
                                        </h3>
                                    </div>

                                    <Link onClick={(e) => { }} className="ml-auto stretch btn md bgd-disable ext-link" href="">
                                        <span className='font-freimedium onwhite fs-14'>Get Started</span>
                                        <span className='fe fe-arrow-right onwhite ext ui-relative' style={{ top: '4px' }}></span>
                                    </Link>

                                </div>

                                <div className='post-html onwhite mrgt3 mrgb2 font-frei' 
                                    dangerouslySetInnerHTML={{ __html: blogContext.post.markedHtml }} 
                                />

                            </div>

                        </div>

                        <div className="col-md-3">

                            <div className='pdl1'>

                                <SubscribeForm display='single' />

                                <div className='latest-post'>

                                    {
                                        blogContext.loading &&
                                        loadList.map((el, index) => 
                                            <>

                                                <PostArticle
                                                    key={index}
                                                    dashboard={false}
                                                    image=''
                                                    size='lng'
                                                    title=''
                                                    titleColor={'#D7DBFC'}
                                                    date='12 Feb, 2023'
                                                    loading={true}
                                                />

                                                <div className='ui-line' style={{ backgroundColor: "#1D1A3F" }}></div>

                                            </>
                                        )
                                        
                                    }

                                    {
                                        !blogContext.loading && blogContext.latest.length > 0 &&
                                        blogContext.latest.map((post, index) => 
                                            <>

                                                <PostArticle
                                                    key={post._id}
                                                    dashboard={false}
                                                    image={post.thumbnail ? post.thumbnail : `../../../images/assets/img@post-blob${index+1}.jpg`}
                                                    size='lng'
                                                    title={post.title}
                                                    titleColor={'#D7DBFC'}
                                                    date={moment(post.createdAt).format('Do MMM, YYYY')}
                                                    loading={false}
                                                    url={`/blog/${post.slug}`}
                                                />

                                                <div className='ui-line' style={{ backgroundColor: "#1D1A3F" }}></div>

                                            </>
                                        )
                                    }

                                </div>

                                <div className='blog-aside left'>
                                    <div className='filter-body'>
                                        <div className='filter-item tags'>

                                        <div className='item-head'>
                                            <h4 className='fs-15 font-freimedium mrgb0' style={{ color: "#6A65C8" }}>Popular Tags</h4>
                                        </div>

                                        <div className='item-body'>

                                            {
                                                blogContext.loading &&
                                                <>
                                                    <Placeholder className='mrgr8' animate={true} height='19px' width='60px' radius={'100px'} bgColor="#191747" />
                                                    <Placeholder className='mrgr8' animate={true} height='19px' width='60px' radius={'100px'} bgColor="#191747" />
                                                    <Placeholder className='mrgr8' animate={true} height='19px' width='60px' radius={'100px'} bgColor="#191747" />
                                                    <Placeholder className='mrgr8' animate={true} height='19px' width='60px' radius={'100px'} bgColor="#191747" />
                                                </>
                                            }

                                            {
                                               !blogContext.loading && blogContext.tags.length <= 0 &&
                                                <></>
                                            }

                                            {
                                                !blogContext.loading && blogContext.tags.length > 0 &&
                                                blogContext.tags.map((tag, index) => 
                                                    <>
                                                        <Link key={index} href="" className={`custom-badge font-frei ${tagType === tag.name ? 'active' : ''}`}>{ tag.name }</Link>
                                                    </>
                                                )
                                            }

                                        </div>

                                    </div>
                                    </div>
                                </div>

                                <div className='ui-line mrgt2 mrgb2' style={{ backgroundColor: "#1D1A3F" }}></div>

                                <div className='ad-box mdh ui-full-bg-norm' style={{ backgroundImage: `url("../../../images/assets/bg@ad-02.png")` }}>

                                    <h3 className='mrgb2 font-freimedium fs-25 ui-line-height-msmall pad' style={{ color: "#A3A1C9" }}>
                                        Place your compelling Ads on our Blog and make amazing sales
                                    </h3>

                                    <Link onClick={(e) => { }} 
                                    style={{ bottom: '1.8rem' }}
                                    className="ml-auto ui-absolute stretch btn md bgd-disable ext-link" href="">
                                        <span className='font-freimedium onwhite fs-14'>Get Started</span>
                                        <span className='fe fe-arrow-right onwhite ext ui-relative' style={{ top: '4px' }}></span>
                                    </Link>

                                </div>

                                <div className='ui-separate'></div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <Footer />
        </>
    )
}

Single.getInitialProps = async (ctx: any) => {
    
    const slug = ctx.query.slug;
    let post: any = {}

    const qdt = {
        medium: ctx.query.medium,
        source: ctx.query.source,
        content: ctx.query.content,
        campaign: ctx.query.campaign
    }

    const getPostBySlug = async (slug: string) => {

        await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/posts/slug/${slug}?preview=${'false'}`, storage.getConfig())
        .then((resp) => {
            post = resp.data.data;

        }).catch((err) => {

            console.log(err.response)
            
        })
        

    }

    await getPostBySlug(slug)

    return { 
        slug,
        qdt,
        post
    }

}

export default Single
