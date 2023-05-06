import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Modal } from 'react-bootstrap';
import { IBlogContext, IDeleteSubModal, IUserContext } from '../../../../utils/types';
import Message from '../../../../components/partials/Message';

import Axios from 'axios';
import storage from '../../../../helpers/storage';
import Alert from '../../../../components/partials/Alert';
import BlogContext from '@/context/blog/blogContext';
import UserContext from '@/context/user/userContext';


const DeleteModal = ({ isShow, closeModal, modalTitle, flattened, stretch, slim, data, type }: Partial<IDeleteSubModal>) => {

    const navigate = useRouter()

    const blogContext = useContext<IBlogContext>(BlogContext)
    const userContext = useContext<IUserContext>(UserContext)

    const [email, setEmail] = useState<string>('');
    const [step, setStep] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false)

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
        setStep(0)
    }

    const deleteCampaign = async (e: any) => {

        if(e){ e.preventDefault(); }

        setLoading(true)

        await Axios.delete(`${process.env.NEXT_PUBLIC_BLOG_URL}/campaigns/${data._id}`, storage.getConfigWithBearer())
        .then((resp) => {

            if(resp.data.error === false && resp.data.status === 200){
                navigate.push('/dashboard/blog/campaigns')
                reloadData()
                closeX(e);
            }

            setLoading(false);

        }).catch((err) => {

            if (err.response.data.errors && err.response.data.errors.length > 0) {

                setAlert({ ...alert, type: "danger", show: true, message: err.response.data.errors[0] })
                setTimeout(() => {
                    setAlert({ ...alert, show: false });
                }, 2500)

            } else {
                setAlert({ ...alert, type: "danger", show: true, message: err.response.data.message })
                setTimeout(() => {
                    setAlert({ ...alert, show: false });
                }, 2500)
            }

            setLoading(false);
            
        })

    }

    const enableDisable = async (e: any, t: string) => {

        if(e){ e.preventDefault(); }

        setLoading(true)

        await Axios.put(`${process.env.NEXT_PUBLIC_BLOG_URL}/campaigns/${t}/${data._id}`, { email: data.email } , storage.getConfigWithBearer())
        .then((resp) => {

            if(resp.data.error === false && resp.data.status === 200){
                setStep(1);
                reloadData()
            }

            setLoading(false);

        }).catch((err) => {

            if (err.response.data.errors && err.response.data.errors.length > 0) {

                setAlert({ ...alert, type: "danger", show: true, message: err.response.data.errors[0] })
                setTimeout(() => {
                    setAlert({ ...alert, show: false });
                }, 2500)

            } else {
                setAlert({ ...alert, type: "danger", show: true, message: err.response.data.message })
                setTimeout(() => {
                    setAlert({ ...alert, show: false });
                }, 2500)
            }

            setLoading(false);
            
        })

    }

    const reloadData = () => {

        if(type === 'list'){

            if(userContext.getUserType() === 'superadmin'){
                blogContext.getCampaigns(30, 1);
            }

            if(userContext.getUserType() === 'admin'){
                blogContext.getUserCampaigns(30, 1, storage.getUserID());
            }

        }

        if(type === 'single'){
            blogContext.getCampaign(data._id);
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
                                <h2 className="onwhite mrgb0 font-freimedium fs-18">
                                    {modalTitle}
                                </h2>
                                <div className="ml-auto">
                                    <Link href="" onClick={(e) => closeX(e)} className="link-round minix ui-icon-animate" style={{ backgroundColor: "#413AB9" }}>
                                        <span className="fe fe-x fs-14" style={{ color: '#100E33' }}></span>
                                    </Link>
                                </div>
                            </div>

                            <div className="dm--ct mrgt2">
                                {
                                    step === 0 &&
                                    <>

                                        <Alert type={alert.type} show={alert.show} message={alert.message} />

                                        <div className="mrgb1">

                                            <div className='ui-text-center mrgb1'>
                                                <span className='link-round xlg bgd-disable'>
                                                    <i className='cp-icon cp-info active'>
                                                        <i className='path1 fs-30'></i>
                                                        <i className='path2 fs-30'></i>
                                                    </i>
                                                </span>
                                            </div>

                                            <div className='row mrgb1'>
                                                <div className='col-md-8 mx-auto ui-text-center'>
                                                    <p className="font-frei fs-16 mrgb1 ui-line-height-medium mrgb0" style={{ color: '#C3C2FB' }}>
                                                        Are you sure you want to delete this campaign? You can just { data && data.isEnabled ? 'disable' : 'enable' }. 
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="ui-text-center">
                                               <div className='mrgb1'>

                                                    <Link onClick={(e) => enableDisable(e, data && data.isEnabled ? 'disable' : 'enable')} href="" className={`btn sm bgd-yellow onwhite ${loading ? 'disabled-lt' : ''}`}>
                                                        { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-13 stretch-md'>{ data && data.isEnabled ? 'Disable' : 'Enable' }</span> }
                                                    </Link>
                                                    <span className='pdl1'></span>
                                                    <Link onClick={(e) => deleteCampaign(e)} href="" className={`btn sm bgd-disable onwhite ${loading ? 'disabled-lt' : ''}`}>
                                                        { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-13 stretch-md'>Delete</span> }
                                                    </Link>
                                                    
                                               </div>

                                                <Link onClick={(e) => closeX(e)} href="" className='font-freimedium fs-14' style={{ color: '#7372E8' }}>Cancel</Link>
                                               
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
                                            message={data && data.isEnabled ? 'Campaign disabled successfully' : 'Campaign enabled successfully'}
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

export default DeleteModal