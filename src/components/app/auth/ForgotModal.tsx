import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Modal } from 'react-bootstrap';
import Axios from 'axios';

import { IAlertModal } from '../../../utils/types';
import Message from '../../partials/Message';
import Alert from '../../partials/Alert';
import storage from '../../../helpers/storage';


const AlertModal = ({ isShow, closeModal, modalTitle, flattened, stretch, slim, type, data }: Partial<IAlertModal>) => {

    const [reset, setReset] = useState({
        email: '',
        callback:  `${process.env.NEXT_PUBLIC_AUTH_URL}/reset-password`
    })
    const [step, setStep] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [rm, setRm] = useState<boolean>(false)
    const [alert, setAlert] = useState({
        type: '',
        show: false,
        message: ''
    });

    useEffect(() => {
        setStep(0)
    }, [])

    const closeX = (e: any = null) => {
        if (e) e.preventDefault();
        closeModal();

        setTimeout(() => {
            setStep(0)
        }, 400)
    }

    const sendResetLink = async (e: any) => {

        if(e) { e.preventDefault() }

        if(!reset.email){
            setAlert({...alert, type: "danger", show:true, message:'Enter your email'})
            setTimeout(()=> {
                 setAlert({...alert, show:false});
            }, 2500)
        } else{

            setLoading(true);

            await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/forgot-password`, { ...reset }, storage.getConfig())
            .then(async (resp) => {

                if(resp.data.error === false && resp.data.status === 200){
                    setStep(1);
                    setRm(true);
                }
 
                setLoading(false);

            }).catch((err) => {
            
                if(err.response.data.errors && err.response.data.errors.length > 0){

                    setAlert({...alert, type: "danger", show:true, message:err.response.data.errors[0]})
                    setTimeout(()=> {
                        setAlert({...alert, show:false});
                    }, 5000)

                }else{
                    setAlert({...alert, type: "danger", show:true, message:err.response.data.message})
                    setTimeout(()=> {
                        setAlert({...alert, show:false});
                    }, 5000)
                }

                setLoading(false);
            
            });

        }
    }

    return (
        <>

            <Modal show={isShow}
                onHide={() => closeX()}
                size="sm"
                fade={false}
                keyboard={false}
                aria-labelledby="medium-modal"
                centered
                className={`custom-modal ${slim ? slim : ''} ${stretch ? 'stretched' : ''} ${flattened ? 'flat' : ''} lg`}
            >

                <Modal.Body>

                    <div className="d-flex">

                        <div className="dm--dbx ui-full-bg-norm" style={{ backgroundImage: 'url("../../../images/assets/bg@auth01.jpg")' }}>
                            <div className="dm--d">
                                <div>
                                    {/* <img src="../../../images/assets/i" alt="icon" /> */}
                                </div>
                            </div>
                        </div>

                        <div className="dm--body form">

                            <div className="d-flex align-items-center mrgb1">
                                <h2 className="onwhite mrgb0 font-freimedium fs-19">
                                    {modalTitle}
                                </h2>
                                <div className="ml-auto">
                                    <Link href="" onClick={(e) => closeX(e)} className="link-round sm ui-icon-animate" style={{ backgroundColor: "#413AB9" }}>
                                        <span className="fe fe-x fs-16" style={{ color: '#100E33' }}></span>
                                    </Link>
                                </div>
                            </div>

                            <div className="dm--ct mrgt2">
                                {
                                    step === 0 &&
                                    <>

                                        <div className="mrgb2">
                                            <p className="font-frei fs-14 mrgb1 ui-line-height-medium" style={{ color: '#C3C2FB' }}>
                                            It seems  you forgot your password. We can help you recover it, just type in your email address below and we’ll send you a link to change your password
                                            </p>
                                        </div>

                                        <div className="row mrgb2 align-items-end">
                                            <div className="col-md-7">
                                                <label className='fs-14 onwhite font-freimedium mrgb0'>Your email</label>

                                                <input
                                                    defaultValue={''}
                                                    onChange={(e) => { setReset({ ...reset, email: e.target.value }) }}
                                                    type="text" className="form-control fs-14 xl on-black font-freilight onwhite"
                                                    placeholder="Type here" autoComplete='off' />

                                            </div>
                                            <div className="col-md-5">

                                                <Link onClick={(e) => sendResetLink(e)} style={{  top:'-2px' }} className="w-100 onwhite md fs-11 btn bgd-yellow ui-relative" href="">
                                                    <span className='font-freibold fs-13'>Send Me Link</span>
                                                    <span className='fe fe-chevrons-right fs-15 onwhite ui-relative' style={{ top: '2px', left: '5px' }}></span>
                                                </Link>

                                            </div>



                                        </div>
                                    </>
                                }

                                {
                                    step === 1 &&
                                    <>
                                        
                                        <Message
                                            title="Successful!"
                                            displayTitle={false}
                                            message="We’ve sent you a password reset link. Please access the link via your email and reset your password."
                                            action={closeX}
                                            status="success"
                                            lottieSize={200}
                                            loop={false}
                                            actionType="action"
                                            buttonText='Okay'
                                            setBg={false}
                                            bgColor={'#fefefe'}
                                            buttonPosition={'inside'}
                                            slim={false}
                                        />

                                    </>
                                }


                            </div>

                        </div>

                    </div>

                </Modal.Body>

            </Modal>

        </>
    )

}

export default AlertModal