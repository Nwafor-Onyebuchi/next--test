import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { usePageRedirect } from '../../../../helpers/hooks'
import CampaignsList from './CampList'
import Layout from '@/components/layouts/Dashboard';
import { NextPage } from 'next'
import BlogContext from '@/context/blog/blogContext'
import UserContext from '@/context/user/userContext'
import { IBlogContext, IUserContext } from '@/utils/types'
import storage from '@/helpers/storage'

const Campaigns: NextPage<any> = () => {

    useEffect(() => {

    }, [])

    // redirect based on user-type
    usePageRedirect(['superadmin', 'admin'])

    return (
        <Layout pageTitle='Campaigns' showBack={true} collapsed={false}>
            <CampaignsList page='campaigns' />
        </Layout>
    )
}

Campaigns.getInitialProps = async (ctx: any) => {

    const { id } = ctx.query;
    return { id }

}

export default Campaigns;