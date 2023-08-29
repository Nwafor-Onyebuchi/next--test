import React, { useState, useEffect, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import BlogContext from '../../../../context/blog/blogContext'
import UserContext from '../../../../context/user/userContext'
import storage from '../../../../helpers/storage'
import { IBlogContext, IUserContext } from '../../../../utils/types'
import DeleteModal from './DeleteModal'
import Axios from 'axios';
import Toast from '../../../../components/partials/Toast';

import moment from 'moment'
import body from '../../../../helpers/body'
import papa from 'papaparse'
import PanelBox from '../../../../components/partials/PanelBox'

const SubList = ({ page }: Partial<{ page: string }>) => {

    const inputRef = useRef<any>(null)

    const blogContext = useContext<IBlogContext>(BlogContext)
    const userContext = useContext<IUserContext>(UserContext)

    const [show, setShow] = useState<boolean>(false)
    const [showPanel, setShowPanel] = useState(false)
    const [animate, setAnimate] = useState(false)
    const [subber, setSubber] = useState<any>({})
    const [search, setSearch] = useState<{ err: boolean, msg: string, data: Array<any> }>({
        err: false,
        msg: '',
        data: []
    });

    const [loading, setLoading] = useState<boolean>(false)
    const [key, setKey] = useState<string>('');

    const [toast, setToast] = useState({
        type: '',
        show: false,
        message: '',
        title: '',
        position: 'top-right'
    });

    useEffect(() => {

        let limit: number = page && page === 'general' ? 10 : 30;
        
        if(userContext.getUserType() === 'superadmin' || userContext.getUserType() === 'admin'){
            blogContext.getSubscribers(limit, 1);
        }

    }, [])

    const togglePanel = (e: any, d: any, t: string) => {
        if(e) e.preventDefault();

        if(t === 'open'){

            setShowPanel(!showPanel);
        
            setTimeout(() => {
                setAnimate(!animate);
            }, 130)
        }

        if(t === 'close'){
            setAnimate(!animate);
        
            setTimeout(() => {
                setShowPanel(!showPanel);
            }, 100)
        }

        if(d) { setSubber(d) }
        
    }

    const toggleToast = (e: any) => {
        if(e) e.preventDefault();
        setToast({ ...toast, show: !toast.show });
    }

    const toggleDelete = (e: any, d:any) => {
        if(e) { e.preventDefault() }
        setShow(!show);
        if(d){
            setSubber(d)
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

    const pagiNext = async (e: any) => {

        if(e) { e.preventDefault() }

        if(userContext.getUserType() === 'writer'){
            blogContext.getUserPosts(blogContext.pagination.next.limit, blogContext.pagination.next.page, storage.getUserID())
        }

        if(userContext.getUserType() === 'superadmin' || userContext.getUserType() === 'admin'){
            blogContext.getPosts(blogContext.pagination.next.limit, blogContext.pagination.next.page)
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
      
        if(blogContext.subscribers.length >= 0){

            const pdts = blogContext.subscribers.map((i) => {

                delete i._id;
                delete i._version;
                delete i.id;
                delete i.slug;

                i.createdAt = moment(i.createdAt).format('ddd Do MMM, YYYY mm:ss A');
                i.updatedAt = moment(i.updatedAt).format('ddd Do MMM, YYYY mm:ss A');
                i.leftAt = i.leftAt ? i.leftAt : moment(i.leftAt).format('ddd Do MMM, YYYY mm:ss A');

                i.image = i.dp ? i.dp : 'no-image.jpg'

                return i;
            })

            const data = papa.unparse(pdts);
            const csv = new Blob([data], {type: 'text/csv;charset=utf-8;'});

            let csvUrl = '';

            csvUrl = window.URL.createObjectURL(csv);

            let link = document.createElement("a");
            link.href = csvUrl;
            link.setAttribute("download", "subscribers.csv");
            link.click();
        }
    }

    const togglePop = (e: any, id: string) => {

        if(e) { e.preventDefault(); }
        
        const elem = document.getElementById(id);
        const pops = document.querySelectorAll(`.ui-td-popover`);

        if(elem){

            if(elem.classList.contains('open')){
                elem.classList.remove('open');
                elem.classList.add('close');
            }else{

                elem.classList.remove('close');
                elem.classList.add('open');

                if(pops.length > 0){

                    pops.forEach((pop: any) => {
        
                        if(pop.id !== elem.id && pop.classList.contains('open')){
                            pop.classList.remove('open');
                            pop.classList.add('close');
                        }
        
                    })
                    
                }
                
            }
        }


    }

    const searchSubscribers = async (e: any) => {

        if(e) { e.preventDefault() }

        if(!key){
            setSearch({ ...search, err: true, msg: 'Enter search keyword', data: []})
        }else{

            blogContext.setLoading()

            await Axios.post(`${process.env.NEXT_PUBLIC_BLOG_URL}/subscribers/seek`, { key: key }, storage.getConfigWithBearer())
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

    const copyLink = (e:any, l: string) => {

        if(e) { e.preventDefault(); }

        if(l){
            
            storage.copyCode(l);

            setToast({ ...toast, show: true, title: 'Copied!', message: 'Link copied successful', position: 'top-right' });
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 1000)

        }
    }

    const formatLink = (d: any) => {
        let r: string = '';

        if(!d.isEnabled){

            r = d.previewLink;

        }else{

            if(d.isPublished){
                r = d.premalink;
            }else{
                r = d.previewLink;
            }

        }

        return r;

    }

    return (
        <>

            <Toast
                show={toast.show}
                close={toggleToast}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                position={toast.position}
            />

            <section className='section mt-5'>

                <div className='ui-dashboard-card'>

                    <div className="ui-dashboard-card-body">

                        <div className='d-flex align-items-center'>
                            <form className='card-search' onSubmit={(e) => { e.preventDefault(); }}>
                                <div className='card-input'>
                                    <input 
                                    ref={inputRef}
                                    onChange={(e) => { setKey(e.target.value) }}
                                    className={`font-frei fs-15 ${search.data.length > 0 ? 'disabled-lt' : ''}`} type={'text'} placeholder="Search" />
                                    <Link onClick={(e) => { search.data.length > 0 ? clearSearch(e) : searchSubscribers(e) }} href="" className='btn sm bgd-disable'>
                                        {
                                            search.data.length > 0 ? 
                                            <span className='fe fe-x onwhite fs-15 ui-relative' style={{ top: '2px' }}></span> : 
                                            <span className='fe fe-arrow-right onwhite fs-15 ui-relative' style={{ top: '2px' }}></span>
                                        }
                                    </Link>
                                </div>
                            </form>
                            <div className='ml-auto'>
                                <Link href="/dashboard/blog/posts/new" className='btn sm bgd-yellow onwhite ui-hide'>
                                    <span className='font-freimedium fs-12' style={{ paddingRight: '0.2rem' }}>New</span>
                                </Link>
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
                                    blogContext.subscribers.length <= 0 &&
                                    <>

                                        <div className="empty-box sm" style={{ backgroundColor: '#0d0b2b' }}>

                                            <div className="ui-text-center">
                                                <div className="row">
                                                    <div className="col-md-10 mx-auto ui-text-center">
                                                        <span className='cp-icon cp-avatar active fs-35 grad'></span>
                                                        <div className='font-frei onwhite fs-15 ui-line-height mrgt1 pdr1 pdl1'>We could not find subscribers from your request. Try again</div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div> 

                                    </>
                                }

                                {
                                    blogContext.subscribers.length > 0 &&
                                    <>
                                        <div className="ui-wrapper-small table-responsive">

                                            <table className="table ui-table">

                                                <thead>
                                                    <tr className='dark'>
                                                        <th className="fs-13 font-freimedium">#</th>
                                                        <th className="fs-13 font-freimedium">Joined</th>
                                                        <th className="fs-13 font-freimedium">Name</th>
                                                        <th className="fs-13 font-freimedium">Email</th>
                                                        <th className="fs-13 font-freimedium">Left At</th>
                                                        <th className="fs-13 font-freimedium">Status</th>
                                                        <th className="fs-13 font-freimedium">Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {
                                                        search.data.length > 0 &&
                                                        search.data.map((sub, index) => 
                                                            <tr key={sub._id} className="ui-table-row dark">
                                                                <td className="fs-13 font-frei">
                                                                    <div className='table-dp round ui-full-bg-norm ui-bg-center' style={{ backgroundImage: `url(${sub.thumbnail ? sub.thumbnail : "../../../images/assets/user-avatar.svg"})` }}></div>
                                                                </td>
                                                                <td className="fs-13 font-frei">{ moment(sub.createdAt).format('Do MMM, YYYY') }</td>
                                                                <td className="fs-13 font-frei"><Link onClick={(e) => togglePanel(e, sub, 'open')} href={""} className='fs-14'>{ sub.name }</Link></td>
                                                                <td className="fs-13 font-frei">{ sub.email }</td>
                                                                <td className="fs-13 font-frei">{ sub.leftAt ? moment(sub.leftAt).format('Do MMM, YYYY') : 'Not Yet' }</td>
                                                                <td className="fs-13">
                                                                    <span className={`custom-badge font-freimedium ${formatStatus(sub).type}`}>{ body.captialize(formatStatus(sub).value) }</span>
                                                                </td>
                                                                <td className="fs-13">
                                                                    <div className='ui-group-button ui-relative'>

                                                                        <div id={`td-pop-${index+1}`} className='ui-td-popover close'>
                                                                            <ul>
                                                                                <li><Link onClick={(e) => togglePanel(e, sub, 'open')} href={``} className='font-frei onwhite fs-14'>Details</Link></li>
                                                                                <li><Link onClick={(e) => toggleDelete(e, sub)} href="" className='font-frei onwhite fs-14'>{ sub.isEnabled ? 'Disable' : 'Enable' }</Link></li>
                                                                                <li><Link onClick={(e) => copyLink(e, formatLink(sub))} href="" className='font-frei onwhite fs-14'>Copy link</Link></li>
                                                                            </ul>
                                                                        </div>

                                                                        <Link onClick={(e) => togglePanel(e, sub, 'open')} href={``} className='cp-icon cp-eye'>
                                                                            <i className='path1 fs-14'></i>
                                                                            <i className='path2 fs-14'></i>
                                                                        </Link>
                                                                        <Link onClick={(e) => toggleDelete(e, sub)} href="" className='cp-icon cp-bin reverse'>
                                                                            <i className='path1 fs-18'></i>
                                                                            <i className='path2 fs-18'></i>
                                                                        </Link>
                                                                        
                                                                        <Link onClick={(e) => togglePop(e, `td-pop-${index+1}`)} href="" className='cp-icon cp-dots grad ui-relative' style={{ top: '1px' }}></Link>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }

                                                    {
                                                        search.data.length <= 0 &&
                                                        blogContext.subscribers.map((sub, index) => 
                                                            <>
                                                                <tr key={sub._id} className="ui-table-row dark">
                                                                    <td className="fs-13 font-frei">
                                                                        <div className='table-dp round ui-full-bg-norm ui-bg-center' style={{ backgroundImage: `url(${sub.thumbnail ? sub.thumbnail : "../../../images/assets/user-avatar.svg"})` }}></div>
                                                                    </td>
                                                                    <td className="fs-13 font-frei">{ moment(sub.createdAt).format('Do MMM, YYYY') }</td>
                                                                    <td className="fs-13 font-frei"><Link onClick={(e) => togglePanel(e, sub, 'open')} href={""} className='fs-14'>{ sub.name }</Link></td>
                                                                    <td className="fs-13 font-frei">{ sub.email }</td>
                                                                    <td className="fs-13 font-frei">{ sub.leftAt ? moment(sub.leftAt).format('Do MMM, YYYY') : 'Not Yet' }</td>
                                                                    <td className="fs-13">
                                                                        <span className={`custom-badge font-freimedium ${formatStatus(sub).type}`}>{ body.captialize(formatStatus(sub).value) }</span>
                                                                    </td>
                                                                    <td className="fs-13">
                                                                        <div className='ui-group-button ui-relative'>

                                                                            <div id={`td-pop-${index+1}`} className='ui-td-popover close'>
                                                                                <ul>
                                                                                    <li><Link onClick={(e) => togglePanel(e, sub, 'open')} href={``} className='font-frei onwhite fs-14'>Details</Link></li>
                                                                                    <li><Link onClick={(e) => toggleDelete(e, sub)} href="" className='font-frei onwhite fs-14'>{ sub.isEnabled ? 'Disable' : 'Enable' }</Link></li>
                                                                                    <li><Link onClick={(e) => copyLink(e, `${process.env.NEXT_PUBLIC_BASE_URL}/blog/subscribers/v/${sub.code}`)} href="" className='font-frei onwhite fs-14'>Copy link</Link></li>
                                                                                </ul>
                                                                            </div>

                                                                            <Link onClick={(e) => togglePanel(e, sub, 'open')} href={``} className='cp-icon cp-eye'>
                                                                                <i className='path1 fs-14'></i>
                                                                                <i className='path2 fs-14'></i>
                                                                            </Link>
                                                                            <Link onClick={(e) => toggleDelete(e, sub)} href="" className='cp-icon cp-bin reverse'>
                                                                                <i className='path1 fs-18'></i>
                                                                                <i className='path2 fs-18'></i>
                                                                            </Link>

                                                                            <Link onClick={(e) => togglePop(e, `td-pop-${index+1}`)} href="" className='cp-icon cp-dots grad ui-relative' style={{ top: '1px' }}></Link>
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
                                                    <span className='font-frei fs-14' style={{ color: "#585490" }}>Displaying { blogContext.count } posts out of { blogContext.total }</span>
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

            <DeleteModal 
                isShow={show}
                closeModal={toggleDelete}
                flattened={true}
                modalTitle={'Delete Post'}
                slim={'slim-lg'} 
                data={subber}
                type="list"       
            />

            <PanelBox
            title=''
            type=''
            show={showPanel}
            display={'details'}
            animate={animate}
            close={togglePanel}
            data={subber}
            size={'md'}
            />

            

        </>
    )
}

export default SubList