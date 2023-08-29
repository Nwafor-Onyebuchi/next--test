import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { usePageRedirect } from '../../../../helpers/hooks'
import SubscribersList from './SubList'
import Layout from '@/components/layouts/Dashboard';
import storage from '@/helpers/storage'
import BlogContext from '@/context/blog/blogContext'
import UserContext from '@/context/user/userContext'
import { NextPage } from 'next'
import { IBlogContext, IUserContext } from '@/utils/types'


const Subscribers: NextPage<any> = () => {

    useEffect(() => {

    }, [])

    // redirect based on user-type
    usePageRedirect(['superadmin', 'admin'])

    return (
        <Layout pageTitle='Subscribers' showBack={true} collapsed={false}>
            <SubscribersList page='subscribders' />
        </Layout>
    )
}

Subscribers.getInitialProps = async (ctx: any) => {

    const { id } = ctx.query;
    return { id }

}

export default Subscribers