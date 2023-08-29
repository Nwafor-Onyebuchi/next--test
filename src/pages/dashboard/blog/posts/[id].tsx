import React, { useState, useEffect, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Axios from 'axios';

import { Editor } from '@tinymce/tinymce-react';
import { TagPicker } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'; // or 'rsuite/dist/rsuite.min.css'
import body from '../../../../helpers/body';
import { IBlogContext, IUserContext } from '../../../../utils/types';
import Toast from '../../../../components/partials/Toast';
import storage from '../../../../helpers/storage';

import DeleteModal from './DeleteModal'
import UserContext from '@/context/user/userContext';
import BlogContext from '@/context/blog/blogContext';
import Layout from '@/components/layouts/Dashboard';
import { NextPage } from 'next';

const PostDetails: NextPage<any> = ({ id }: any) => {

    const navigate = useRouter()

    const editorRef = useRef<any>(null);
    const coverRef = useRef<any>(null)
    const thumbRef = useRef<any>(null)

    const blogContext = useContext<IBlogContext>(BlogContext);
    const userContext = useContext<IUserContext>(UserContext);

    const [editorValue, setEditorValue] = useState<string>('')
    const [editorPreview, setEditorPreview] = useState('<p><br>Start typing here</p>')
    const [preview, setPreview] = useState<boolean>(false)
    const [step, setStep] = useState<number>(0);
    const [delay, setDelay] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [imgType, setImgType] = useState<string>('')
    const [show, setShow] = useState<boolean>(false);
    const [postData, setPostData] = useState<any>({})

    const [post, setPost] = useState({
        title: '',
        headline: '',
        tags: [],
        categoryId: '',
        bracketId: '',
        callback: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
        cover: null,
        thumbnail: null,
        platform: '',
        isChanged: false
    });

    const [toast, setToast] = useState({
        type: '',
        show: false,
        message: '',
        title: '',
        position: 'top-right'
    });

    useEffect(() => {

        blogContext.getPost(id);
    
        if(body.isArrayEmpty(blogContext.categories)){
            blogContext.getAllCategories(30,1)
        }

        if(body.isArrayEmpty(blogContext.tags)){
            blogContext.getAllTags(30,1)
        }

        if(body.isArrayEmpty(blogContext.brackets)){
            blogContext.getAllBrackets(30,1)
        }

        setStep(0);

    }, [])

    const toggleDelete = (e: any) => {
        if(e) { e.preventDefault() }
        setShow(!show);
        setPostData(blogContext.post)
    }

    const browseFile = (e:any) => {
        
        if (e.target.files && e.target.files[0]) {
    
            if (e.target.files[0].size > 5000000) {

                setToast({ ...toast, show: true, title: 'Error', type: 'error', message: 'File cannot be more than 5MB in size', position: 'top-right'})

                setTimeout(() => {
                    setToast({ ...toast, show: false })
                }, 6000)

            }

            // check for file dimension here
            getFileSource(e.target.files[0]);
            
        }
    }

    const getFileSource = (file: any) => {
    
        let reader = new FileReader();
        reader.onloadend = (e: any) => {

            if(imgType === 'cover'){
                setPost({ ...post, cover: e.target.result, isChanged: true });
            }

            if(imgType === 'thumb'){
                setPost({ ...post, thumbnail: e.target.result, isChanged: true });
            }

        };

        reader.readAsDataURL(file);
      
    }

    const openDialog = async (e: any, t:string) => {
        if(e) { e.preventDefault(); }

        if(t === 'cover'){
            coverRef.current.click();
        }

        if(t === 'thumb'){
            thumbRef.current.click();
        }

        setImgType(t)
    }

    const toggleToast = (e: any) => {
        if(e) e.preventDefault();
        setToast({ ...toast, show: !toast.show });
    }

    const updateEditorValue = (newVal: any, editor: any) => {
        const hm = editor.getContent({ format: 'html' });
        setEditorValue(newVal);
    }

    const togglePreview = (e: any) => {
        if(e){ e.preventDefault() }
        setPreview(!preview)
    }

    const changePostType = (e: any, id: string) => {

        if(e.target.checked){
            setPost({ ...post, bracketId: id, isChanged: true })
        }

    }

    const next = (e: any) => {
        if(e) { e.preventDefault() }
        setStep(1);
        setTimeout(() => {
            setDelay(true)
        }, 500)
    }

    const prev = (e: any) => {
        if(e) { e.preventDefault() }
        setStep(0);
        setDelay(false)
    }

    const pubUnPublish = async (e: any, t: string) => {

        if(e) { e.preventDefault() }

        setLoading(true);

        await Axios.put(`${process.env.NEXT_PUBLIC_BLOG_URL}/posts/${t}/${blogContext.post._id}`, { author: blogContext.post.author._id }, storage.getConfigWithBearer())
        .then((resp) => {

            if(resp.data.error === false && resp.data.status === 200){

                if(id) {
                    blogContext.getPost(id);
                }
                setPost({ ...post, isChanged: false })
                setStep(0);
                setToast({ ...toast, show: true, title: 'Successfull!', message: `Post ${t}ed successfully`, type: 'success', position: 'top-right' })
                setTimeout(() => {

                    setToast({...toast, show: false });
                    setStep(0);
                    setDelay(false);

                }, 4000)

            }

            setLoading(false);

        }).catch((err) => {

            if (err.response.data.errors && err.response.data.errors.length > 0) {

                setToast({ ...toast, show: true, title: 'Error', message: err.response.data.errors[0], type: 'error', position: 'top-right' })
                setTimeout(() => {
                    setToast({...toast, show: false })
                }, 2000)

            } else {

                setToast({ ...toast, show: true, title: 'Error', message: err.response.data.message, type: 'error', position: 'top-right' })
                setTimeout(() => {
                    setToast({...toast, show: false })
                }, 2000)
            }

            setLoading(false);
            
        })

    }

    const removeTag = async (e: any, n: string) => {

        if(e) { e.preventDefault() }

        setLoading(true);

        await Axios.put(`${process.env.NEXT_PUBLIC_BLOG_URL}/posts/remove-tag/${blogContext.post._id}`, { name: n }, storage.getConfigWithBearer())
        .then((resp) => {

            if(resp.data.error === false && resp.data.status === 200){

                if(id) {
                    blogContext.getPost(id);
                }
                
                setPost({ ...post, isChanged: false })
                setStep(0);
                setToast({ ...toast, show: true, title: 'Successfull!', message: `Tag removed successfully`, type: 'success', position: 'top-right' })
                setTimeout(() => {

                    setToast({...toast, show: false });
                    setStep(0);
                    setDelay(false);

                }, 4000)

            }

            setLoading(false);

        }).catch((err) => {

            if (err.response.data.errors && err.response.data.errors.length > 0) {

                setToast({ ...toast, show: true, title: 'Error', message: err.response.data.errors[0], type: 'error', position: 'top-right' })
                setTimeout(() => {
                    setToast({...toast, show: false })
                }, 2000)

            } else {

                setToast({ ...toast, show: true, title: 'Error', message: err.response.data.message, type: 'error', position: 'top-right' })
                setTimeout(() => {
                    setToast({...toast, show: false })
                }, 2000)
            }

            setLoading(false);
            
        })

    }

    const savePost = async (e: any) => {

        if(e) { e.preventDefault() }

        const data = {
            title: post.title ? post.title : '',
            headline: post.headline ? post.headline : '',
            body: editorValue,
            tags: post.tags,
            categoryId: post.categoryId,
            bracketId: post.bracketId ? post.bracketId : '',
            callback: post.callback,
            cover: post.cover,
            thumbnail: post.thumbnail ? post.thumbnail : ''
        }

        setLoading(true);

        await Axios.put(`${process.env.NEXT_PUBLIC_BLOG_URL}/posts/${blogContext.post._id}`, {...data}, storage.getConfigWithBearer())
        .then((resp) => {

            if(resp.data.error === false && resp.data.status === 200){

                if(id) {
                    blogContext.getPost(id);
                }

                setStep(0);
                setToast({ ...toast, show: true, title: 'Post Saved!', message: 'Post was saved successfully', type: 'success', position: 'top-right' })
                setTimeout(() => {

                    setToast({...toast, show: false });
                    setDelay(false);
                    setPost({ ...post, isChanged: false })

                }, 4000)

            }

            setLoading(false);

        }).catch((err) => {

            if (err.response.data.errors && err.response.data.errors.length > 0) {

                setToast({ ...toast, show: true, title: 'Error', message: err.response.data.errors[0], type: 'error', position: 'top-right' })
                setTimeout(() => {
                    setToast({...toast, show: false })
                }, 2000)

            } else {

                setToast({ ...toast, show: true, title: 'Error', message: err.response.data.message, type: 'error', position: 'top-right' })
                setTimeout(() => {
                    setToast({...toast, show: false })
                }, 2000)
            }

            setTimeout(() => {

                setToast({...toast, show: false });
                setDelay(false);
                setPost({ ...post, isChanged: false })

            }, 4000)

            setLoading(false);
            
        })

    }

    const routePost = (e: any) => {
        if(e) { e.preventDefault() }

        if(post.isChanged){
            savePost(e)
        }else{
            next(e)
        }
    }

    return (
        <Layout pageTitle='Post Details' showBack={true} collapsed={false}>

            <Toast
                show={toast.show}
                close={toggleToast}
                title={toast.title}
                message={toast.message}
                type={toast.type}
                position={toast.position}
            />

            <section className='section mrgt2'>

                <div className='post-dp lined ui-full-bg-norm ui-bg-center ui-relative' style={{ backgroundImage: `url(${post.cover ? post.cover : blogContext.post.cover ? blogContext.post.cover : "../../../images/assets/bg@post-avatar.jpg"})` }}>
                    <input onChange={(e) => browseFile(e)} ref={coverRef} type="file" accept='image/*' className="ui-hide"/>
                    <Link onClick={(e) => openDialog(e, 'cover')} href="" className='link-round smd ui-absolute' style={{ backgroundColor: 'rgba(174,171,211,0.15)', top: '1rem', right: '4rem' }}>
                        <span className='fe fe-edit-2 onwhite fs-17'></span>
                    </Link>

                    <Link onClick={(e) => toggleDelete(e)} href="" className='link-round smd ui-absolute' style={{ backgroundColor: 'rgba(174,171,211,0.15)', top: '1rem', right: '1rem' }}>
                        <span className='cp-icon cp-bin'>
                            <i className='path1 fs-17'></i>
                            <i className='path2 fs-17'></i>
                        </span>
                    </Link>

                </div>

            </section>

            <section className='section mrgt3 mrgb3'>

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
                    !blogContext.loading && body.isObjectEmpty(blogContext.post) &&
                    <>
                        <div className="empty-box xsm" style={{ backgroundColor: '#0d0b2b' }}>

                            <div className="ui-text-center">
                                <div className="row">
                                    <div className="col-md-10 mx-auto ui-text-center">
                                        
                                        <span className='cp-icon cp-blog'>
                                            <i className='path1 fs-30'></i>
                                            <i className='path2 fs-30'></i>
                                        </span>

                                        <p className='font-frei mrgb0 onwhite fs-15 ui-line-height mrgt1 pdr1 pdl1'>We could not find the post from your request. Try again</p>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                }

                {
                    !blogContext.loading && !body.isObjectEmpty(blogContext.post) &&
                    <>

                        {
                            step === 0 &&
                            <>
                                <div className='row no-gutters'>

                                    <div className='col-md-8'>

                                        <h2 className='onwhite font-freimedium fs-26 mrgb'>{ blogContext.post.title }</h2>

                                        <div className='post-html onwhite mrgb2 font-frei' 
                                            dangerouslySetInnerHTML={{ __html: blogContext.post.markedHtml }} 
                                        />

                                    </div>

                                    <div className='col-md-4'>

                                        <form className='pdl2 post-form form' onSubmit={(e) => { e.preventDefault(); }}>

                                            <div className='d-flex align-items-center'>
                                                <div className='ml-auto'>

                                                    {
                                                        (userContext.isSuper || userContext.isAdmin) &&
                                                        <>
                                                            {
                                                                blogContext.post.isPublished &&
                                                                <Link onClick={(e) => { post.isChanged ? savePost(e) : pubUnPublish(e, 'un-publish') }} href="" className={`btn xs bgd-yellow onwhite ${loading ? 'disabled-lt' : ''}`}>
                                                                    { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-13 stretch-md'>{ post.isChanged ? 'Save Post' : 'Unpublish' }</span> }
                                                                </Link>
                                                            }
                                                            {
                                                                !blogContext.post.isPublished &&
                                                                <Link onClick={(e) => { post.isChanged ? savePost(e) :  pubUnPublish(e, 'publish') }} href="" className={`btn xs bgd-yellow onwhite ${loading ? 'disabled-lt' : ''}`}>
                                                                    { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-13 stretch-md'>{ post.isChanged ? 'Save Post' : 'Publish' }</span> }
                                                                </Link>
                                                            }
                                                            <span className='pdl1'></span>
                                                            <Link onClick={(e) => next(e)} href="" className={`btn xs bgd-disable onwhite ${loading ? 'disabled-lt' : ''}`}>
                                                                { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-13 stretch-md'>Edit</span> }
                                                            </Link>
                                                        </>
                                                    }
                                                    {
                                                        (!userContext.isSuper && !userContext.isAdmin) &&
                                                        <>
                                                            <Link onClick={(e) => routePost(e)} href="" className={`btn xs bgd-yellow onwhite ${loading ? 'disabled-lt' : ''}`}>
                                                                { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-13 stretch-md'>{ post.isChanged ? 'Save' : 'Edit' }</span> }
                                                            </Link>
                                                            <span className='pdl1'></span>
                                                            <Link onClick={(e) => toggleDelete(e)} href="" className={`btn xs bgd-disable onwhite ${loading ? 'disabled-lt' : ''}`}>
                                                                { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-13 stretch-md'>Delete</span> }
                                                            </Link>
                                                        </>
                                                    }

                                                </div>
                                            </div>

                                            <div className='mrgt2 mrgb1'>
                                                <label className='fs-12 onwhite font-freimedium mrgb'>Post thumbnail</label>
                                                <div className='post-dp lined sm ui-full-bg-norm ui-relative ui-bg-center' style={{ backgroundImage: `url(${post.thumbnail ? post.thumbnail : blogContext.post.thumbnail ? blogContext.post.thumbnail : "../../../images/assets/bg@post-avatar.jpg"})` }}>
                                                    <input onChange={(e) => browseFile(e)} ref={thumbRef} type="file" accept='image/*' className="ui-hide"/>
                                                    <Link onClick={(e) => openDialog(e, 'thumb')} href="" className='link-round smd ui-absolute' style={{ backgroundColor: 'rgba(174,171,211,0.15)', top: '1rem', right: '1rem' }}>
                                                        <span className='fe fe-edit-2 onwhite fs-17'></span>
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className='form-row mrgb1'>
                                                <div className='col'>
                                                    <label className='fs-12 onwhite font-freimedium mrgb'>Post Headline *</label>
                                                    <textarea
                                                    defaultValue={blogContext.post.headline}
                                                    onChange={(e) => { setPost({ ...post, headline: e.target.value, isChanged: true }) }}
                                                    className="form-control fs-13 on-black font-frei auth-input onwhite"
                                                    placeholder="Introduce this post to concreap audience." autoComplete='off' 
                                                    />
                                                </div>
                                            </div>

                                            <div className='form-row mrgb1'>

                                                <div className={`col-6 ${blogContext.loading ? 'disabled-lt' : ''}`}>
                                                    <label className='fs-12 onwhite font-freimedium mrgb'>Catgeory *</label>
                                                    <select
                                                    defaultValue={blogContext.post.category && blogContext.post.category._id}
                                                    onChange={(e) => { setPost({ ...post, categoryId: e.target.value, isChanged: true }) }}
                                                    className="form-control custom-select fs-14 lg onwhite font-frei auth-input"
                                                    autoComplete='off'>
                                                        <option value="">Select</option>
                                                        {
                                                            blogContext.categories.length > 0 &&
                                                            blogContext.categories.map((c, index) => 
                                                                <>
                                                                    <option key={c._id.toString()} value={c._id}>{ body.captialize(c.name) }</option>
                                                                </>
                                                            )
                                                        }
                                                    </select>
                                                </div>

                                                <div className={`col-6 ${blogContext.loading ? 'disabled-lt' : ''}`}>
                                                    <label className='fs-12 onwhite font-freimedium mrgb'>Bracket *</label>
                                                    <div className='d-flex align-items-center' style={{ minHeight: '50px' }}>

                                                        {
                                                            blogContext.brackets.length > 0 && 
                                                            blogContext.brackets.map((b, index) => 
                                                                <>
                                                                    <div key={b._id.toString()} className="custom-control custom-radio custom-control-inline">
                                                                        <input onChange={(e) => changePostType(e, b._id)} defaultChecked={blogContext.post.bracket && blogContext.post.bracket._id === b._id ? true : false} type="radio" id={`barti-${index+1}`} name="post-bracket" className="custom-control-input" />
                                                                        <label className="custom-control-label font-frei fs-13" style={{ color: '#646195' }} htmlFor={`barti-${index+1}`}>{ body.captialize(b.name) }</label>
                                                                    </div>
                                                                </>
                                                             )
                                                        }

                                                    </div>
                                                </div>

                                            </div>

                                            <div className='form-row mrgb2'>

                                                <div className={`col ${loading ? 'disabled-lt' : ''}`}>

                                                    <label className='fs-12 onwhite font-freimedium mrgb'>Post Tags</label>

                                                    {
                                                        blogContext.post.tags && blogContext.post.tags.length > 0 && 
                                                        <>
                                                            <div className='d-flex flex-wrap mrgb1 mrgt'>

                                                                {
                                                                    blogContext.post.tags.map((t: any, index: number) => 
                                                                        <>
                                                                            <div key={t._id.toString()} className='custom-badge bgd-disable'>
                                                                                <span className='onwhite font-freimedium fs-12 pdr'>{t.name}</span>
                                                                                <Link onClick={(e) => removeTag(e, t.name)} href="" className='fe fe-x fs-12 onaliz'></Link>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                }
                                                        
                                                            </div>
                                                        </>
                                                    }

                                                    <TagPicker
                                                        creatable
                                                        size='lg'
                                                        data={ blogContext.formatted }
                                                        style={{ 
                                                            width: '100%',
                                                            fontFamily: 'freizeit_trialregular',
                                                            color: '#000',
                                                            height:'50px'
                                                        }}
                                                        menuMaxHeight={200}
                                                        menuClassName={'rs-menu-edit onblack'}
                                                        onChange={(value)=> {
                                                            setPost({ ...post, tags: value, isChanged: true })
                                                        }}
                                                    />

                                                </div>

                                            </div>

                                            <div className='d-flex align-items-center'>
                                                <div className='ml-auto'>

                                                    {
                                                        (userContext.isSuper || userContext.isAdmin) &&
                                                        <>
                                                            {
                                                                blogContext.post.isPublished &&
                                                                <Link onClick={(e) => { post.isChanged ? savePost(e) : pubUnPublish(e, 'un-publish') }} href="" className={`btn xs bgd-yellow onwhite ${loading ? 'disabled-lt' : ''}`}>
                                                                    { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-13 stretch-md'>{ post.isChanged ? 'Save Post' : 'Unpublish' }</span> }
                                                                </Link>
                                                            }
                                                            {
                                                                !blogContext.post.isPublished &&
                                                                <Link onClick={(e) => { post.isChanged ? savePost(e) :  pubUnPublish(e, 'publish') }} href="" className={`btn xs bgd-yellow onwhite ${loading ? 'disabled-lt' : ''}`}>
                                                                    { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-13 stretch-md'>{ post.isChanged ? 'Save Post' : 'Publish' }</span> }
                                                                </Link>
                                                            }
                                                            <span className='pdl1'></span>
                                                            <Link onClick={(e) => next(e)} href="" className={`btn xs bgd-disable onwhite ${loading ? 'disabled-lt' : ''}`}>
                                                                { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-13 stretch-md'>Edit</span> }
                                                            </Link>
                                                        </>
                                                    }
                                                    {
                                                        (!userContext.isSuper && !userContext.isAdmin) &&
                                                        <>
                                                            <Link onClick={(e) => routePost(e)} href="" className={`btn xs bgd-yellow onwhite ${loading ? 'disabled-lt' : ''}`}>
                                                            { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-13 stretch-md'>{ post.isChanged ? 'Save' : 'Edit' }</span> }
                                                            </Link>
                                                            <span className='pdl1'></span>
                                                            <Link onClick={(e) => toggleDelete(e)} href="" className={`btn xs bgd-disable onwhite ${loading ? 'disabled-lt' : ''}`}>
                                                                { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-13 stretch-md'>Delete</span> }
                                                            </Link>
                                                        </>
                                                    }

                                                </div>
                                            </div>

                                        </form>

                                    </div>

                                </div>
                            </>
                        }

                        {
                            step === 1 &&
                            <>

                                <div className='post-form'>

                                    <div className='d-flex align-items-center mrgb3'>

                                        <Link onClick={(e) => prev(e)} href="" className={`link-round sm bgd-disable onwhite ui-relative ${step === 1 ? '' : 'ui-hide'}`} style={{ top:'2px' }}>
                                            <span className='fe fe-chevron-left fs-15'></span>
                                        </Link>
                                
                                        <div className='post-title pdl2'>
                                            <input 
                                            defaultValue={blogContext.post.title}
                                            onChange={(e) => { setPost({ ...post, title: e.target.value, isChanged: true }) }}
                                            className='font-frei fs-25 onwhite' type={'text'} placeholder="Type post title here"/>
                                        </div>
                                        
                                        <div className='ml-auto'>
                                            <Link onClick={(e) => savePost(e)} href="" className={`btn xs bgd-yellow onwhite ${loading ? 'disabled-lt' : ''}`}>
                                                { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-13 stretch-md'>Save</span> }
                                            </Link>
                                        </div>

                                    </div>

                                    <div className={`${delay ? 'ui-visible' : 'ui-hidden'}`}>

                                        <Editor
                                            apiKey='c7331qpwutp9ejpt8lkf4me5vao63q9bg83a54h4pz0obthe'
                                            onInit={(evt, editor) => editorRef.current = editor}
                                            initialValue={ blogContext.post.body }
                                            onEditorChange={updateEditorValue}
                                            init={{
                                                height: 500,
                                                autosave_restore_when_empty: false,
                                                autosave_retention: '2m',
                                                image_advtab: true,
                                                images_upload_url: '',
                                                default_link_target: "_blank",
                                                resize: false,
                                                mobile: {
                                                    plugins: 'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter pageembed charmap mentions quickbars linkchecker emoticons advtable'
                                                },
                                                plugins: 'image link code fullscreen table media lists autolink advlist autoresize directionality',
                                                toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment | code',
                                                importcss_append: true,
                                                image_title: true,
                                                automatic_uploads: true,
                                                file_picker_types: 'image file media',
                                                content_style: `.mce-content-body { color: #fff !important; }` + `body { font-size: 14px; }`
                                            }}
                                        />
                                        <div className='ui-separate-small'></div>

                                    </div>

                                </div>

                            </>
                        }
                    
                    </>
                }

            </section>


            <DeleteModal 
                isShow={show}
                closeModal={toggleDelete}
                flattened={true}
                modalTitle={'Delete Post'}
                slim={'slim-lg'} 
                data={postData}
                type="single"       
            />

        </Layout>
    )
}

PostDetails.getInitialProps = async (ctx: any) => {

    const id = ctx.query.id as string;
    return { id }

}

export default PostDetails