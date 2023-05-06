import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Axios from 'axios'
import storage from '../../../helpers/storage'
import Toast from '../../../components/partials/Toast'
import { IUserContext, IVerificationProps } from '../../../utils/types';
import UserContext from '@/context/user/userContext'

const Basic = ({ status, userId }: Partial<IVerificationProps>) => {

    const userContext = useContext<IUserContext>(UserContext);

    const [loading, setLoading] = useState(false);
    const [dob, setBirth] = useState('');
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
    }, [])

    const toggleToast = (e: any) => {
        if(e) e.preventDefault();
        setToast({ ...toast, show: !toast.show });
    }

    const setDob = (val: any) => {
        setBirth(val);
    }

    const submit = async (e: any) => {

        if(e) { e.preventDefault() }

        if(!basic.firstName && !basic.lastName && !basic.middleName && !basic.age && !basic.gender && !basic.dob){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'all fields are required', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else if(!basic.firstName){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'enter your first name', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else if(!basic.lastName){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'enter your last name', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else if(!basic.middleName){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'enter your middle name', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else if(!basic.gender){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'select gender', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else if(!dob){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'select data of birth', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else if(!basic.age || basic.age === 0){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'enter your age', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else{

            const data = {
                firstName: basic.firstName, 
                lastName: basic.lastName, 
                middleName: basic.middleName, 
                dob: dob, 
                gender: basic.gender, 
                age: parseInt(basic.age.toString())
            }

            setLoading(true);

            await Axios.put(`${process.env.NEXT_PUBLIC_AUTH_URL}/users/kyc/update-basic/${userId}`, {...data}, storage.getConfigWithBearer())
            .then(async (resp) => {

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
                        <span className='font-mattermedium brandxp-purple fs-16 ui-relative' style={{ top: '-2px' }}>Verify personal details</span> 
                    </h1>
                    {/* <p className='font-matterlight brandxp-neutral fs-14 mrgb0'>Details like name, and more.</p> */}
                </div>
                <span className='custom-badge bg-brandxp-lplight brandxp-purple fs-13 font-matterregular ml-auto'>{ status }</span>
            </div>

            <div className='ui-line bg-silverlight'></div>

            <p className='font-matterlight brandxp-neutral fs-14 mrgb1'>Supply all fields to verify your personal details</p>
            
            <form className='form verify-form' onSubmit={(e) => { e.preventDefault() }}>

                <div className='form-group'>

                    <div className='form-row'>

                        <div className='col pdr'>
                            <label className="font-matterregular brandxp-dark fs-13 mrgb0">First name</label>
                            <input 
                            defaultValue={''}
                            onChange={(e) => { setBasic({ ...basic, firstName: e.target.value }) }}
                            type="text" className="form-control fs-14 lg on-black font-matterregular" 
                            placeholder="E.g. John" autoComplete='off' />
                        </div>

                        <div className='col pdl'>
                            <label className="font-matterregular brandxp-dark fs-13 mrgb0">Last name</label>
                            <input 
                            defaultValue={''}
                            onChange={(e) => { setBasic({ ...basic, lastName: e.target.value }) }}
                            type="text" className="form-control fs-14 lg on-black font-matterregular" 
                            placeholder="E.g. Doe" autoComplete='off'/>
                        </div>

                    </div>

                </div>

                <div className='form-group'>

                    <div className='form-row'>

                        <div className='col pdr'>
                            <label className="font-matterregular brandxp-dark fs-13 mrgb0">Middle name</label>
                            <input 
                            defaultValue={''}
                            onChange={(e) => { setBasic({ ...basic, middleName: e.target.value }) }}
                            type="text" className="form-control fs-14 lg on-black font-matterregular" 
                            placeholder="E.g. John" autoComplete='off' />
                        </div>

                        <div className='col pdl'>
                            <label className="font-matterregular brandxp-dark fs-13 mrgb0">Date of birth</label>
                            {/* <Flatpickr
                                options={{ time_24hr: false, enableTime: false, noCalendar: false }}
                                defaultValue={''}
                                onChange={(date) => setDob(date)}
                                className={`form-pickr fs-14 font-matterregular`}
                            /> */}
                        </div>

                    </div>

                </div>

                <div className='form-group'>

                    <div className='form-row'>

                        <div className='col ui-relative pdr'>
                            <Link href="" className="drop-arrow">
                                <span className="fe fe-chevron-down"></span>
                            </Link>
                            <label className="font-matterregular brandxp-dark fs-13 mrgb0">Gender</label>
                            <select 
                            defaultValue={''}
                            onChange={(e) => { setBasic({ ...basic, gender: e.target.value }) }}
                            className="form-control custom-select lg font-matterlight">
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            
                        </div>

                        <div className='col pdl'>
                            <label className="font-matterregular brandxp-dark fs-13 mrgb0">Your Age</label>
                            <input 
                            defaultValue={''}
                            onChange={(e) => { setBasic({ ...basic, age: parseInt(e.target.value) }) }}
                            type="text" className="form-control fs-14 lg on-black font-matterregular" 
                            placeholder="E.g. 20" autoComplete='off'/>
                        </div>

                    </div>

                </div>

                <div className='d-flex align-items-center mrgt2 mrgb1'>
                    <Link onClick={(e) => submit(e)} href="" className={`btn md stretch-md bg-brandxp-orange ${loading ? 'disabled-lt' : ''} font-mattermedium ml-auto onwhite`}>
                        { loading ? <span className='xp-loader sm white'></span> : 'Submit' }
                    </Link>
                </div>

            </form>

        </>
    )
  
}

export default Basic