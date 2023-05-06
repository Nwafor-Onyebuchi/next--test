import React, {useState, useEffect} from 'react'
import { IDLayoutProps } from '../../utils/types'
import dynamic from 'next/dynamic'
import body from '@/helpers/body'

const SideBar = dynamic(async () => await import('../partials/Sidebar'), { ssr: false })
const TopBar = dynamic(async () => await import('../partials/Topbar'), { ssr: false })

const DashboardLayout = (props: Partial<IDLayoutProps>) => {

    const [barCollapsed, setBarCollapsed] = useState<boolean | any>(false);

    useEffect(() => {
        body.changeBackground('bg-brand-black')
        setBarCollapsed(props.collapsed);
    }, [])

    const expandCollapse = (e: any): void => {

        if(e) { e.preventDefault() }

        const sidebar = document.getElementById('ui-sidebar');
        const dashBody = document.getElementById('ui-dashboard-body');
        const sidebarPrimary = document.getElementById('ui-sidebar-primary');
        const headPrimary = document.getElementById('ui-sidebar-primary-header');
        const topbar = document.getElementById('ui-dashboard-topbar');

        if(sidebar && dashBody && sidebarPrimary && topbar){

            //sidebar
            if(sidebar.classList.contains('sdbr--cllps')){
                sidebar?.classList.remove('sdbr--cllps');
                sidebar?.classList.add('sdbr--open');
                setBarCollapsed(false);
            }else{
                sidebar?.classList.remove('sdbr--open');
                sidebar?.classList.add('sdbr--cllps');
                setBarCollapsed(true);
            }

            //dashboard body
            if(dashBody.classList.contains('sdbr--cllps')){
                dashBody?.classList.remove('sdbr--cllps');
                dashBody?.classList.add('sdbr--open');
                setBarCollapsed(false);
            }else{
                dashBody?.classList.remove('sdbr--open');
                dashBody?.classList.add('sdbr--cllps');
                setBarCollapsed(true);
            }

            //sidebar primary
            if(sidebarPrimary.classList.contains('sdbr--cllps')){
                sidebarPrimary?.classList.remove('sdbr--cllps');
                sidebarPrimary?.classList.add('sdbr--open');
                headPrimary?.classList.remove('sdbr--cllps');
                headPrimary?.classList.add('sdbr--open');
                setBarCollapsed(false);
            }else{
                sidebarPrimary?.classList.remove('sdbr--open');
                sidebarPrimary?.classList.add('sdbr--cllps');
                headPrimary?.classList.remove('sdbr--open');
                headPrimary?.classList.add('sdbr--cllps');
                setBarCollapsed(true);
            }

            //topbar
            if(topbar.classList.contains('sdbr--cllps')){
                topbar?.classList.remove('sdbr--cllps');
                topbar?.classList.add('sdbr--open');
                setBarCollapsed(false);
            }else{
                topbar?.classList.remove('sdbr--open');
                topbar?.classList.add('sdbr--cllps');
                setBarCollapsed(true);
            }

        }

    }

    return (
        <>
            <SideBar expandSidebar={expandCollapse} barCollapsed={barCollapsed} collapsed={props.collapsed} />

            <main id="ui-dashboard-body" className={`ui-dashboard-body bg-brand-black ${ props.collapsed && props.collapsed === true ? 'sdbr--cllps' : 'sdbr--open' } d-body`}>

                <TopBar barType="admin" expandFunc={expandCollapse} barCollapsed={barCollapsed} collapsed={props.collapsed} showBack={props.showBack} pageTitle={props.pageTitle} isFixed={true} />
                
                <div className="ui-body-content">
                    <div className="ui-body-content-inner">
                        { props.children }
                    </div>
                </div>
                
                
            </main>
        </>
    )
  
}

export default DashboardLayout