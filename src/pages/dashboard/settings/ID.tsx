import React, {useState, useEffect, useContext, useRef} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IVerificationProps } from '../../../utils/types'

import Axios from 'axios'
import storage from '../../../helpers/storage'

import Toast from '../../../components/partials/Toast'
import UserContext from '@/context/user/userContext'


const ID = ({ status, userId }: Partial<IVerificationProps>) => {

    const frontLink = useRef(null);
    const backLink = useRef(null);

    const userContext = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [frontName, setFrontName] = useState('')
    const [backName, setBackName] = useState('')
    const [front, setFront] = useState('')
    const [back, setBack] = useState('')
    const [step, setStep] = useState(0)
    const [option, setOption] = useState('id');
    const [basic, setBasic] = useState({
        firstName: '', 
		lastName: '', 
		middleName: '', 
		dob: '', 
		gender: '', 
		age: 0
    })

    const [toast, setToast] = useState({
        type: 'success',
        show: false,
        message: '',
        title: '',
        position: 'top-right'
    })

    useEffect(() => {
        Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        setStep(0)
    }, [])

    const openDialog = async (e: any) => {
        e.preventDefault();
        // frontLink.current.click();
    }

    const openBackDialog = async (e: any) => {
        e.preventDefault();
        // backLink.current.click();
    }

    const browseFile = (e: any, type: string) => {
        
        if (e.target.files && e.target.files[0]) {

            if (e.target.files[0].size > 5000000) {

                setToast({...toast, type: "error", show:true, title: 'Error', message:'file cannot be more than 5MB in size', position: 'top-right'})
                setTimeout(()=> {
                    setToast({...toast, show:false});
                }, 5000)

            }else{

                if(type === 'front'){
                    setFrontName(e.target.files[0].name)
                }
                if(type === 'back'){
                    setBackName(e.target.files[0].name)
                }

                getFileSource(e.target.files[0], type);

            }
            
        }
    }

    const getFileSource = (file: any, type: string) => {
    
        let reader = new FileReader();
        reader.onload = (e: any) => {

            if(type === 'front'){
                setFront(e.target.result);
            }

            if(type === 'back'){
                setBack(e.target.result);
            }
            
        };

        reader.readAsDataURL(file);
      
    }

    const toggleToast = (e: any) => {
        if(e) e.preventDefault();
        setToast({ ...toast, show: !toast.show });
    }
    const selectOption = (e: any, val: any) => {
        if(e) { e.preventDefault() }
        setOption(val);
    }

    const next = (e: any) => {
        if(e) { e.preventDefault() }
        setStep(step + 1);
    }

    const prev = (e: any) => {
        if(e) { e.preventDefault() }
        setStep(step - 1);
    }

    const submit = async (e: any) => {

        if(e) { e.preventDefault() }

        if(!front && !back && (option === 'id' || option === 'license')){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'all fields are required', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else if(!front){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'select front image', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else if(!back && (option === 'id' || option === 'license')){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'select back image', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else{

            const data = {
                front: front,
                back: back,
                type: option === 'pass' ? 'passport' : option === 'id' ? 'card' : option === 'license' ? 'license' : option 
            }

            setLoading(true);

            await Axios.put(`${process.env.NEXT_PUBLIC_AUTH_URL}/users/kyc/update-id/${userId}`, {...data}, storage.getConfigWithBearer())
            .then((resp) => {

                if(resp.data.error === false && resp.data.status === 200){

                    setToast({...toast, type: "success", show:true, title: 'Success', message:'details saved successfully', position: 'top-right'})
                    setTimeout(()=> {
                        setToast({...toast, show:false});
                    }, 5000);

                    userContext.getUser(userId);

                }

                setLoading(false)
        
            }).catch((err) => {
        
                if(err.response.data.errors && err.response.data.errors.length > 0){

                    setToast({...toast, type: "error", show:true, title: 'Error', message:err.response.data.errors[0], position: 'top-right'})
                    setTimeout(()=> {
                        setToast({...toast, show:false});
                    }, 5000)

                }else{

                    setToast({...toast, type: "error", show:true, title: 'Error', message:err.response.data.message, position: 'top-right'})
                    setTimeout(()=> {
                        setToast({...toast, show:false});
                    }, 5000)
                }

                setLoading(false);
        
            })

        }

    }

    return (
        <>

            <Toast 
            show={toast.show} 
            title={toast.title} 
            message={toast.message} 
            position={toast.position}
            type={toast.type}
            close={toggleToast} />

            <div className='d-flex align-items-center mrgt'>
                <div className='ui-line-height'>
                    <h1 className='mrgb0 d-flex align-items-center'>
                        <span className='font-mattermedium brandxp-purple fs-16 ui-relative' style={{ top: '-2px' }}>{ status === 'pending' ? 'Verify your ID' : 'Waiting for approval' }</span> 
                    </h1>
                    {/* <p className='font-matterlight brandxp-neutral fs-14 mrgb0'>Details like name, and more.</p> */}
                </div>
                <span className='custom-badge bg-brandxp-lplight brandxp-purple fs-13 font-matterregular ml-auto'>{ status }</span>
            </div>

            <div className='ui-line bg-silverlight'></div>

            {
                status === 'pending' && 
                <>
                
                    <form className='form verify-form' onSubmit={(e) => { e.preventDefault() }}>

                        {
                            step === 0 &&
                            <>
                            
                                <p className='font-matterlight brandxp-neutral fs-14 mrgb1'>Choose your preferred ID verification and upload</p>

                                <div className='row mrgt2 mrgb2'>

                                    <div className='col-md-4'>

                                        <Link onClick={(e) => selectOption(e, 'id')} href="" className={`doc-box option ${ option === 'id' ? 'active' : '' }`}>

                                            {
                                                option === 'id' && <span className='ui-absolute link-round mini bg-brandxp-orange' style={{ right: '1rem', top: '0.8rem' }}><span className='fe fe-check fs-13 onwhite'></span></span>
                                            }

                                            <img src='../../../images/icons/idcard.svg' alt="icon" />
                                            <p className='font-matterregular brandxp-dark fs-14 mrgb0'>ID Card</p>

                                        </Link>

                                    </div>

                                    <div className='col-md-4'>

                                        <Link onClick={(e) => selectOption(e, 'pass')} href="" className={`doc-box option ${ option === 'pass' ? 'active' : '' }`}>

                                            {
                                                option === 'pass' && <span className='ui-absolute link-round mini bg-brandxp-orange' style={{ right: '1rem', top: '0.8rem' }}><span className='fe fe-check fs-13 onwhite'></span></span>
                                            }

                                            <img src='../../../images/icons/passp.svg' alt="icon" />
                                            <p className='font-matterregular brandxp-dark fs-14 mrgb0'>Passport</p>

                                        </Link>

                                    </div>
                                    <div className='col-md-4'>

                                        <Link onClick={(e) => selectOption(e, 'license')} href="" className={`doc-box option ${ option === 'license' ? 'active' : '' }`}>

                                            {
                                                option === 'license' && <span className='ui-absolute link-round mini bg-brandxp-orange' style={{ right: '1rem', top: '0.8rem' }}><span className='fe fe-check fs-13 onwhite'></span></span>
                                            }

                                            <img src='../../../images/icons/license.svg' alt="icon" />
                                            <p className='font-matterregular brandxp-dark fs-14 mrgb0'>Driver's license</p>

                                        </Link>

                                    </div>

                                </div>

                                <div className='ui-line bg-silverlight'></div>

                                <div className='d-flex align-items-center mrgt2 mrgb1'>
                                    <Link onClick={(e) => next(e)} href="" className={`btn md stretch-md bg-brandxp-orange font-mattermedium ml-auto onwhite`}>
                                        Continue
                                    </Link>
                                </div>
                            
                            </>
                        }

                        {
                            step === 1 &&
                            <>
                                <p className='font-matterlight brandxp-neutral fs-14 mrgb1'>click to upload the required files. Size should not be more than 2MB.</p>

                                {
                                    option === 'id' &&
                                    <>
                                    
                                        <div className='row mrgt2 mrgb2'>

                                            <div className='col-md-6'>

                                                <input onChange={(e) => browseFile(e, 'front')} ref={frontLink} type="file" accept='image/*' className="form-control ui-hide fs-14 mm  on-black font-matterregular"  />

                                                <Link onClick={(e) => openDialog(e)} href="" className={`doc-box option ${ front !== '' ? 'selected' : '' }`}>

                                                    {
                                                        front !== '' && <span className='ui-absolute link-round mini bg-apple' style={{ right: '1rem', top: '0.8rem' }}><span className='fe fe-check fs-13 onwhite'></span></span>
                                                    }

                                                    <img src={`${ front ? front : '../../../images/icons/idfront.svg' }`} width={front ? '90px' : ''} alt="icon" />
                                                    <p className={`font-matterregular brandxp-dark fs-13 mrgb0 ${front ? 'text-elipsis md' : ''}`}>{ frontName ? frontName : 'Browse front' }</p>

                                                </Link>

                                            </div>

                                            <div className='col-md-6'>

                                                <input onChange={(e) => browseFile(e, 'back')} ref={backLink} type="file" accept='image/*' className="form-control ui-hide fs-14 mm  on-black font-matterregular"  />

                                                <Link onClick={(e) => openBackDialog(e)} href="" className={`doc-box option ${ back !== '' ? 'selected' : '' }`}>

                                                    {
                                                        back !== '' && <span className='ui-absolute link-round mini bg-apple' style={{ right: '1rem', top: '0.8rem' }}><span className='fe fe-check fs-13 onwhite'></span></span>
                                                    }

                                                    <img src={`${ back ? back : '../../../images/icons/idfront.svg' }`} width={back ? '90px' : ''} alt="icon" />
                                                    <p className={`font-matterregular brandxp-dark fs-13 mrgb0 ${back ? 'text-elipsis md' : ''}`}>{ backName ? backName : 'Browse back' }</p>

                                                </Link>

                                            </div>

                                        </div>
                                    
                                    </>
                                }

                                {
                                    option === 'pass' &&
                                    <>
                                    
                                        <div className='row mrgt2 mrgb2'>

                                            <div className='col-md-6'>

                                                <input onChange={(e) => browseFile(e, 'front')} ref={frontLink} type="file" accept='image/*' className="form-control ui-hide fs-14 mm  on-black font-matterregular"  />

                                                <Link onClick={(e) => openDialog(e)} href="" className={`doc-box option ${ front !== '' ? 'selected' : '' }`}>

                                                    {
                                                        front !== '' && <span className='ui-absolute link-round mini bg-apple' style={{ right: '1rem', top: '0.8rem' }}><span className='fe fe-check fs-13 onwhite'></span></span>
                                                    }

                                                    <img src={`${ front ? front : '../../../images/icons/passpfront.svg' }`} width={front ? '90px' : ''} alt="icon" />
                                                    <p className={`font-matterregular brandxp-dark fs-13 mrgb0 ${front ? 'text-elipsis md' : ''}`}>{ frontName ? frontName : 'Browse file' }</p>

                                                </Link>

                                            </div>

                                        </div>
                                    
                                    </>
                                }

                                {
                                    option === 'license' &&
                                    <>
                                    
                                        <div className='row mrgt2 mrgb2'>

                                            <div className='col-md-6'>

                                                <input onChange={(e) => browseFile(e, 'front')} ref={frontLink} type="file" accept='image/*' className="form-control ui-hide fs-14 mm  on-black font-matterregular"  />

                                                <Link onClick={(e) => openDialog(e)} href="" className={`doc-box option ${ front !== '' ? 'selected' : '' }`}>

                                                    {
                                                        front !== '' && <span className='ui-absolute link-round mini bg-apple' style={{ right: '1rem', top: '0.8rem' }}><span className='fe fe-check fs-13 onwhite'></span></span>
                                                    }

                                                    <img src={`${ front ? front : '../../../images/icons/docfront.svg' }`} width={front ? '90px' : ''} alt="icon" />
                                                    <p className={`font-matterregular brandxp-dark fs-13 mrgb0 ${front ? 'text-elipsis md' : ''}`}>{ frontName ? frontName : 'Browse front' }</p>

                                                </Link>

                                            </div>

                                            <div className='col-md-6'>

                                                <input onChange={(e) => browseFile(e, 'back')} ref={backLink} type="file" accept='image/*' className="form-control ui-hide fs-14 mm  on-black font-matterregular"  />

                                                <Link onClick={(e) => openBackDialog(e)} href="" className={`doc-box option ${ back !== '' ? 'selected' : '' }`}>

                                                    {
                                                        back !== '' && <span className='ui-absolute link-round mini bg-apple' style={{ right: '1rem', top: '0.8rem' }}><span className='fe fe-check fs-13 onwhite'></span></span>
                                                    }

                                                    <img src={`${ back ? back : '../../../images/icons/docback.svg' }`} width={back ? '90px' : ''} alt="icon" />
                                                    <p className={`font-matterregular brandxp-dark fs-13 mrgb0 ${back ? 'text-elipsis md' : ''}`}>{ backName ? backName : 'Browse back' }</p>

                                                </Link>

                                            </div>

                                        </div>
                                    
                                    </>
                                }

                                <div className='ui-line bg-silverlight'></div>

                                <div className='d-flex align-items-center mrgt2 mrgb1'>
                                    <Link onClick={(e) => prev(e)} href="" className={`link-round smd bg-brandxp-lp brandxp-dark`}>
                                        <span className='fe fe-chevron-left'></span>
                                    </Link>
                                    <Link onClick={(e) => submit(e)} href="" className={`btn md stretch-md bg-brandxp-orange ${loading ? 'disabled-lt' : ''} font-mattermedium ml-auto onwhite`}>
                                        { loading ? <span className='xp-loader sm white'></span> : 'Submit' }
                                    </Link>
                                </div>
                            </>
                        }

                    </form>
                
                </>
            }

            {
                status === 'submitted' && userContext.user.kyc && userContext.user.kyc.idData && userContext.user.kyc.idType &&
                <>

                    <div className='mrgb1 ui-line-height'>
                        <span className='font-matterlight brandxp-neutral fs-14'>Your ID verification is awaiting approval. contact </span>
                        <span className='font-matterregular brandxp-orange fs-14'>support@xpresschain.co</span>
                        <span className='font-matterlight brandxp-neutral fs-14'> to speed up approval. This should normally take 24 hours</span>
                    </div>

                    <div className='row mrgt2 mrgb2 disabled-lt'>

                        {
                            (userContext.user.kyc.idType === 'card' || userContext.user.kyc.idType === 'license') &&
                            <>
                                <div className='col-md-6'>
                                    <div className='doc-box option selected'>
                                        <span className='ui-absolute link-round mini bg-apple' style={{ right: '1rem', top: '0.8rem' }}><span className='fe fe-check fs-13 onwhite'></span></span>
                                        <img src={userContext.user.kyc.idData.front} width={'90px'} alt="icon" />
                                        <p className={`font-matterregular brandxp-dark fs-13 mrgb0 `}>
                                            { userContext.user.kyc.idType === 'license' ? 'Front License' : 'Front ID'}
                                        </p>
                                    </div>
                                </div>

                                <div className='col-md-6'>
                                    <div className='doc-box option selected'>
                                        <span className='ui-absolute link-round mini bg-apple' style={{ right: '1rem', top: '0.8rem' }}><span className='fe fe-check fs-13 onwhite'></span></span>
                                        <img src={userContext.user.kyc.idData.back} width={'90px'} alt="icon" />
                                        <p className={`font-matterregular brandxp-dark fs-13 mrgb0 `}>
                                            { userContext.user.kyc.idType === 'card' ? 'Back License' : 'Back ID'}
                                        </p>
                                    </div>
                                </div>
                            </>
                        }

                        {
                            userContext.user.kyc.idType === 'passport' &&
                            <>
                                <div className='col-md-6'>
                                    <div className='doc-box option selected'>
                                        <span className='ui-absolute link-round mini bg-apple' style={{ right: '1rem', top: '0.8rem' }}><span className='fe fe-check fs-13 onwhite'></span></span>
                                        <img src={userContext.user.kyc.idData.front} width={'90px'} alt="icon" />
                                        <p className={`font-matterregular brandxp-dark fs-13 mrgb0 `}>Passport ID</p>
                                    </div>
                                </div>
                            </>
                        }

                        

                    </div>

                    <div className='mrgb1 ui-line-height'>
                        <span className='font-matterlight brandxp-neutral fs-14'>You will not be able to proceed to the next verification until your current verification is approved. Please reach out to us if this is taking too long, though we are always responsive and swift to our users' verification requests.</span>
                    </div>
                
                </>
            }
        
        </>
    )
  
}

export default ID