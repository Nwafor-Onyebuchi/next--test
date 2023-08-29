import React, { useState, useEffect, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import DeleteModal from './DeleteModal';
import AddNew from './AddNew';
import storage from '../../../../helpers/storage';
import moment from 'moment'
import Axios from 'axios';

import papa from 'papaparse'
import Toast from '../../../../components/partials/Toast';
import body from '../../../../helpers/body';
import BlogContext from '@/context/blog/blogContext';
import UserContext from '@/context/user/userContext';
import { IBlogContext, IUserContext } from '@/utils/types';
import Layout from '@/components/layouts/Dashboard';
import { NextPage } from 'next';


const Categories: NextPage<any> = (props: any) => {

    const inputRef = useRef<any>(null)

    const blogContext = useContext<IBlogContext>(BlogContext)
    const userContext = useContext<IUserContext>(UserContext)

    const [show, setShow] = useState<boolean>(false)
    const [add, setAdd] = useState<boolean>(false)
    const [data, setData] = useState<any>({})
    const [type, setType] = useState<any>('')

    const [key, setKey] = useState<string>('');
    const [toast, setToast] = useState({
        type: '',
        show: false,
        message: '',
        title: '',
        position: 'top-right'
    });

    const [search, setSearch] = useState<{ err: boolean, msg: string, data: Array<any> }>({
        err: false,
        msg: '',
        data: []
    });

    const toggleDelete = (e: any, d: any) => {
        if (e) { e.preventDefault() }
        setShow(!show);

        if(d){
            setData(d)
        }
    }

    const toggleAdd = (e: any, t: string, data: any) => {
        if (e) { e.preventDefault() }
        setType('category')
        if (data) {
            setType(t)
            setData(data)
        }
        setAdd(!add)
    }

    useEffect(() => {

        if (userContext.getUserType() === 'writer') {
            blogContext.getAllCategories(30, 1)
        }
    
        if (userContext.getUserType() === 'superadmin' || userContext.getUserType() === 'admin') {
            blogContext.getCategories(30, 1);
        }

    }, [])

    const searchPosts = async (e: any) => {

        if(e) { e.preventDefault() }

        if(!key){
            setSearch({ ...search, err: true, msg: 'Enter search keyword', data: []})
        }else{

            blogContext.setLoading()

            await Axios.post(`${process.env.NEXT_PUBLIC_BLOG_URL}/categories/seek`, { key: key }, storage.getConfigWithBearer())
            .then((resp) => {

                if(resp.data.error === false && resp.data.status === 200){
                    setSearch({ ...search, err: false, msg: 'success', data: resp.data.data})
                }

                blogContext.unsetLoading()

            }).catch((err) => {

                if (err.response.data.errors && err.response.data.errors.length > 0) {
                    setSearch({ ...search, err: true, msg: err.response.data.errors[0], data: []})
                } else {
                    setSearch({ ...search, err: true, msg: err.response.data.message, data: []})
                }

                blogContext.unsetLoading()
                
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

        if(userContext.getUserType() === 'writer'){
            blogContext.getAllCategories(blogContext.pagination.next.limit, blogContext.pagination.next.page)
        }

        if(userContext.getUserType() === 'superadmin' || userContext.getUserType() === 'admin'){
            blogContext.getCategories(blogContext.pagination.next.limit, blogContext.pagination.next.page)
        }

    }

    const pagiPrev = async (e: any) => {

        if(e) { e.preventDefault() }
        
        if(userContext.getUserType() === 'writer'){
            blogContext.getUserPosts(blogContext.pagination.prev.limit, blogContext.pagination.prev.page, storage.getUserID())
        }

        if(userContext.getUserType() === 'superadmin' || userContext.getUserType() === 'admin'){
            blogContext.getPosts(blogContext.pagination.prev.limit, blogContext.pagination.prev.page)
        }

    }

    const exportData = (e: any) => {

        if(e) e.preventDefault();
      
        if(blogContext.categories.length >= 0){

            const pdts = blogContext.categories.map((i) => {

                delete i._id;
                delete i._version;
                delete i.id;
                delete i.slug;
                delete i.posts;
                delete i.tags;

                i.createdAt = moment(i.createdAt).format('ddd Do MMM, YYYY mm:ss A');
                i.updatedAt = moment(i.updatedAt).format('ddd Do MMM, YYYY mm:ss A');

                delete i.user;

                return i;
            })

            const data = papa.unparse(pdts);
            const csv = new Blob([data], {type: 'text/csv;charset=utf-8;'});

            let csvUrl = '';

            csvUrl = window.URL.createObjectURL(csv);

            let link = document.createElement("a");
            link.href = csvUrl;
            link.setAttribute("download", "categories.csv");
            link.click();
        }
    }

    const formatStatus = (p: any) => {

        let result = {
            type: 'green',
            value: 'Enabled'
        }

        if(p.isEnabled === true){
            result = { type: 'green', value: 'Enabled' }
        }

        if(p.isEnabled === false){
            result = { type: 'pink', value: 'disabled' }
        }

        return result;

    }

    return (

        <Layout pageTitle='Categories' showBack={true} collapsed={false}>

            <section className='section mt-5'>

                <div className='ui-dashboard-card'>

                    <div className="ui-dashboard-card-body">

                        <div className='d-flex align-items-center'>

                            <form className='card-search' onSubmit={(e) => { e.preventDefault(); }}>
                                <div className='card-input'>
                                    <input 
                                    ref={inputRef}
                                    onChange={(e) => { setKey(e.target.value) }}
                                    className={`font-frei fs-15 ${search.data.length > 0 ? 'disabled-lt' : ''}`} type={'text'} placeholder="Search"/>
                                    <Link onClick={(e) => { search.data.length > 0 ? clearSearch(e) : searchPosts(e) }} href="" className='btn sm bgd-disable'>
                                        {
                                            search.data.length > 0 ? 
                                            <span className='fe fe-x onwhite fs-15 ui-relative' style={{ top: '2px' }}></span> : 
                                            <span className='fe fe-arrow-right onwhite fs-15 ui-relative' style={{ top: '2px' }}></span>
                                        }
                                    </Link>
                                </div>
                            </form>

                            <div className='ml-auto'>
                                
                                {
                                    (userContext.isSuper || userContext.isAdmin) &&
                                    <Link href="" onClick={(e) => toggleAdd(e, 'new', '')} className='btn sm bgd-yellow onwhite'>
                                        <span className='font-freimedium fs-12' style={{ paddingRight: '0.2rem' }}>New</span>
                                    </Link>
                                }

                                <span className='pdl1'></span>
                                <Link onClick={(e) => exportData(e)} href="" className='btn sm bgd-disable onwhite'>
                                    <span className='font-freimedium fs-12' style={{ paddingRight: '0.2rem' }}>Export</span>
                                    <span className='fe fe-chevrons-down onwhite fs-15 ui-relative' style={{ top: '3px' }}></span>
                                </Link>
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
                            !blogContext.loading &&
                            <>
                                {
                                    blogContext.categories.length <= 0 &&

                                    <>
                                        <div className="empty-box xsm" style={{ backgroundColor: '#0d0b2b' }}>

                                            <div className="ui-text-center">
                                                <div className="row">
                                                    <div className="col-md-10 mx-auto ui-text-center">
                                                        <span className='cp-icon cp-blog active'>
                                                            <i className='path1 fs-35'></i>
                                                            <i className='path2 fs-35'></i>
                                                        </span>
                                                        <div className='font-frei onwhite fs-15 ui-line-height mrgt1 pdr1 pdl1'>We could not find categories from your request. Try again</div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </>
                                }

                                {
                                    blogContext.categories.length > 0 &&
                                    <>
                                        <div className="ui-wrapper-small table-responsive">

                                            <table className="table ui-table">

                                                <thead>
                                                    <tr className='dark'>
                                                        <th className="fs-13 font-freimedium">Date</th>
                                                        <th className="fs-13 font-freimedium">Name</th>
                                                        <th className="fs-13 font-freimedium">Description</th>
                                                        <th className="fs-13 font-freimedium">Code</th>
                                                        <th className="fs-13 font-freimedium">Status</th>
                                                        <th className="fs-13 font-freimedium">Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {
                                                        search.data.length >= 0 &&
                                                        search.data.map((c, index) =>
                                                            <>

                                                                <tr key={c._id} className="ui-table-row dark">

                                                                        <td className="fs-13 font-frei">{ moment(c.createdAt).format('Do MMM, YYYY') }</td>
                                                                        <td className="fs-13 font-frei">{c.name}</td>
                                                                        <td className="fs-13 font-frei"><span className='text-elipsis lg font-frei fs-13'>{c.description}</span></td>
                                                                        <td className="fs-13 font-frei">{c.code}</td>
                                                                        <td className="fs-13">
                                                                            <span className={`custom-badge font-freimedium ${formatStatus(c).type}`}>{ body.captialize(formatStatus(c).value) }</span>
                                                                        </td>
                                                                        <td className="fs-13">
                                                                            <div className='ui-group-button'>
                                                                                <Link onClick={(e) => toggleAdd(e, 'edit', c)} href="" className='cp-icon cp-eye'>
                                                                                    <i className='path1 fs-14'></i>
                                                                                    <i className='path2 fs-14'></i>
                                                                                </Link>
                                                                                <Link onClick={(e) => toggleDelete(e, c)} href="" className='cp-icon cp-bin reverse'>
                                                                                    <i className='path1 fs-18'></i>
                                                                                    <i className='path2 fs-18'></i>
                                                                                </Link>
                                                                            </div>
                                                                        </td>
                                                                </tr>
                                                                
                                                            </>
                                                        )
                                                    }

                                                    {
                                                        search.data.length <= 0 &&
                                                        blogContext.categories.map((c, index) =>
                                                            <>

                                                                <tr key={c._id} className="ui-table-row dark">

                                                                        <td className="fs-13 font-frei">{ moment(c.createdAt).format('Do MMM, YYYY') }</td>
                                                                        <td className="fs-13 font-frei">{c.name}</td>
                                                                        <td className="fs-13 font-frei"><span className='text-elipsis lg font-frei fs-13'>{c.description}</span></td>
                                                                        <td className="fs-13 font-frei">{c.code}</td>
                                                                        <td className="fs-13">
                                                                            <span className={`custom-badge font-freimedium ${formatStatus(c).type}`}>{ body.captialize(formatStatus(c).value) }</span>
                                                                        </td>
                                                                        <td className="fs-13">
                                                                            <div className='ui-group-button'>

                                                                                <Link onClick={(e) => toggleAdd(e, 'edit', c)} href="" className='cp-icon cp-eye'>
                                                                                    <i className='path1 fs-14'></i>
                                                                                    <i className='path2 fs-14'></i>
                                                                                </Link>

                                                                                {
                                                                                    (userContext.isAdmin || userContext.isSuper) &&
                                                                                    <Link onClick={(e) => toggleDelete(e, c)} href="" className='cp-icon cp-bin reverse'>
                                                                                        <i className='path1 fs-18'></i>
                                                                                        <i className='path2 fs-18'></i>
                                                                                    </Link>
                                                                                }
                                                                                
                                                                            </div>
                                                                        </td>
                                                                </tr>
                                                                
                                                            </>
                                                        )
                                                    }

                                                </tbody>
                                            </table>

                                            <div className='d-flex align-items-center mrgt2'>

                                                <p className='mrgb0'>
                                                    <span className='font-frei fs-14' style={{ color: "#585490" }}>Displaying { blogContext.count } categories out of { blogContext.total }</span>
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

                                        </div>
                                    </>
                                }

                            </>



                        }


                    </div>

                </div>

            </section>

            <AddNew
                isShow={add}
                closeModal={toggleAdd}
                flattened={true}
                modalTitle={type === 'edit' ? 'Category Details' : 'Add Category'}
                slim={'slim-lg'}
                data={data}
                type={type}
            />

            <DeleteModal 
                isShow={show}
                closeModal={toggleDelete}
                flattened={true}
                modalTitle={'Delete Category'}
                slim={'slim-lg'} 
                data={data}
                type="list"       
            />
            
        </Layout>
        
    )
}

Categories.getInitialProps = async (ctx: any) => {

    const { id } = ctx.query;
    return { id }

}

export default Categories