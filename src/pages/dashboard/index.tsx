import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import body from '../../helpers/body';
import { IBlogContext, IUserContext } from '../../utils/types';
import BlogOverview from '../../components/app/blog/BlogOverview';
import PostArticle from '../../components/app/blog/PostArticle';
import moment from 'moment'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import BlogContext from '@/context/blog/blogContext';
import UserContext from '@/context/user/userContext';
import Layout from '@/components/layouts/Dashboard';
import { NextPage } from 'next';

const DashHome: NextPage<any> = ({ }: any) => {

    const userContext = useContext<IUserContext>(UserContext);
    const blogContext = useContext<IBlogContext>(BlogContext);

    const [loadList, setLoadlist] = useState<Array<number>>([])

    const reData: Array<{ name: string, uv: number, pv: number, amt: number }> = [
        {
            name: 'Week 1',
            uv: 0,
            pv: 40,
            amt: 10,
        },
        {
            name: 'Week 2',
            uv: 0,
            pv: 25,
            amt: 25,
        },
        {
            name: 'Week 3',
            uv: 0,
            pv: 30,
            amt: 30,
        },
        {
            name: 'Week 4',
            uv: 0,
            pv: 15,
            amt: 50,
        },
    ];

    const [currDate, setCurrDate] = useState({
        year: '',
        month: '',
        monthName: '',
        date: ''
    })

    useEffect(() => {

        if(body.isArrayEmpty(blogContext.latest)){
            blogContext.getLatestPosts()
        }

        setLoadlist([1,2,3,4,5])
        formatDate();

    }, [])

    const formatDate = () => {
        const td = new Date();
        const mn = body.monthsOfYear().find((x) => x.id === (td.getMonth()))
        setCurrDate({
            ...currDate,
            year: td.getFullYear().toString(),
            month: (td.getMonth() + 1).toString(),
            monthName: mn ? mn.name : '',
            date: td.getDate().toString()
        })
    }

    const CustomToolTip = ({ active, payload, label }: any) => {

        if(active && payload && payload.length && payload[0].payload){

            return (
                <>
                    <div className='re-tooltip ui-line-height-small'>
                        <p className='mrgb0'>
                            <span className='font-freimedium onwhite fs-12'>{payload[0].value} </span>
                            <span className='font-freimedium onwhite fs-12'>{'Posts'}</span>
                        </p>
                        <p className='mrgb0'>
                            <span className='font-frei onwhite fs-12'>{moment(payload[0].payload ? payload[0].payload.start : '').format('Do MMM')}</span>
                        </p>
                    </div>
                </>
            )

        }else {
            return null;
        }

    }

    return (

        <Layout pageTitle='Dashboard' showBack={false} collapsed={false}>

            <BlogOverview />
            
            <section className="section">
                
                <div className="row">
                    <div className="col-md-8">

                        <div className='pdr2'>

                            <div className='post-head d-flex align-items-center  mrgb1'>

                                <h4 className='fs-16 font-freimedium mrgb0 onwhite pdr1'>Post statistics for { body.captialize(currDate.monthName) }</h4>

                                <Link href="" className=''>
                                    <span className='fs-15 font-frei ui-text-clip brand-gd-yellow'>Change &nbsp;</span>
                                    <span className='fe fe-arrow-right fs-15 onwhite ui-relative' style={{ top: '2px' }}></span>
                                </Link>

                            </div>

                            <div className='graph-box'>

                                {
                                    (blogContext.loading || body.isArrayEmpty(blogContext.graph)) &&
                                    <>
                                        <div className='layered'>
                                            <span className='ui-absolute onwhite fs-14 font-frei'>Data will appear here</span>
                                            <AreaChart
                                                width={534}
                                                height={320}
                                                data={reData}
                                                margin={{
                                                    top: 0,
                                                    right: 0,
                                                    left: 0,
                                                    bottom: 0
                                                }}
                                                className={'over-graph'}
                                            >
                                                <defs>
                                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#B447EB" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#B447EB" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="0 0" />
                                                <XAxis
                                                    allowDecimals={true}
                                                    minTickGap={2}
                                                    xAxisId={'0'}
                                                    orientation='bottom'
                                                    padding={{ left: 0, right: 0 }}
                                                    dataKey="name" />
                                                
                                                <YAxis dataKey={'amt'} />

                                                <Tooltip 
                                                content={<CustomToolTip />} 
                                                coordinate={{ x:10, y:10 }}
                                                />

                                                <Area type="monotone" dataKey="pv" stroke="#B029F4" fillOpacity={1} fill="url(#colorUv)" />

                                            </AreaChart>
                                        </div>
                                    </>
                                }

                                {
                                    !blogContext.loading && !body.isArrayEmpty(blogContext.graph) &&
                                    <>
                                        <AreaChart
                                            width={534}
                                            height={320}
                                            data={blogContext.graph}
                                            margin={{
                                                top: 0,
                                                right: 0,
                                                left: 0,
                                                bottom: 0
                                            }}
                                            className={'over-graph'}
                                        >
                                            <defs>
                                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#B447EB" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#B447EB" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="0 0" />
                                            <XAxis
                                                allowDecimals={true}
                                                minTickGap={2}
                                                xAxisId={'0'}
                                                orientation='bottom'
                                                padding={{ left: 0, right: 0 }}
                                                dataKey="week" />
                                            
                                            <YAxis dataKey={'total'} />

                                            <Tooltip 
                                            content={<CustomToolTip />} 
                                            coordinate={{ x:10, y:10 }}
                                            />

                                            <Area type="monotone" dataKey="value" stroke="#B029F4" fillOpacity={1} fill="url(#colorUv)" />

                                        </AreaChart>
                                    </>
                                }
                                
                            </div>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div>

                            <div className='post-head d-flex align-items-center  mrgb1'>

                                <h4 className='fs-16 font-freimedium mrgb0 onwhite'>Latest posts</h4>

                                <Link href="/dashboard/blog/posts" className='ml-auto'>
                                    <span className='fs-15 font-frei ui-text-clip brand-gd-yellow'>view all &nbsp;</span>
                                    <span className='fe fe-arrow-right fs-15 onwhite ui-relative' style={{ top: '2px' }}></span>
                                </Link>

                            </div>

                            <div className='post-art-wrapper'>

                                {
                                    blogContext.loading &&
                                    loadList.map((el, index) => 
                                        <>

                                            <PostArticle
                                                key={index}
                                                dashboard={true}
                                                image=''
                                                size='lng'
                                                title=''
                                                titleColor={'#D7DBFC'}
                                                date='12 Feb, 2023'
                                                loading={true}
                                            />

                                        </>
                                    )
                                    
                                }

                                {
                                    !blogContext.loading && blogContext.latest.length > 0 &&
                                    blogContext.latest.map((post, index) => 
                                        <>

                                            <PostArticle
                                                key={post._id}
                                                dashboard={true}
                                                image={post.thumbnail ? post.thumbnail : `../../../images/assets/img@post-blob${index+1}.jpg`}
                                                size='lng'
                                                title={post.title}
                                                titleColor={'#D7DBFC'}
                                                date={moment(post.createdAt).format('Do MMM, YYYY')}
                                                loading={false}
                                                url={`/blog/${post.slug}`}
                                                target={'_blank'}
                                            />

                                        </>
                                    )
                                }

                                {
                                    !blogContext.loading && blogContext.latest.length <= 0 &&
                                    <div className='latest-empty'>
                                        <span className={`ui-relative cp-camera reverse cp-icon`}>
                                            <i className='path1 fs-18'></i>
                                            <i className='path2 fs-18'></i>
                                        </span>
                                        <p className='mrgb0 onwhite fs-13 font-freimedium mrgt1'>Posts will appear here</p>
                                    </div>
                                }

                            </div>

                        </div>
                    </div>

                </div>

            </section>

        </Layout>
        
    )

}

DashHome.getInitialProps = async (ctx: any) => {

    const { id } = ctx.query;
    return { id }

}

export default DashHome