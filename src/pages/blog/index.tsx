import React, { useEffect, useContext, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Placeholder from '../../components/partials/Placeholder'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Navbar from '../../components/partials/Navbar'
import Footer from '../../components/partials/Footer'
import Axios from 'axios'
import Post from '../../components/app/blog/Post'

import storage from '../../helpers/storage'
import body from '../../helpers/body'
import SubscribeForm from '../../components/app/blog/SubscribeForm'
import moment from 'moment'

import BlogContext from '@/context/blog/blogContext'
import { IBlogContext } from '@/utils/types'

const Carousel = dynamic(() => import('react-owl-carousel'), { ssr: false })
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import SEO from '@/components/global/SEO'
import { NextPage } from 'next'


const Blog: NextPage<any> = (props: any) => {

    const blogContext = useContext<IBlogContext>(BlogContext);

    const inputRef = useRef<any>(null)
    const [catType, setCatType] = useState<string>('all')
    const [tagType, setTagType] = useState<string>('all')
    const [search, setSearch] = useState({
        err: false,
        msg: '',
        data: []
    });
    const [loading, setLoading] = useState<boolean>(false)
    const [key, setKey] = useState<string>('')

    useEffect(() => {

        if(body.isArrayEmpty(blogContext.posts)){
            blogContext.getAllPosts(6,1);
        }
    
        if(body.isArrayEmpty(blogContext.categories)){
            blogContext.getAllCategories(30,1)
        }
    
        if(body.isArrayEmpty(blogContext.tags)){
            blogContext.getAllTags(30,1)
        }
    
        if(body.isArrayEmpty(blogContext.latest)){
            blogContext.getLatestPosts()
        }

    }, [])

    const readOpts = {

        margin: 30,
        loop: true,
        autoplay: false,
        autoplayTimeout: 4000,
        nav: false,
        dots: true,
        rewind: true,
        responsive: {
            0: {
                items: 1,
            },
            400: {
                items: 1,
            },
            600: {
                items: 1,
            },
            700: {
                items: 1,
            },
            1000: {
                items: 1,

            }
        },

    };

    const changePostType = (e: any, t: string) => {
        
        if(e.target.checked){
            blogContext.setTypes('post', t)
            storage.keepLegacy('post-type', t)
        }

    }

    const clearPosts = (e: any) => {
        if(e) { e.preventDefault() }
        blogContext.getAllPosts(10,1);
    }

    const getCategoryPosts = (e: any, id: string, n: string) => {
        if(e) { e.preventDefault() }
        setCatType(n)
        setTagType('')
        blogContext.getCategoryPosts(30, 1, id)
    }

    const getTagPosts = (e: any, id: string, n: string) => {
        if(e) { e.preventDefault() }
        setTagType(n)
        setCatType('');
        blogContext.getTagPosts(30, 1, id)
    }

    const searchPosts = async (e: any) => {

        if(e) { e.preventDefault() }

        if(!key){
            setSearch({ ...search, err: true, msg: 'Enter search keyword', data: []})
        }else{

            setLoading(true);

            await Axios.post(`${process.env.NEXT_PUBLIC_BLOG_URL}/posts/search`, { key: key }, storage.getConfig())
            .then((resp) => {

                if(resp.data.error === false && resp.data.status === 200){
                    setSearch({ ...search, err: false, msg: 'success', data: resp.data.data})
                }

                setLoading(false);

            }).catch((err) => {

                if (err.response.data.errors && err.response.data.errors.length > 0) {
                    setSearch({ ...search, err: true, msg: err.response.data.errors[0], data: []})
                } else {
                    setSearch({ ...search, err: true, msg: err.response.data.message, data: []})
                }
                setLoading(false);
                
            })

        }

        

    }

    const clearSearch = (e: any) => {
        if(e) { e.preventDefault() }
        inputRef.current.value = '';
        setSearch({ ...search, err: false, msg: '', data: [] })
    }

    const pagiNext = async (e: any) => {

        if(e) { e.preventDefault() }
        blogContext.getAllPosts(blogContext.pagination.next.limit, blogContext.pagination.next.page)

    }

    const pagiPrev = async (e: any) => {

        if(e) { e.preventDefault() }
        blogContext.getAllPosts(blogContext.pagination.prev.limit, blogContext.pagination.prev.page)

    }

    return (
        <>
            <SEO type='page' pageTitle='Concreap Blog' description='Good and lifting articles' />
            <Navbar isFixed={true} />

            <section className='hero blog-hero ui-full-bg-norm bg-brand-black ui-relative' style={{ backgroundImage: `url("../../../images/assets/bg@hero-02.jpg")` }}>

                <div className='container'>

                    <div className='pdt10 hero-wraper'>

                        <div className='row'>

                            <div className='col-md-5'>

                                <div className='pdr6'>

                                    <h1 className='font-clashsemibold mrgb ui-line-height-large mrgt1'>
                                        <span className='onwhite fs-63'>Good and lifting</span>
                                        <span className='brand-blue fs-63'> articles</span>
                                    </h1>

                                    <p className='mrgb0 font-frei fs-16 onwhite ui-line-height-large pdr'>
                                        Find good read that came as a compendium of our thoughts and as well as that of industry professionals all around the world
                                    </p>

                                    <SubscribeForm display='hero' />

                                </div>

                            </div>

                            <div className='col-md-7 post-hero'>

                                <div className='custom-badge bgd-disable ui-hide-mobile-only'>
                                    <span className='font-freimedium fs-12 onwhite pdr'>Latest Reads</span>
                                    <span className='fe fe-chevrons-right onwhite ui-relative fs-13' style={{ top: '1px' }}></span>
                                </div>

                                {
                                    (blogContext.loading || blogContext.latest.length <= 0) &&
                                    <>
                                        <div className='post-box'>
                                            <div className='post ui-full-bg-norm' style={{ backgroundImage: `url("../../../images/assets/img@blob01.jpg")` }}>

                                                <div className='post-overlay ui-relative'>

                                                    <div className='post-details ui-absolute pdr2' style={{ bottom: '2rem' }}>

                                                        <span className='custom-badge font-freimedium fs-13 onwhite bgd-purple'>Article</span>
                                                        <span className='custom-badge font-freimedium fs-13 onwhite bgd-green'>Design</span>
                                                        <h1 className='font-freibold onwhite mrgb0 fs-32 mt-2'>
                                                            Focused learning: A path to building a successful & sustainable career
                                                        </h1>
                                                        <p className='mrgb0 font-frei fs-15 onwhite ui-hide-mobile-only'>
                                                            Find secrets of walking and working your way into a purposeful career
                                                        </p>

                                                        <div className='d-flex align-items-center mrgt1'>
                                                            <span className='font-frei fs-14 onwhite pdr1'> 12 Feb, 2023 </span>
                                                            <span className='cp-icon cp-avatar grad active fs-20 ui-hide-mobile-only'></span>
                                                            <span className='font-frei fs-14 onwhite pdr1 pdl ui-hide-mobile-only'> Mosope Immanuel </span>
                                                            <span className='cp-icon cp-callout active ui-hide-mobile-only' style={{ top: '1px' }}>
                                                                <i className='path1 fs-20'></i>
                                                                <i className='path2 fs-20'></i>
                                                            </span>
                                                            <span className='font-frei fs-14 onwhite pdr1 pdl ui-hide-mobile-only'> 300 Comments </span>
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </>
                                }

                                {
                                    !blogContext.loading && blogContext.latest.length > 0 &&
                                    <>

                                        <Carousel
                                            className='owl-carousel reads-slider'
                                            {...readOpts}
                                        >
                                            {
                                                blogContext.latest.map((post, index) => 
                                                
                                                    <>

                                                        <div key={post._id} className='post-box'>

                                                            <Link href={`/blog/${post.slug}`} className='post-link'>
                                                                <div className='post ui-full-bg-norm' style={{ backgroundImage: `url(${post.cover ? post.cover : "../../../images/assets/bg@post-avatar.jpg"})` }}>

                                                                    <div className='post-overlay ui-relative'>

                                                                        <div className='post-details ui-absolute pdr2' style={{ bottom: '2rem' }}>

                                                                            <span className='custom-badge font-freimedium fs-13 onwhite bgd-purple'>{ post.bracket ? post.bracket.name : 'Bracket' }</span>
                                                                            <span className='custom-badge font-freimedium fs-13 onwhite bgd-green'>{ post.category ? post.category.name : 'Bracket' }</span>
                                                                            <h1 className='font-freibold onwhite mrgb0 fs-32 mt-2'>
                                                                                { post.title }
                                                                            </h1>
                                                                            <p className='mrgb0 font-frei fs-15 onwhite ui-hide-mobile-only'>
                                                                                { post.headline }
                                                                            </p>

                                                                            <div className='d-flex align-items-center mrgt1'>
                                                                                <span className='font-frei fs-14 onwhite pdr1'> { moment(post.createdAt).format('Do MMM, YYYY') } </span>
                                                                                <span className='cp-icon cp-avatar grad active fs-20 ui-hide-mobile-only'></span>
                                                                                <span className='font-frei fs-14 onwhite pdr1 pdl ui-hide-mobile-only'> { post.author ? post.author.firstName + ' ' + post.author.lastName : 'Author' } </span>
                                                                                <span className='cp-icon cp-callout active ui-hide-mobile-only' style={{ top: '1px' }}>
                                                                                    <i className='path1 fs-20'></i>
                                                                                    <i className='path2 fs-20'></i>
                                                                                </span>
                                                                                <span className='font-frei fs-14 onwhite pdr1 pdl ui-hide-mobile-only'> { post.comments ? post.comments.length : 0 } Comments </span>
                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </Link>

                                                        </div>

                                                    </>

                                                )
                                            }

                                        </Carousel>

                                        <div className='ui-text-center ui-show-mobile-only wp-100' style={{ marginBottom: '2rem' }}>
                                            <span className='fs-12 onwhite font-frei'>Swipe left</span>
                                        </div>

                                    </>
                                }

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <section className="section ui-wrapper-large filt bg-brand-black">

                <div className="container">

                    <div className='row no-gutters'>

                        <div className='col-md-3 ui-hide-mobile-only'>

                            <div className='blog-aside left'>

                                <div className='ad-box smh ui-full-bg-norm' style={{ backgroundImage: `url("../../../images/assets/bg@ad-01.png")` }}>

                                    <h3 className='mrgb2 font-freimedium fs-18 ui-line-height-msmall pad' style={{ color: "#A3A1C9" }}>
                                        Place your compelling Ads on our Blog and make amazing sales
                                    </h3>

                                    <Link onClick={(e) => { }} className="ml-auto ui-relative stretch btn md bgd-disable ext-link" href="">
                                        <span className='font-freimedium onwhite fs-14'>Get Started</span>
                                        <span className='fe fe-arrow-right onwhite ext ui-relative' style={{ top: '4px' }}></span>
                                    </Link>

                                </div>

                                <div className='d-flex align-items-center filter-head'>

                                    <Link href="" className='btn md' style={{ backgroundColor: "#0E0C2C", border: "1px solid #332D95" }}>
                                        <span className='cp-icon cp-filter active'>
                                            <i className='path1 fs-13'></i>
                                            <i className='path2 fs-13'></i>
                                        </span>
                                        <span className='font-freimedium pdl1 pdr onwhite fs-14'>Filters</span>
                                    </Link>

                                    <div className='ml-auto'>

                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input onChange={(e) => changePostType(e, 'article')} defaultChecked={blogContext.postType === 'article' ? true : false} type="radio" id="bracketArticle" name="post-bracket" className="custom-control-input" />
                                            <label className="custom-control-label font-frei fs-13" style={{ color: '#646195' }} htmlFor="bracketArticle">Article</label>
                                        </div>

                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input onChange={(e) => changePostType(e, 'journal')} defaultChecked={blogContext.postType === 'journal' ? true : false} type="radio" id="bracketJournal" name="post-bracket" className="custom-control-input" />
                                            <label className="custom-control-label font-frei fs-13" style={{ color: '#646195' }} htmlFor="bracketJournal">Journal</label>
                                        </div>

                                    </div>

                                </div>

                                <div className='filter-body'>

                                    <div className='filter-item category'>

                                        <div className='item-head'>
                                            <h4 className='fs-15 font-freimedium mrgb0' style={{ color: "#9894e9" }}>Categories</h4>
                                            <Link onClick={(e) => clearPosts(e)} href="" className='ml-auto'>
                                                <span className='fs-13 font-freimedium ui-text-clip brand-gd-yellow'>Clear</span>
                                                <span className='fe fe-arrow-right fs-15 onwhite ui-relative' style={{ top: '2px' }}></span>
                                            </Link>
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
                                               !blogContext.loading && blogContext.categories.length <= 0 &&
                                                <></>
                                            }

                                            {
                                                !blogContext.loading && blogContext.categories.length > 0 &&
                                                blogContext.categories.map((cat, index) => 
                                                    <>
                                                        <Link key={index} onClick={(e) => getCategoryPosts(e, cat._id, cat.name)} href="" className={`custom-badge font-frei ${catType === cat.name ? 'active' : ''}`}>{ cat.name }</Link>
                                                    </>
                                                )
                                            }


                                        </div>

                                    </div>

                                    <div className='ui-separate-small'>
                                        <div style={{ backgroundColor: "#1D1A3F" }} className='ui-line'></div>
                                    </div>

                                    <div className='filter-item tags'>

                                        <div className='item-head'>
                                            <h4 className='fs-15 font-freimedium mrgb0' style={{ color: "#9894e9" }}>Popular Tags</h4>
                                            <Link onClick={(e) => clearPosts(e)} href="" className='ml-auto'>
                                                <span className='fs-13 font-freimedium ui-text-clip brand-gd-yellow'>Clear</span>
                                                <span className='fe fe-arrow-right fs-15 onwhite ui-relative' style={{ top: '2px' }}></span>
                                            </Link>
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
                                                        <Link onClick={(e) => getTagPosts(e, tag._id, tag.name)} key={index} href="" className={`custom-badge font-frei ${tagType === tag.name ? 'active' : ''}`}>{ tag.name }</Link>
                                                    </>
                                                )
                                            }

                                        </div>

                                    </div>

                                    <div className='ui-separate-small'>
                                        <div style={{ backgroundColor: "#1D1A3F" }} className='ui-line'></div>
                                    </div>

                                    <div className='filter-item dates'>

                                        <div className='item-head'>
                                            <h4 className='fs-15 font-freimedium mrgb0' style={{ color: "#9894e9" }}>Published Date</h4>
                                        </div>

                                        <div className='item-body'>

                                            <Link href="" className='custom-badge font-frei active'>Last 1 month</Link>
                                            <Link href="" className='custom-badge font-frei'>Last 3 months</Link>
                                            <Link href="" className='custom-badge font-frei'>Last 6 months</Link>
                                            <Link href="" className='custom-badge font-frei'>Last year</Link>
                                            <Link href="" className='custom-badge font-frei'>Today</Link>

                                        </div>

                                    </div>

                                </div>

                                <div className='ui-separate'></div>

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

                            </div>

                        </div>

                        <div className='col-md-9'>

                            <div className='blog-aside left ui-hide-mobile'>

                                <div className='ad-box smh ui-full-bg-norm ui-show-mobile-only' style={{ backgroundImage: `url("../../../images/assets/bg@ad-01.png")` }}>

                                    <h3 className='mrgb2 font-freimedium fs-18 ui-line-height-msmall pad' style={{ color: "#A3A1C9" }}>
                                        Place your compelling Ads on our Blog and make amazing sales
                                    </h3>

                                    <Link onClick={(e) => { }} className="ml-auto ui-relative stretch btn md bgd-disable ext-link" href="">
                                        <span className='font-freimedium onwhite fs-14'>Get Started</span>
                                        <span className='fe fe-arrow-right onwhite ext ui-relative' style={{ top: '4px' }}></span>
                                    </Link>

                                </div>

                            </div>

                            <div className='blog-aside right'>

                                { search.err && <span className='onaliz fs-12 font-frei'>{ search.msg }</span> }

                                <div className={`blog-search d-md-flex d-block ${blogContext.loading ? 'disabled-lt': ''}`}>

                                    <div className={`input-box`}>
                                        <input ref={inputRef} onChange={(e) => { setKey(e.target.value) }} className={`font-frei fs-15 ${search.data.length > 0 ? 'disabled-lt' : ''}`} type={'text'} placeholder={'Search by title'} />
                                        <Link onClick={(e) => { search.data.length <= 0 ? searchPosts(e) : clearSearch(e) }} className="ml-auto onwhite btn md bgd-disable" href="">
                                            { search.data.length > 0 && <span className='fe fe-x fs-18 ui-relative' style={{ top: '1px' }}></span> }
                                            { search.data.length <= 0 && <span className='cp-icon fs-13 cp-long-arrow-right white ui-relative' style={{ top: '1px' }}></span> }
                                        </Link>
                                    </div>

                                    <div className='ml-auto'>

                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input onChange={(e) => changePostType(e, 'all')} defaultChecked={blogContext.postType === 'all' ? true : false} type="radio" id="bracketSearchAll" name="search-bracket" className="custom-control-input" />
                                            <label className="custom-control-label font-frei fs-13" style={{ color: '#646195' }} htmlFor="bracketSearchAll">All</label>
                                        </div>

                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input onChange={(e) => changePostType(e, 'article')} defaultChecked={blogContext.postType === 'article' ? true : false} type="radio" id="bracketSearchArticle" name="search-bracket" className="custom-control-input" />
                                            <label className="custom-control-label font-frei fs-13" style={{ color: '#646195' }} htmlFor="bracketSearchArticle">Article</label>
                                        </div>

                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input onChange={(e) => changePostType(e, 'journal')} defaultChecked={blogContext.postType === 'journal' ? true : false} type="radio" id="bracketSearchJournal" name="search-bracket" className="custom-control-input" />
                                            <label className="custom-control-label font-frei fs-13" style={{ color: '#646195' }} htmlFor="bracketSearchJournal">Journal</label>
                                        </div>

                                    </div>

                                </div>

                                {
                                    blogContext.loading &&
                                    <>
                                        <div className="empty-box xsm" style={{ backgroundColor: '#0d0b2b' }}>

                                            <div className="ui-text-center">
                                                <div className="row">
                                                    <div className="col-md-10 mx-auto">
                                                        <span className='cp-loader smd white'></span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div> 
                                    </>
                                }

                                {
                                    !blogContext.loading && blogContext.posts.length <= 0 &&
                                    <>

                                        <div className="empty-box sm" style={{ backgroundColor: '#0d0b2b' }}>

                                            <div className="ui-text-center">
                                                <div className="row">
                                                    <div className="col-md-10 mx-auto ui-text-center">
                                                        <span className='cp-icon cp-blog active'>
                                                            <i className='path1 fs-35'></i>
                                                            <i className='path2 fs-35'></i>
                                                        </span>
                                                        <div className='font-frei onwhite fs-15 ui-line-height mrgt1 pdr1 pdl1'>We could not find posts from your request. Try again</div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div> 
                                    
                                    </>
                                }

                                {
                                    !blogContext.loading && blogContext.posts.length > 0 &&
                                    <>

                                        {
                                            loading && 
                                            <div className="empty-box xsm" style={{ backgroundColor: '#0d0b2b' }}>

                                                <div className="ui-text-center">
                                                    <div className="row">
                                                        <div className="col-md-10 mx-auto">
                                                            <span className='cp-loader smd white'></span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div> 
                                        }

                                        {
                                            !loading &&
                                            <>
                                                <div className='row no-gutters blog-list'>

                                                    {
                                                        search.data.length > 0 &&
                                                        search.data.map((post: any, index) =>
                                                        
                                                            <>

                                                                <div key={post._id} className='col-md-6'>

                                                                    <Post 
                                                                        key={post._id}
                                                                        post={post}
                                                                        position={ (index + 1) % 2 === 0 ? 'right' : 'left'}
                                                                        title={post.title}
                                                                        bracket={post.bracket ? post.bracket.name : 'Bracket'}
                                                                        category={post.category ? post.category.name : 'Category'}
                                                                        comments={post.comments ? post.comments.length : 0}
                                                                        likes={post.likes ? post.likes : 0}
                                                                        date={moment(post.createdAt).format('Do MMM, YYYY')}
                                                                        author={post.author ? post.author.firstName + ' ' + post.author.lastName : ''}
                                                                        thumbnail={post.thumbnail ? post.thumbnail : `../../../images/assets/bg@post-avatar.jpg`}
                                                                        url={`/blog/${post.slug}`}
                                                                    />

                                                                </div>
                                                            
                                                            </>
                                                        
                                                        )
                                                    }

                                                    {
                                                        search.data.length <= 0 &&
                                                        blogContext.posts.map((post, index) =>
                                                        
                                                            <>

                                                                <div key={post._id} className='col-md-6'>

                                                                    <Post 
                                                                        key={post._id}
                                                                        post={post}
                                                                        position={ (index + 1) % 2 === 0 ? 'right' : 'left'}
                                                                        title={post.title}
                                                                        bracket={post.bracket ? post.bracket.name : 'Bracket'}
                                                                        category={post.category ? post.category.name : 'Category'}
                                                                        comments={post.comments ? post.comments.length : 0}
                                                                        likes={post.likes ? post.likes : 0}
                                                                        date={moment(post.createdAt).format('Do MMM, YYYY')}
                                                                        author={post.author ? post.author.firstName + ' ' + post.author.lastName : ''}
                                                                        thumbnail={post.thumbnail ? post.thumbnail : `../../../images/assets/bg@post-avatar.jpg`}
                                                                        url={`/blog/${post.slug}`}
                                                                    />

                                                                </div>

                                                                {
                                                                    index === 1 &&
                                                                    <>
                                                                    
                                                                    <div className='col-md-12'>
                                                                        <div className='ad-box xsmh d-md-flex d-block align-items-center ui-full-bg-norm' style={{ backgroundImage: `url("../../../images/assets/bg@ad-03.png")` }}>

                                                                            <div className='ad-width'>
                                                                                <h3 className='mrgb0 font-freimedium fs-26 ui-line-height-msmall pb-md-0 pb-5' style={{ color: "#A3A1C9" }}>
                                                                                    Place your compelling Ads on our Blog and make amazing sales
                                                                                </h3>
                                                                            </div>

                                                                            <Link style={{ height: '50px' }} onClick={(e) => { }} className="ml-auto stretch btn md bgd-disable ext-link" href="">
                                                                                <span className='font-freimedium onwhite fs-14'>Get Started</span>
                                                                                <span className='fe fe-arrow-right onwhite ext ui-relative' style={{ top: '4px' }}></span>
                                                                            </Link>

                                                                        </div>
                                                                    </div>
                                                                    
                                                                    </>
                                                                }
                                                            
                                                            </>
                                                        
                                                        )
                                                    }

                                                </div>

                                                <div className='d-flex align-items-center mrgt2'>

                                                    <p className='mrgb0'>
                                                        <span className='font-frei fs-14 ui-hide-mobile-only' style={{ color: "#585490" }}>Displaying { blogContext.count } posts out of { blogContext.total }</span>
                                                        <span className='font-frei fs-14 ui-show-mobile-only' style={{ color: "#585490" }}>{ blogContext.count } posts of { blogContext.total }</span>
                                                    </p>

                                                    <div className={`ml-auto`}>
                                                        <Link onClick={(e) => pagiPrev(e)} href="" className={`link-round bgd-disable ${blogContext.pagination && blogContext.pagination.prev ? '' : 'disabled'}`}>
                                                            <span className='fe fe-chevron-left onwhite'></span>
                                                        </Link>
                                                        <span className='pdl'></span>
                                                        <Link onClick={(e) => pagiNext(e)} href="" className={`link-round bgd-disable ${blogContext.pagination && blogContext.pagination.next ? '' : 'disabled'}`}>
                                                            <span className='fe fe-chevron-right onwhite'></span>
                                                        </Link>
                                                    </div>

                                                </div>
                                            </>
                                        }

                                    </>
                                }

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <Footer className=''/>

        </>
    )
}

Blog.getInitialProps = async (ctx: any) => {

    const {id} = ctx.query;
    return { id }

}

export default Blog