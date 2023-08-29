import React, {useState, useEffect, useContext, useRef} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Axios from 'axios'
import storage from '../../../helpers/storage'
import WebCam from 'react-webcam';
import Toast from '../../../components/partials/Toast'
import { IVerificationProps } from '../../../utils/types';
import UserContext from '@/context/user/userContext'

const Face = ({ status, userId }: Partial<IVerificationProps>) => {

    const camRef = useRef(null);

    const userContext = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [front, setFront] = useState('')
    const [step, setStep] = useState(0)

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

    const capture = (e: any) => {
        if(e) { e.preventDefault(); }
        // const url = camRef.current.getScreenshot();
        // setFront(url);
    }

    const toggleCapture = (e: any) => {
        e.preventDefault();
        setFront('');
    }

    const videoConstraints = {
        width: 225,
        height: 225,
        facingMode: "user"
    };

    const toggleToast = (e: any) => {
        if(e) e.preventDefault();
        setToast({ ...toast, show: !toast.show });
    }

    const submit = async (e: any) => {

        if(e) { e.preventDefault() }

        if(!front){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'all fields are required', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else{

            setLoading(true);

            await Axios.put(`${process.env.NEXT_PUBLIC_AUTH_URL}/users/kyc/update-face/${userId}`, { faceData: front }, storage.getConfigWithBearer())
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
                        <span className='font-mattermedium brandxp-purple fs-16 ui-relative' style={{ top: '-2px' }}>{ status === 'pending' ? 'Face ID verification' : 'Waiting for approval' }</span> 
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
                            
                                <p className='font-matterlight brandxp-neutral fs-14 mrgb1'>Click allow at the top left corner. Position your camera to capture your face properly.</p>

                                <div className='row mrgt2 mrgb2'>

                                    <div className='col-md-7 mx-auto ui-text-center'>

                                        {
                                            !front &&
                                            <WebCam
                                                audio={false}
                                                height={225}
                                                ref={camRef}
                                                screenshotFormat="image/jpeg"
                                                width={225}
                                                className="ui-rounded"
                                                videoConstraints={videoConstraints}
                                            />
                                        }

                                        {
                                            front &&
                                            <>
                                                <img 
                                                src={front} 
                                                className="ui-rounded" 
                                                alt="captured" 
                                                width={'220px'}
                                                height={'220px'}
                                                style={{borderRadius: '100%', border: '6px solid #E0EAEC'}} />
                                            </>
                                        }

                                    </div>

                                </div>

                                <div className='ui-line bg-silverlight'></div>

                                <div className='d-flex align-items-center justify-content-center mrgt2 mrgb1'>

                                    <div className='ui-group-button'>

                                        {
                                            !front &&
                                            <Link onClick={(e) => capture(e)} href="" className={`btn md stretch-md bg-brandxp-lp ${loading ? 'disabled-lt' : ''} font-mattermedium brandxp-dark`}>
                                                Capture
                                            </Link>
                                        }

                                        {
                                            front &&
                                            <Link onClick={(e) => toggleCapture(e)} href="" className={`btn md stretch-md bg-brandxp-lp ${loading ? 'disabled-lt' : ''} font-mattermedium brandxp-dark`}>
                                                Delete
                                            </Link>
                                        }

                                        <Link onClick={(e) => submit(e)} href="" className={`btn md stretch-md bg-brandxp-orange ${ !front ? 'disabled-lt' : '' } ${loading ? 'disabled-lt' : ''} font-mattermedium onwhite`}>
                                            { loading ? <span className='xp-loader sm white'></span> : 'Submit' }
                                        </Link>

                                    </div>
                                    
                                </div>
                            
                            </>
                        }

                    </form>
                
                </>
            }

            {
                status === 'submitted' && userContext.user.kyc && userContext.user.kyc.faceId &&
                <>

                    <div className='mrgb1 ui-line-height'>
                        <span className='font-matterlight brandxp-neutral fs-14'>Your face ID verification is awaiting approval. contact </span>
                        <span className='font-matterregular brandxp-orange fs-14'>support@xpresschain.co</span>
                        <span className='font-matterlight brandxp-neutral fs-14'> to speed up approval. This should normally take 24 hours</span>
                    </div>

                    <div className='row mrgt2 mrgb2 disabled-lt'>

                        <div className='col-md-7 mx-auto ui-text-center'>

                            <img 
                            src={userContext.user.kyc.faceId} 
                            className="ui-rounded" 
                            alt="captured" 
                            width={'220px'}
                            height={'220px'}
                            style={{borderRadius: '100%', border: '6px solid #E0EAEC'}} />

                        </div>

                    </div>

                    <div className='mrgb1 ui-line-height'>
                        <span className='font-matterlight brandxp-neutral fs-14'>You will not be able to proceed to the next verification until your current verification is approved. Please reach out to us if this is taking too long, though we are always responsive and swift to our users' verification requests.</span>
                    </div>
                
                </>
            }
        
        </>
    )
  
}

export default Face