import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Modal } from 'react-bootstrap';
import { IBlogContext, IDeletePostModal, IUserContext } from '../../../../utils/types';
import Message from '../../../../components/partials/Message';
import Alert from '../../../../components/partials/Alert';
import Axios from 'axios';
import storage from '../../../../helpers/storage';
import UserContext from '@/context/user/userContext';
import BlogContext from '@/context/blog/blogContext';


const AddNew = ({ isShow, closeModal, modalTitle, flattened, stretch, slim, data, type }: any) => {

    const userContext = useContext<IUserContext>(UserContext)
    const blogContext = useContext<IBlogContext>(BlogContext)

    const [email, setEmail] = useState<string>('')
    const [step, setStep] = useState<number>(0)
    const [tag, setTag] = useState({
        name: '',
        description: ''
    })
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

        setTimeout(() => {
            setStep(0)
        }, 400)
    }

    const createTag = async (e: any) => {

        if(e){ e.preventDefault(); }

        if(!tag.name){

            setAlert({ ...alert, type: "danger", show: true, message: 'Enter tag name' })
            setTimeout(() => {
                setAlert({ ...alert, show: false });
            }, 2500)

        }else{

            setLoading(true)

            await Axios.post(`${process.env.NEXT_PUBLIC_BLOG_URL}/tags`, { ...tag } , storage.getConfigWithBearer())
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

        

    }

    const updateTag = async (e: any) => {

        if(e){ e.preventDefault(); }

        setLoading(true)

        await Axios.put(`${process.env.NEXT_PUBLIC_BLOG_URL}/tags/${data._id}`, { ...tag } , storage.getConfigWithBearer())
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

        if (userContext.getUserType() === 'writer') {
            blogContext.getUserTags(30, 1, storage.getUserID())
        }

        if (userContext.getUserType() === 'superadmin' || userContext.getUserType() === 'admin') {
            blogContext.getTags(30, 1);
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
                                <h2 className="onwhite mrgb0 font-freimedium fs-20">
                                    {modalTitle}
                                </h2>
                                <div className="ml-auto">
                                    <Link href="" onClick={(e) => closeX(e)} className="link-round minix ui-icon-animate" style={{ backgroundColor: "#413AB9" }}>
                                        <span className="fe fe-x fs-14" style={{ color: '#100E33' }}></span>
                                    </Link>
                                </div>
                            </div>
                            {/* 1C1942 */}
                            <div className="dm--ct mrgt2">
                                <form action="" className="form" onSubmit={(e) => e.preventDefault()}>

                                <Alert type={alert.type} show={alert.show} message={alert.message} />

                                {
                                    step === 0 &&
                                    <>
                                        <div className="form-row mrgb">

                                            <div className='col'>
                                                <label htmlFor="name" className='onwhite font-freimedium fs-13 mrgb0'>Tag name</label>
                                                <input
                                                    defaultValue={type === 'edit' && data ? data.name : ''}
                                                    onChange={(e) => setTag({ ...tag, name: e.target.value })}
                                                    className='form-control xl font-freilight onwhite fs-14'
                                                    type="text" name="name" id="name" placeholder='Ex Product'
                                                />
                                            </div>

                                        </div>

                                        <div className='form-row mrgb'>

                                            <div className='col'>

                                                <label htmlFor="desc" className='onwhite font-freimedium fs-13 mrgb0'>Description</label>
                                                    <textarea
                                                        defaultValue={type === 'edit' && data ? data.description : ''}
                                                        id='desc'
                                                        onChange={(e) => setTag({ ...tag, description: e.target.value })}
                                                        className="form-control fs-14 onwhite font-frei bg-brand-nblue headline"
                                                        placeholder="Type here" autoComplete='off'
                                                        rows={3} />

                                            </div>

                                        </div>

                                        <div className='mrgb1 mrgt2 d-flex align-items-center'>

                                            <Link 
                                                onClick={(e) => { type === 'edit' ? updateTag(e) : createTag(e) }} 
                                                href="" className={`ml-auto stretch-md btn sm bgd-yellow onwhite ${loading ? 'diabled-lt' : ''}`}>
                                                { loading ? <span className='cp-loader sm white'></span> : <span className='font-freimedium fs-13'>{type === 'edit' ? 'Save' : 'Create'}</span> }
                                            </Link>

                                        </div>

                                    </>
                                }

                                {
                                    step === 1 &&
                                    <>

                                        <Message
                                            title="Successful!"
                                            displayTitle={false}
                                            message={type === 'edit' ? 'Tag saved successfully' : 'Tag created successfully'}
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
                                </form>
                            </div>
                        </div>

                    </div>



                </Modal.Body>

            </Modal >

        </>
    )

}

export default AddNew