import React, { useState, useEffect, useContext,useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { usePageRedirect } from '../../../../helpers/hooks'
import CampaignsList from './CampList'
import moment from 'moment'
import Toast from '../../../../components/partials/Toast';
import Axios from 'axios';
import Layout from '@/components/layouts/Dashboard';
import { Editor } from '@tinymce/tinymce-react';
import body from '../../../../helpers/body'
import storage from '../../../../helpers/storage'
import BlogContext from '@/context/blog/blogContext'
import { IBlogContext, ICampaignSection } from '@/utils/types'
import { NextPage } from 'next'

const EditCampaign: NextPage<any> = ({ id }: any) => {

    const navigate = useRouter()

    const blogContext = useContext<IBlogContext>(BlogContext)

    const gen = body.generate(6,true);
    let editorRef = useRef<any>(null)
    const coverRef = useRef<any>(null)

    const [campaign, setCampaign] = useState({
        title: "", 
        headline: "", 
        description: "", 
        callback: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/campaigns/v`
    })
    const [preview, setPreview] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [active, setActive] = useState<string>(gen.toString())

    const dcontent = `<p className='font-frei mrgb0 fs-14'>The times we live in are super exciting, even more so if you are interested in 3D stuff. 
    We have the ability to use any camera, capture some image data from objects of interest, 
    and turn them into 3D assets in the blink of an eye! This 3D Reconstruction Process through 
    a simple Data Acquisition phase is a game-changer for many industries.</>`;

    const [item, setItem] = useState<ICampaignSection>({
        label: gen.toString(),
        caption: 'Happy Friday - TGIF 🧀',
        thumbnail: '',
        body: '',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/v`,
        color: 'default',
        footnote: 'Let\'s dive in. Scroll down 👇🏽',
        ePreview: dcontent,
        eValue: '',
        eRef: editorRef
    })
    const [ePreview, setEPreview] = useState<Array<{ label: string, v: any, nv: any }>>([])

    const [toast, setToast] = useState({
        type: '',
        show: false,
        message: '',
        title: '',
        position: 'top-right'
    });

    useEffect(() => {

        blogContext.getCampaign(id);
        setActive( storage.fetchLegacy('acs') )

    }, [])

    // redirect based on user-type
    usePageRedirect(['superadmin', 'admin'])

    const updateEditorValue = (newVal:any, editor: any, label: string) => {

        const hm = editor.getContent({ format: 'html' });

        let currList: Array<any> = blogContext.sections;
        const stn = currList.find((x) => x.label === label);
        const stnx = currList.findIndex((x) => x.label === label);

        if(stn && stnx >= 0){
            stn.ePreview = hm;
            stn.body = newVal;

            currList.splice(stnx, 1, stn);
            blogContext.setSections(currList)
        }

    }

    const browseFile = (e:any, label: string) => {
        
        if (e.target.files && e.target.files[0]) {
    
            if (e.target.files[0].size > 5000000) {

                setToast({ ...toast, show: true, title: 'Error', type: 'error', message: 'File cannot be more than 5MB in size', position: 'top-right'})
                setTimeout(() => {
                    setToast({ ...toast, show: false })
                }, 2500)

            }

            // check for file dimension here
            getFileSource(e.target.files[0], label);
            
        }
    }

    const getFileSource = (file: any, label: string) => {
    
        let reader = new FileReader();
        reader.onloadend = (e: any) => {
            onValueChange(e.target.result, label, 'thumb')
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

    const setActiveItem = (e: any, stn: ICampaignSection) => {

        if(e) { e.preventDefault() }

        if(active === stn.label){
            setActive('')
        }else{

            setTimeout(() => {

                setActive(stn.label);

                let currList = blogContext.sections;

                const st = currList.find((x) => x.label === stn.label)
                const stx = currList.findIndex((x) => x.label === stn.label);

                if(st && stx >= 0){
                    
                    const ep = ePreview.find((x) => x.label === stn.label && x.v !== '')
                    st.ePreview = ep ? ep.v : st.body;

                    currList.splice(stx, 1,st);
                    blogContext.setSections(currList)
                }

            }, 100)

        }
        
    }

    const addItem = (e: any) => {

        if(e) { e.preventDefault() }

        let currList: Array<any> = blogContext.sections;
        let gn = body.generate(6, true);
        let itm: ICampaignSection = {
            label: gn.toString(),
            caption: `New Section - ${gn.toString()}`,
            thumbnail: '',
            body: '',
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/v`,
            color: 'default',
            footnote: 'Let\'s dive in. Scroll down 👇🏽',
            ePreview: dcontent,
            eValue: '',
            eRef: editorRef
        }

        currList.push(itm);
        blogContext.setSections(currList);

    }

    const removeItem = (e: any, label: string) => {

        if(e) { e.preventDefault() }

        const found = checkItem(label);

        if(found){
            detachSection(e, label);
        }else{

            let currList: Array<any> = blogContext.sections;
            const itm = currList.find((x) => x.label === label);

            if(itm){
                const filtered = currList.filter((x) => x.label !== itm.label);
                setActive('')
                blogContext.setSections(filtered)
            }

        }

    }

    const checkActive = (): boolean => {

        let flag: boolean = false;

        if(blogContext.sections.length > 0 && active){
            blogContext.sections.forEach((x) => {
                if(x.label === active){
                    flag = true;
                }
            })
        }

        return flag

    }

    const checkItem = (label: string): boolean => {

        let flag: boolean = false;

        const cpm = label.substring(0,3);
        flag = cpm === 'CPM' ? true : false;

        return flag

    }

    const togglePreview = (e: any) => {
        if(e) { e.preventDefault() }

        if(preview === true){
            setPreview(false)
        }else{

            setTimeout(() => {

                setPreview(true)
    
                let currList = blogContext.sections;
    
                currList.forEach((sc) => {
                    const ep = ePreview.find((x) => x.label === sc.label && x.v !== '')
                    sc.ePreview = ep ? ep.v : sc.body;
                });
    
                blogContext.setSections(currList)
    
            }, 100)

        }
    }

    const onValueChange = (e: any, label: string, t: string) => {

        let currList: Array<any> = blogContext.sections;
        const stn = currList.find((x) => x.label === label);
        const stnx = currList.findIndex((x) => x.label === label);

        if(stn && stnx >= 0){

            if(t === 'caption'){
                stn.caption = e.target.value;
            }
            if(t === 'url'){
                stn.url = e.target.value;
            }
            if(t === 'color'){
                stn.color = stn.color === e ? '' : e;
            }
            if(t === 'footnote'){
                stn.footnote = e.target.value;
            }

            if(t === 'thumb'){
                stn.thumbnail = e;
            }

            currList.splice(stnx, 1, stn);
            blogContext.setSections(currList);

        }

    }

    const detachSection = async (e: any, label: string) => {

        if(e){ e.preventDefault(); }

        blogContext.setLoading()

        await Axios.put(`${process.env.NEXT_PUBLIC_BLOG_URL}/campaigns/detach/${blogContext.campaign._id}`, { label: label }, storage.getConfigWithBearer())
        .then(async (resp) => {

            if(resp.data.error === false && resp.data.status === 200){

                if(id){
                    blogContext.setSections([])
                    await blogContext.getCampaign(id);
                    blogContext.unsetLoading();
                }
            }


        }).catch((err) => {

            if (err.response.data.errors && err.response.data.errors.length > 0) {

                setToast({ ...toast, show: true, title: 'Error', type: 'error', message: err.response.data.errors[0], position: 'top-right'})
                setTimeout(() => {
                    setToast({ ...toast, show: false })
                }, 2500)

            } else {

                setToast({ ...toast, show: true, title: 'Error', type: 'error', message: err.response.data.message, position: 'top-right'})
                setTimeout(() => {
                    setToast({ ...toast, show: false })
                }, 2500)

            }

            blogContext.unsetLoading();
            
        })

    }

    const submit = async (e: any) => {

        if(e) { e.preventDefault() }

        let stnList = blogContext.sections.map((x) => {

            const fd = ePreview.find((z) => z.label === x.label)

            let itm = {
                label: x.label,
                caption: x.caption,
                thumbnail: x.thumbnail,
                body: fd ? fd.nv : '',
                url: x.url,
                footnote: x.footnote,
                color: x.color,
            }

            return itm;

        })
        
        const data = {
            title: campaign.title,
            headline: campaign.headline,
            description: campaign.description,
            callback: campaign.callback,
            sections: stnList
        }

        setLoading(true)

        await Axios.put(`${process.env.NEXT_PUBLIC_BLOG_URL}/campaigns/${id}`, { ...data } , storage.getConfigWithBearer())
        .then((resp) => {

            if(resp.data.error === false && resp.data.status === 200){
                navigate.push('/dashboard/blog/campaigns')
            }

            setLoading(false);

        }).catch((err) => {

            if (err.response.data.errors && err.response.data.errors.length > 0) {

                setToast({ ...toast, show: true, title: 'Error', type: 'error', message: err.response.data.errors[0], position: 'top-right'})
                setTimeout(() => {
                    setToast({ ...toast, show: false })
                }, 2500)

            } else {

                setToast({ ...toast, show: true, title: 'Error', type: 'error', message: err.response.data.message, position: 'top-right'})
                setTimeout(() => {
                    setToast({ ...toast, show: false })
                }, 2500)

            }

            setLoading(false);
            
        })

    }

    return (
        <Layout pageTitle='Campaign Details' showBack={true} collapsed={false}>

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
                            !blogContext.loading && !body.isObjectEmpty(blogContext.campaign) &&
                            <>
                                <div className='d-flex align-items-center'>

                                    <form className='card-search' onSubmit={(e) => { e.preventDefault(); }}>
                                        <div className='card-input lg no-btn'>
                                            <input 
                                            defaultValue={ blogContext.campaign.title }
                                            onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
                                            className={`font-frei fs-15`} type={'text'} placeholder="Campaign title" />
                                        </div>
                                    </form>
                                    <div className='ml-auto'>
                                        <Link onClick={(e) => togglePreview(e)} href="" className={`btn sm bgd-disable onwhite ${loading ? 'disabled-lt' : ''}`}>
                                            <span className='font-freimedium fs-12' style={{ paddingRight: '0' }}>{ preview ? 'Back' : 'Preview' }</span>
                                        </Link>
                                        <span className='pdl'></span>
                                        <Link onClick={(e) => submit(e)} href="" className={`btn sm bgd-yellow onwhite ${loading ? 'disabled-lt' : ''}`}>
                                            { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-12' style={{ paddingRight: '0' }}>Save</span> }
                                        </Link>
                                    </div>

                                </div>
                            </>
                        }

                    </div>

                </div>

            </section>

            {
                !blogContext.loading && !body.isObjectEmpty(blogContext.campaign) &&
                <>

                    <div className='ui-separate-small'></div>
             
                    <section className='section'>

                        {
                            !preview &&
                            <>

                                <form className='form' onSubmit={(e) => ( e.preventDefault() )}>

                                    <div className='row no-gutters'>

                                        <div className='col-md-5'>

                                            <div className='section-list'>

                                                <div className='form-group mrgb0'>
                                                    <label className='onwhite font-frei fs-13 mrgb0'>Headline</label>
                                                    <input
                                                    defaultValue={blogContext.campaign.headline}
                                                    onChange={(e) => setCampaign({ ...campaign, headline: e.target.value })}
                                                    className='form-control lg font-freilight onwhite fs-13 bg-brand-nblue'
                                                    type="text" autoComplete='off' placeholder='Type here'
                                                    />
                                                </div>

                                                <div className='form-group mrgb1'>
                                                    <label className='onwhite font-frei fs-13 mrgb0'>Description</label>
                                                    <textarea
                                                    defaultValue={ blogContext.campaign.description }
                                                    onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
                                                    className="form-control fs-13 onwhite font-frei bg-brand-nblue"
                                                    placeholder="Type here" autoComplete='off'
                                                    />
                                                </div>

                                                <div className='ui-line mrgt1 mrgb1' style={{ backgroundColor: '#1b1943' }}></div>

                                                <h3 className='font-frei onwhite mrgb2 fs-13'>Campaign sections</h3>

                                                {
                                                    blogContext.sections.length > 0 &&
                                                    blogContext.sections.map((stn: any, index: number) =>
                                                    <>

                                                        <div  
                                                        onClick={(e) => setActiveItem(e, stn)}
                                                        key={stn.label} 
                                                        className={`section-item ${active === stn.label ? 'active' : ''}`}>

                                                            <h3 className='mrgb0'>
                                                                <span className='onwhite fs-17 font-freimedium'>{index + 1} &#8212; </span>
                                                                <span className='onwhite fs-17 font-freimedium'>{ stn.label }</span>
                                                            </h3>

                                                            {
                                                                blogContext.sections.length > 1 && active !== stn.label &&
                                                                <Link onClick={(e) => removeItem(e, stn.label)} href="" 
                                                                className='link-round sm ml-auto ui-absolute' 
                                                                style={{ backgroundColor: "#1d1b48", right: '1.1rem', zIndex: 2 }}>
                                                                    <span className='cp-icon cp-bin reverse'>
                                                                        <i className='path1 fs-16'></i>
                                                                        <i className='path2 fs-16'></i>
                                                                    </span>
                                                                </Link>
                                                            }

                                                        </div>
                                                    
                                                    </>
                                                    )
                                                }

                                                <div className='ui-line mrgt1 mrgb1' style={{ backgroundColor: '#1b1943' }}></div>

                                                <div className='d-flex align-items-center'>

                                                    <span className='font-frei fs-12 mrgb0 onwhite'>Preview & Add section</span>

                                                    <div className='ml-auto ui-group-button'>

                                                        <Link onClick={(e) => togglePreview(e)} href="" className=''>
                                                            <span className='cp-icon cp-eye'>
                                                                <i className='path1 fs-16'></i>
                                                                <i className='path2 fs-16'></i>
                                                            </span>
                                                        </Link>

                                                        <Link onClick={(e) => addItem(e)} href="" className='link-round sm ml-auto bgd-disable'>
                                                            <span className='fe fe-plus fs-16 onwhite'></span>
                                                        </Link>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                        <div className='col-md-7'>

                                            <div className=''>

                                                <div className='campaign-wrapper pdt2 pdb1'>

                                                    <div className='wrapper-inner'>

                                                        {
                                                            active !== '' && blogContext.sections.length > 0 &&
                                                            blogContext.sections.map((stn, index) => 
                                                            <>

                                                                {
                                                                    stn && (stn.label === active) &&
                                                                    <>
                                                                        <div key={stn.label} className={`camp-box ${stn.color}`}>

                                                                            <span className='font-freimedium fs-13 mrgb0' style={{ color: "#303B4F" }}>You're editing &#8212; { stn.label }</span>

                                                                            <div className={`box-inner form`}>

                                                                                <div className='form-group mrgb1 ui-line-height'>
                                                                                    <span className='font-frei fs-12 mrgb0' style={{ color: "#303B4F" }}>Type header below</span>
                                                                                    <input 
                                                                                        type="text" className='form-control fs-16 font-freimedium' style={{ color: "#303B4F"}} 
                                                                                        defaultValue={stn.caption}
                                                                                        onChange={(e) => onValueChange(e, stn.label, 'caption')}
                                                                                    />
                                                                                </div>

                                                                                <span className='font-frei fs-12 mrgb0' style={{ color: "#303B4F" }}>Change thumbnail</span>
                                                                                <div 
                                                                                className='camp-thumb lg ui-relative' 
                                                                                style={{ backgroundImage: `url("${stn.thumbnail ? stn.thumbnail : 'https://storage.googleapis.com/concreap-buckets/blog-post-01.jpg'}")` }}>
                                                                                    <input onChange={(e) => browseFile(e, stn.label)} ref={coverRef} type="file" accept='image/*' className="ui-hide"/>
                                                                                    <Link onClick={(e) => openDialog(e)} href="" className='link-round smd ui-absolute' style={{ backgroundColor: '#26265fc2', top: '1rem', right: '1rem' }}>
                                                                                        <span className='fe fe-edit-2 onwhite fs-17'></span>
                                                                                    </Link>
                                                                                </div>

                                                                                <div className='camp-html'>

                                                                                    <Editor
                                                                                        apiKey='c7331qpwutp9ejpt8lkf4me5vao63q9bg83a54h4pz0obthe'
                                                                                        onInit={(evt, editor) => editorRef.current = editor}
                                                                                        initialValue={ stn.ePreview ? stn.ePreview : stn.body }
                                                                                        onEditorChange={(newVal: any, editor: any) => {

                                                                                            const hm = editor.getContent({ format: 'html' });

                                                                                            let currList: Array<{ label: string, v: any, nv: any }> = ePreview;
                                                                                            const st = currList.find((x) => x.label === stn.label);
                                                                                            const stx = currList.findIndex((x) => x.label === stn.label);

                                                                                            if(st && stx >= 0){
                                                                                                st.v = hm;
                                                                                                st.nv = newVal;

                                                                                                currList.splice(stx, 1, st);
                                                                                            }else{

                                                                                                currList.push({
                                                                                                    label: stn.label,
                                                                                                    v: hm,
                                                                                                    nv: newVal
                                                                                                })

                                                                                            }

                                                                                            setEPreview(currList)
                                                                                            

                                                                                        }}
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
                                                                                            content_style: `.mce-content-body { color: #303B4F !important; }` + `body { font-size: 14px; }`
                                                                                        }}
                                                                                    />



                                                                                </div>

                                                                                <div className='mrgt2 d-flex align-items-center'>

                                                                                    <a href={stn.url} target="_blank" className='btn smd bgd-yellow stretch onwhite'>
                                                                                        <span className='font-freimedium fs-14'>Read More</span>
                                                                                    </a>

                                                                                    <div className='form-group mrgb0 ml-auto ui-line-height'>
                                                                                        <input 
                                                                                            type="text" className='form-control fs-13 font-frei btn-input' style={{ color: "#303B4F" }} 
                                                                                            defaultValue={stn.url} placeholder="Button URL"
                                                                                            onChange={(e) => onValueChange(e, stn.label, 'url')}
                                                                                        />
                                                                                    </div>

                                                                                </div>

                                                                                <div className='mrgt2'>

                                                                                    <div className='form-row mrgb0'>

                                                                                        <div className='col-7 ui-line-height'>
                                                                                            <span className='font-frei fs-12 mrgb0' style={{ color: "#303B4F" }}>Footnote</span>
                                                                                            <input 
                                                                                                type="text" className='form-control fs-13 font-frei' style={{ color: "#303B4F" }} 
                                                                                                defaultValue={stn.footnote} placeholder="Footnote"
                                                                                                onChange={(e) => onValueChange(e, stn.label, 'footnote')}
                                                                                            />
                                                                                        </div>

                                                                                        <div className='col-4 offset-1 ui-line-height'>
                                                                                            <span className='font-frei fs-12 mrgb0' style={{ color: "#303B4F" }}>Section color</span>
                                                                                            <div className='color-list mrgt'>
                                                                                                <Link 
                                                                                                onClick={(e) => onValueChange('blue-line', stn.label, 'color')} href="" 
                                                                                                className={`link-round sm stn-color blue-line ${stn.color === 'blue-line' ? 'active' : ''}`}>
                                                                                                </Link>
                                                                                                <Link 
                                                                                                onClick={(e) => onValueChange('purple-line', stn.label, 'color')} href="" 
                                                                                                className={`link-round sm stn-color purple-line ${stn.color === 'purple-line' ? 'active' : ''}`}>
                                                                                                </Link>
                                                                                                <Link 
                                                                                                onClick={(e) => onValueChange('yellow-line', stn.label, 'color')} href="" 
                                                                                                className={`link-round sm stn-color yellow-line ${stn.color === 'yellow-line' ? 'active' : ''}`}>
                                                                                                </Link>
                                                                                                <Link 
                                                                                                onClick={(e) => onValueChange('pink-line', stn.label, 'color')} href="" 
                                                                                                className={`link-round sm stn-color pink-line ${stn.color === 'pink-line' ? 'active' : ''}`}>
                                                                                                </Link>
                                                                                            </div>
                                                                                        </div>

                                                                                    </div>

                                                                                </div>

                                                                            </div>

                                                                            <div className='box-divider'></div>

                                                                        </div>
                                                                    </>
                                                                }

                                                            </>
                                                            )
                                                        }

                                                        {
                                                            checkActive() === false && (blogContext.sections.length > 0 || blogContext.sections.length <= 0) &&
                                                            <div className='camp-box'>

                                                                <div className='box-inner'>

                                                                    <h2 className='fs-16 font-freibold'>{ 'No section selected 😕' }</h2>

                                                                    <div className='camp-thumb empty'>
                                                                        <span className='cp-icon cp-error grad fs-45'></span>
                                                                    </div>

                                                                    <p className='font-frei fs-15 brand-black mrgb0'>Select a section from the list of sections by the left.</p>

                                                                    <div className='ui-group-button mrgt2'>

                                                                        <a href={item.url} target="_blank" className='btn md bgd-yellow stretch onwhite'>
                                                                            <span className='font-freimedium fs-14'>Read More</span>
                                                                        </a>

                                                                    </div>

                                                                    <div className='ui-group-button mrgt2 ui-text-center'>

                                                                        <span className='fs-12 font-frelight mrgb0'>
                                                                            Footnote appears here
                                                                        </span>

                                                                    </div>

                                                                </div>

                                                                <div className='box-divider'></div>

                                                            </div>
                                                        }

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </form>
                            
                            </>
                        }

                        {
                            preview &&
                            <>

                                <div className='row no-gutters'>

                                    <div className='col-md-7 mx-auto'>

                                        <div className='pdl1 pdr1'>

                                            <div className='campaign-wrapper dark'>

                                                <Link onClick={(e) => togglePreview(e)} href="" className='link-round sm bgd-disable'>
                                                    <span className='fe fe-chevron-left fs-15 onwhite'></span>
                                                </Link>
                                                <span className='font-freimedium fs-14 onwhite ui-relative pdl' style={{ top: '-1px' }}>Back</span>

                                                <div className='mrgb2'></div>

                                                <div className='wrapper-inner'>

                                                    <div className='camp-head'>
                                                        <img src="../../../images/assets/logo-full.svg" alt='concreap-logo' />
                                                    </div>

                                                    <div className='camp-date'>
                                                        <span className='fs-17 font-frei ui-upcase'>{ moment(Date.now()).format("Do MMMM, YYYY") }</span>
                                                    </div>

                                                    {
                                                       blogContext.sections.length > 0 &&
                                                       blogContext.sections.map((stn, index) => 
                                                        
                                                            <>
                                                            
                                                                <div key={stn.label} className={`camp-box ${stn.color}`}>

                                                                    <div className={`box-inner`}>

                                                                        <h2 className='fs-16 font-freibold'>{ stn.caption }</h2>

                                                                        <div className='camp-thumb lg' style={{ backgroundImage: `url("${stn.thumbnail ? stn.thumbnail : 'https://storage.googleapis.com/concreap-buckets/blog-post-01.jpg'}")` }}></div>

                                                                        <div className='camp-html'
                                                                        dangerouslySetInnerHTML={{ __html: stn.ePreview ? stn.ePreview : stn.marked }} ></div>

                                                                        <div className='ui-group-button mrgt2'>

                                                                            <a href={stn.url} target="_blank" className='btn md bgd-yellow stretch onwhite'>
                                                                                <span className='font-freimedium fs-14'>Read More</span>
                                                                            </a>

                                                                        </div>

                                                                        <div className='ui-group-button mrgt2 ui-text-center'>

                                                                            <span className='fs-12 font-frelight mrgb0'>
                                                                                { stn.footnote }
                                                                            </span>

                                                                        </div>

                                                                    </div>

                                                                    <div className='box-divider'></div>

                                                                </div>
                                                            
                                                            </>
                                                        
                                                        )
                                                    }

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            
                            </>
                        }

                    </section>
                
                </>
            }


        </Layout>
    )
}

EditCampaign.getInitialProps = async (ctx: any) => {

    const id = ctx.query.id as string;
    return { id }

}

export default EditCampaign