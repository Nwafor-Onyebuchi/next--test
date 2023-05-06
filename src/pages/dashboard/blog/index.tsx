import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import BlogOverview from '../../../components/app/blog/BlogOverview'
import PostsList from './posts/PostsList'
import Layout from '@/components/layouts/Dashboard';
import { NextPage } from 'next'
import BlogContext from '@/context/blog/blogContext'
import UserContext from '@/context/user/userContext'
import { IBlogContext, IUserContext } from '@/utils/types'
import storage from '@/helpers/storage'


const Blog: NextPage<any> = () => {

    const blogContext = useContext<IBlogContext>(BlogContext)
    const userContext = useContext<IUserContext>(UserContext)

    useEffect(() => {

        

    }, [])

    return (
        <Layout pageTitle='Blog Overview' showBack={true} collapsed={false}>

            <BlogOverview />
            <PostsList page='blog' />

        </Layout>
    )
}

Blog.getInitialProps = async (ctx: any) => {

    const { id } = ctx.query;
    return { id }

}

export default Blog