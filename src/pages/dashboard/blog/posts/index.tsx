import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PostsList from './PostsList'
import Layout from '@/components/layouts/Dashboard';
import storage from '@/helpers/storage';
import UserContext from '@/context/user/userContext';
import BlogContext from '@/context/blog/blogContext';
import { NextPage } from 'next';
import { IBlogContext, IUserContext } from '@/utils/types';


const Posts: NextPage<any> = () => {

    const blogContext = useContext<IBlogContext>(BlogContext)
    const userContext = useContext<IUserContext>(UserContext)

    useEffect(() => {


    }, [])

    return (
        <Layout pageTitle='All Posts' showBack={true} collapsed={false}>
            <PostsList page='posts' />
        </Layout>
    )
}

Posts.getInitialProps = async (ctx: any) => {

    const { id } = ctx.query;
    return { id }

}

export default Posts