import React, { useState, useEffect, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Axios from 'axios';

import { Editor } from '@tinymce/tinymce-react';
import { TagPicker } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'; // or 'rsuite/dist/rsuite.min.css'
import body from '../../../../helpers/body';
import { IBlogContext } from '../../../../utils/types';
import Toast from '../../../../components/partials/Toast';
import storage from '../../../../helpers/storage';
import BlogContext from '@/context/blog/blogContext';
import Layout from '@/components/layouts/Dashboard';
import { NextPage } from 'next';

const NewPost: NextPage<any> = () => {

    const navigate = useRouter()

    const editorRef = useRef<any>(null);
    const coverRef = useRef<any>(null)

    const blogContext = useContext<IBlogContext>(BlogContext);

    const [editorValue, setEditorValue] = useState<string>('')
    const [editorPreview, setEditorPreview] = useState('<p><br>Start typing here</p>')
    const [preview, setPreview] = useState<boolean>(false)
    const [step, setStep] = useState<number>(0);
    const [delay, setDelay] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [post, setPost] = useState({
        title: '',
        headline: '',
        tags: [],
        categoryId: '',
        bracketId: '',
        callback: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
        cover: null,
        platform: ''
    });

    const [toast, setToast] = useState({
        type: '',
        show: false,
        message: '',
        title: '',
        position: 'top-right'
    });

    useEffect(() => {

        setStep(0)

        if(body.isArrayEmpty(blogContext.categories)){
            blogContext.getAllCategories(30,1)
        }
    
        if(body.isArrayEmpty(blogContext.tags)){
            blogContext.getAllTags(30,1)
        }
    
        if(body.isArrayEmpty(blogContext.brackets)){
            blogContext.getAllBrackets(30,1)
        }

        setTimeout(() => {
            setDelay(true)
        }, 500)

    }, [])

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
            setPost({ ...post, cover: e.target.result });
        };

        reader.readAsDataURL(file);
      
    }

    const openDialog = async (e: any) => {
        if(e) { e.preventDefault(); }
        coverRef.current.click();
    }

    const toggleToast = (e: any) => {
        if(e) e.preventDefault();
        setToast({ ...toast, show: !toast.show });
    }

    const updateEditorValue = (newVal: any, editor: any) => {
        const hm = editor.getContent({ format: 'html' });
        setEditorPreview(hm)
        setEditorValue(newVal);
    }

    const togglePreview = (e: any) => {
        if(e){ e.preventDefault() }
        setPreview(!preview)
    }

    const changePostType = (e: any, id: string) => {

        if(e.target.checked){
            setPost({ ...post, bracketId: id })
        }

    }

    const next = (e: any) => {
        if(e) { e.preventDefault() }

        if(!post.title){
            setToast({ ...toast, show: true, title: 'Title Error', message: 'Provide post title', type: 'error', position: 'top-right' })
            setTimeout(() => {
                setToast({...toast, show: false })
            }, 2000)
        }else{
            setStep(1)
        }
    }

    const savePost = async (e: any) => {

        if(e) { e.preventDefault() }

        if(!post.headline && !post.categoryId && !post.bracketId){
            setToast({ ...toast, show: true, title: 'Fields Error', message: 'Supply required fields', type: 'error', position: 'top-right' })
            setTimeout(() => {
                setToast({...toast, show: false })
            }, 2000)
        }else if(!post.headline){
            setToast({ ...toast, show: true, title: 'Error', message: 'Type post headline', type: 'error', position: 'top-right' })
            setTimeout(() => {
                setToast({...toast, show: false })
            }, 2000)
        }else if(!post.categoryId){
            setToast({ ...toast, show: true, title: 'Error', message: 'Choose a category', type: 'error', position: 'top-right' })
            setTimeout(() => {
                setToast({...toast, show: false })
            }, 2000)
        }else{

            const bracket = blogContext.brackets.find((x) => x.name === 'Article');

            const data = {
                title: post.title,
                headline: post.headline,
                body: editorValue,
                tags: post.tags,
                categoryId: post.categoryId,
                bracketId: post.bracketId ? post.bracketId : bracket.name,
                authorId: storage.getUserID(),
                callback: post.callback,
                cover: post.cover
            }

            setLoading(true);

            await Axios.post(`${process.env.NEXT_PUBLIC_BLOG_URL}/posts`, {...data}, storage.getConfigWithBearer())
            .then((resp) => {

                if(resp.data.error === false && resp.data.status === 200){
                    
                    setToast({ ...toast, show: true, title: 'Post Saved!', message: 'Post was saved successfully', type: 'success', position: 'top-right' })
                    setTimeout(() => {

                        setToast({...toast, show: false });
                        setStep(0);
                        setPreview(false);

                        // navigate(`/dashboard/blog/posts/${resp.data.data._id}`);
                        navigate.push(`/dashboard/blog/posts`);

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

    }


    return (
        <Layout pageTitle='New Post' showBack={true} collapsed={false}>

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

                        <form className='post-form form' onSubmit={(e) => { e.preventDefault(); }}>

                            {
                                !preview &&
                                <>

                                    <div className='d-flex align-items-center mrgb3'>

                                        <Link onClick={(e) => { e.preventDefault(); setStep(0) }} href="" className={`link-round sm bgd-disable onwhite ui-relative ${step === 1 ? '' : 'ui-hide'}`} style={{ top:'2px' }}>
                                            <span className='fe fe-chevron-left fs-15'></span>
                                        </Link>
                                
                                        <div className='post-title'>
                                            <input 
                                            defaultValue={post.title}
                                            onChange={(e) => { setPost({ ...post, title: e.target.value }) }}
                                            className='font-frei fs-25 onwhite' type={'text'} placeholder="Type post title here"/>
                                        </div>
                                        
                                        <div className='ml-auto'>
                                            <Link onClick={(e) => next(e)} href="" className={`btn sm bgd-yellow onwhite ${step === 0 ? '' : 'ui-hide'}`}>
                                                <span className='font-freimedium fs-12'>Continue</span>
                                            </Link>
                                            <span className='pdl1'></span>
                                            <Link onClick={(e) => togglePreview(e)} href="" className='btn sm bgd-disable onwhite'>
                                                <span className='font-freimedium fs-12'>Preview</span>
                                            </Link>
                                        </div>

                                    </div>

                                    {
                                        step === 0 && 
                                        <>

                                            <div className={`${delay ? 'ui-visible' : 'ui-hidden'}`}>

                                                <Editor
                                                    apiKey='c7331qpwutp9ejpt8lkf4me5vao63q9bg83a54h4pz0obthe'
                                                    onInit={(evt, editor) => editorRef.current = editor}
                                                    value={ editorPreview }
                                                    onEditorChange={updateEditorValue}
                                                    init={{
                                                        height: 500,
                                                        autosave_restore_when_empty: false,
                                                        autosave_retention: '2m',
                                                        image_advtab: true,
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
                                        
                                        </>
                                    }

                                    {
                                        step === 1 &&
                                        <>

                                            <div className='row mrgl0 mrgr0 mrgb2'>

                                                <div className='col-md-6'>
                                                    <label className='fs-13 onwhite font-freimedium mrgb'>Post cover image</label>
                                                    <div className='post-dp ui-full-bg-norm ui-relative ui-bg-center' style={{ backgroundImage: `url(${post.cover ? post.cover : "../../../images/assets/bg@post-avatar.jpg"})` }}>
                                                        <input onChange={(e) => browseFile(e)} ref={coverRef} type="file" accept='image/*' className="ui-hide"/>
                                                        <Link onClick={(e) => openDialog(e)} href="" className='link-round smd ui-absolute' style={{ backgroundColor: 'rgba(174,171,211,0.15)', top: '1rem', left: '1rem' }}>
                                                            <span className='fe fe-edit-2 onwhite fs-17'></span>
                                                        </Link>
                                                    </div>
                                                    <p className='fs-14 font-frei mrgb0 mrgt1' style={{ color: "#807EA6" }}>Recommended size is 1920 x 1080, not more than 5MB.</p>
                                                </div>

                                                <div className='col-md-6'>

                                                    <div className='pdl2'>

                                                        <div className='form-row mrgb'>
                                                            <div className='col'>
                                                                <label className='fs-13 onwhite font-freimedium mrgb'>Post Headline *</label>
                                                                <textarea
                                                                defaultValue={''}
                                                                onChange={(e) => { setPost({ ...post, headline: e.target.value }) }}
                                                                className="form-control fs-14 on-black font-frei auth-input onwhite"
                                                                placeholder="Introduce this post to concreap audience." autoComplete='off' 
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='form-row mrgb'>
                                                            <div className={`col ${blogContext.loading ? 'disabled-lt' : ''}`}>

                                                                <label className='fs-13 onwhite font-freimedium mrgb'>Add Tags</label>
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
                                                                    menuClassName={'rs-menu onblack'}
                                                                    onChange={(value)=> {
                                                                        setPost({ ...post, tags: value })
                                                                    }}
                                                                />

                                                            </div>
                                                        </div>

                                                        <div className='form-row mrgb'>

                                                            <div className={`col-6 ${blogContext.loading ? 'disabled-lt' : ''}`}>
                                                                <label className='fs-13 onwhite font-freimedium mrgb'>Catgeory *</label>
                                                                <select
                                                                onChange={(e) => { setPost({ ...post, categoryId: e.target.value }) }}
                                                                className="form-control custom-select fs-14 xl onwhite font-frei auth-input"
                                                                autoComplete='off'>
                                                                    <option value="">Select</option>
                                                                    {
                                                                        blogContext.categories.length > 0 &&
                                                                        blogContext.categories.map((c, index) => 
                                                                            <>
                                                                                <option key={index} value={c._id}>{ body.captialize(c.name) }</option>
                                                                            </>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>

                                                            <div className={`col-4 offset-1 ${blogContext.loading ? 'disabled-lt' : ''}`}>
                                                                <label className='fs-13 onwhite font-freimedium mrgb'>Bracket *</label>
                                                                <div className='d-flex align-items-center' style={{ minHeight: '50px' }}>

                                                                    {
                                                                        blogContext.brackets.length > 0 && 
                                                                        blogContext.brackets.map((b, index) => 
                                                                            <>
                                                                                <div className="custom-control custom-radio custom-control-inline">
                                                                                    <input onChange={(e) => changePostType(e, b._id)} defaultChecked={index === 0 ? true : false} type="radio" id={`barti-${index+1}`} name="post-bracket" className="custom-control-input" />
                                                                                    <label className="custom-control-label font-frei fs-13" style={{ color: '#646195' }} htmlFor={`barti-${index+1}`}>{ body.captialize(b.name) }</label>
                                                                                </div>
                                                                            </>
                                                                        )
                                                                    }

                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className='d-flex align-items-center mrgt2'>

                                                            <Link onClick={(e) => savePost(e)} href="" className={`btn md stretch bgd-yellow onwhite ml-auto ${loading ? 'disabled-lt' : ''}`}>
                                                                { loading ? <span className='cp-loader sm white'></span> : <span className='font-freibold fs-13'>Save Post</span> }
                                                            </Link>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>
                                        
                                        </>
                                    }
                                
                                </>
                            }

                            {
                                preview &&
                                <>

                                    <div className='d-flex align-items-center mrgb4'>
                                
                                        <div className='post-title'>
                                            <input 
                                            defaultValue={post.title}
                                            onChange={(e) => { setPost({ ...post, title: e.target.value }) }}
                                            className='font-frei fs-25 onwhite' type={'text'} placeholder="Type post title here"/>
                                        </div>
                                        
                                        <div className='ml-auto'>
                                            <Link onClick={(e) => { }} href="" className={`btn sm bgd-yellow onwhite stretch-md ${loading ? 'disabled-lt' : ''}`}>
                                            { loading ? <span className='cp-loader sm white'></span> : <span className='font-freibold fs-12'>Save Post</span> }
                                            </Link>
                                            <span className='pdl1'></span>
                                            <Link onClick={(e) => togglePreview(e)} href="" className='btn sm bgd-disable onwhite'>
                                                <span className='font-freimedium fs-12'>Go Back</span>
                                            </Link>
                                        </div>

                                    </div>

                                    <div className='row mrgt3 mrgb3'>

                                        <div className='col-md-8 mx-auto'>

                                            <div className='post-html onwhite' 
                                                dangerouslySetInnerHTML={{ __html: editorPreview }} 
                                            />

                                        </div>

                                    </div>
                                
                                </>
                            }

                        </form>

                    </div>

                </div>

            </section>

        </Layout>
    )
}

NewPost.getInitialProps = async (ctx: any) => {

    const { id } = ctx.query;
    return { id }
    
}

export default NewPost