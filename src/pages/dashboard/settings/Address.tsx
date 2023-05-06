import React, {useState, useEffect, useContext, useRef} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Axios from 'axios'
import storage from '../../../helpers/storage'
import DropDown from '../../../components/partials/DropDown';
import Toast from '../../../components/partials/Toast'
import body from '../../../helpers/body';
import { IResourceContext, IUserContext, IVerificationProps } from '../../../utils/types';
import UserContext from '@/context/user/userContext'
import ResourceContext from '@/context/resource/resourceContext'

const Address = ({ status, userId }: Partial<IVerificationProps>) => {

    const frontLink = useRef(null);

    const userContext = useContext<IUserContext>(UserContext);
    const resourceContext = useContext<IResourceContext>(ResourceContext);

    const [frontName, setFrontName] = useState('')
    const [front, setFront] = useState('')
    const [loading, setLoading] = useState(false);
    const [states, setStates] = useState<Array<any>>([])
    const [dob, setBirth] = useState('');
    const [basic, setBasic] = useState({
        firstName: '', 
		lastName: '', 
		middleName: '', 
		dob: '', 
		gender: '', 
		age: 0
    })
    const [selected, setSelected] = useState(false);

    const [regData, setRegData] = useState({
        country: '',
        city: '',
        state: '',
        address: '',
        postalCode: '',
        utilityDoc: ''

    })

    const [toast, setToast] = useState({
        type: 'success',
        show: false,
        message: '',
        title: '',
        position: 'top-right'
    })

    const [alert, setAlert] = useState({
        type: '',
        show: false,
        message: ''
    });

    useEffect(() => {

        Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        resourceContext.getIpAddress();
        resourceContext.getCountries(9999);

    }, [])

    const openDialog = async (e: any) => {
        e.preventDefault();
        // frontLink.current.click();
    }

    const browseFile = (e: any) => {
        
        if (e.target.files && e.target.files[0]) {

            if (e.target.files[0].size > 5000000) {

                setToast({...toast, type: "error", show:true, title: 'Error', message:'file cannot be more than 5MB in size', position: 'top-right'})
                setTimeout(()=> {
                    setToast({...toast, show:false});
                }, 5000)

            }else{

                setFrontName(e.target.files[0].name)
                getFileSource(e.target.files[0]);

            }
            
        }
    }

    const getFileSource = (file: any) => {
    
        let reader = new FileReader();
        reader.onload = (e: any) => {

            setFront(e.target.result);
            setRegData({ ...regData, utilityDoc: e.target.result });
        };

        reader.readAsDataURL(file);
      
    }

    const getOptions = () => {

        const formatted = resourceContext.countries.filter((i) => (i.phoneCode !== undefined && i.flag !== undefined))

        const cp = formatted.map((i) => {
            let c = {
                value: i._id,
                label: i.name,
                left:  i.phoneCode,
                image: i.flag ? i.flag : '../../../../images/assets/c-avatar.svg'
            }
            return c;
        })
       
        return cp;
       
    }

    const setDefaultStates = (code: string) => {

        let result = [];

        const count = resourceContext.countries.find((c) => c.phoneCode === code);
        if(count && count.states.length > 0){
            result = count.states;
        }

        return result;

    }

    const getCountry = (id: string) => {

        let result = 'Nil';
        const count = resourceContext.countries.find((c) => c._id === id);
        if(count){
            result = count.name;
        }

        return result;
    }

    const setDefault = (code: any) => {

        if(!resourceContext.loading && resourceContext.countries.length > 0){

            const ct = resourceContext.countries.find((i) => i.code2 === code);
            const fm = {
                value: ct._id,
                label: ct.name,
                left:  ct.phoneCode,
                image: ct.flag ? ct.flag : '../../../images/assets/c-avatar.svg'
            }

            if(fm){
                return fm;
            }else{
                return 1
            }

        }else{
            return 1;
        }

            
    }
    
    const getSelected = (val: any) => {

        const count = resourceContext.countries.find((c) => c._id === val.value);
        if(count && count.states.length > 0){
            setStates(count.states);
        }else{
            setStates([]);
        }
        setRegData({ ...regData, country: val.value });

    }

    const toggleToast = (e: any) => {
        if(e) e.preventDefault();
        setToast({ ...toast, show: !toast.show });
    }

    const submit = async (e: any) => {

        if(e) { e.preventDefault() }

        if(!selected){
            const cty = setDefault('NG');
            regData.country = cty !== 1 ? cty.value : "+234"
        }

        if(!regData.country && !regData.state && !regData.city && !regData.postalCode && !regData.address && !regData.utilityDoc){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'all fields are required', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else if(!regData.country){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'slelect country', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else if(!regData.city){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'enter your city of residence', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else if(!regData.postalCode){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'enter your postal code', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else if(!regData.address){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'enter your address', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else if(!regData.utilityDoc){
            setToast({...toast, type: "error", show:true, title: 'Error', message:'upload a utility document', position: 'top-right'})
            setTimeout(()=> {
                setToast({...toast, show:false});
            }, 5000)
        }else{

            setLoading(true);

            await Axios.put(`${process.env.NEXT_PUBLIC_AUTH_URL}/users/kyc/update-address/${userId}`, {...regData}, storage.getConfigWithBearer())
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
                        <span className='font-mattermedium brandxp-purple fs-16 ui-relative' style={{ top: '-2px' }}>{ status === 'pending' ? 'Verify your personal address' : 'Waiting for approval' }</span> 
                    </h1>
                    {/* <p className='font-matterlight brandxp-neutral fs-14 mrgb0'>Details like name, and more.</p> */}
                </div>
                <span className='custom-badge bg-brandxp-lplight brandxp-purple fs-13 font-matterregular ml-auto'>{ status }</span>
            </div>

            <div className='ui-line bg-silverlight'></div>

            
            
            <form className={`form verify-form ${status === 'submitted' ? 'disabled-lt' : ''}`} onSubmit={(e) => { e.preventDefault() }}>

                {
                    status === 'pending' &&
                    <>

                        <p className='font-matterlight brandxp-neutral fs-14 mrgb1'>Supply all fields to verify your personal details</p>
                    
                        <div className='form-group'>

                            <div className='form-row'>

                                <div className='col pdr'>
                                    <label className="font-matterregular brandxp-dark fs-13 mrgb0">Country</label>
                                    <DropDown 
                                    options={getOptions} 
                                    selected={getSelected} 
                                    className="form-drop font-matterregular"
                                    placeholder={``} 
                                    search={true}
                                    displayImage={true}
                                    displayControlLeft={false}
                                    displayOptionLeft={true}
                                    displayOptionLabel={true}
                                    displayLabel={true}
                                    defaultValue={setDefault('NG')}
                                    />
                                </div>

                                <div className='col pdl'>
                                    <label className="font-matterregular brandxp-dark fs-13 mrgb0">City</label>
                                    <input 
                                    defaultValue={''}
                                    onChange={(e) => { setRegData({ ...regData, city: e.target.value }) }}
                                    type="text" className="form-control fs-14 lg on-black font-matterregular" 
                                    placeholder="E.g. Ikeja" autoComplete='off'/>
                                </div>

                            </div>

                        </div>

                        <div className='form-group'>

                            <div className='form-row'>

                                <div className='col ui-relative pdr'>
                                    <Link href="" className="drop-arrow">
                                        <span className="fe fe-chevron-down"></span>
                                    </Link>
                                    <label className="font-matterregular brandxp-dark fs-13 mrgb0">State</label>
                                    <select 
                                    defaultValue={''}
                                    onChange={(e) => { setRegData({ ...regData, state: e.target.value }) }}
                                    className="form-control custom-select lg font-matterlight">
                                        <option value="">Select</option>
                                        {
                                            setDefaultStates("+234").length > 0 && states.length <= 0 &&
                                            setDefaultStates("+234").map((s: any, i: number) => 
                                                <option key={i} value={body.captialize(s.name)}>{ body.captialize(s.name) }</option>
                                            )
                                        }
                                        {
                                            states && states.length > 0 &&
                                            states.map((s, i) => 
                                                <option key={i} value={body.captialize(s.name)}>{ body.captialize(s.name) }</option>
                                            )
                                        }
                                    </select>
                                    
                                </div>

                                <div className='col pdl'>
                                    <label className="font-matterregular brandxp-dark fs-13 mrgb0">Postal code</label>
                                    <input 
                                    defaultValue={''}
                                    onChange={(e) => { setRegData({ ...regData, postalCode: e.target.value }) }}
                                    type="text" className="form-control fs-14 lg on-black font-matterregular" 
                                    placeholder="E.g. 120001" autoComplete='off'/>
                                </div>

                            </div>

                        </div>

                        <div className='form-group'>

                            <div className='form-row'>

                                <div className='col-12'>
                                    <label className="font-matterregular brandxp-dark fs-13 mrgb0">Your address</label>
                                    <input 
                                    defaultValue={''}
                                    onChange={(e) => { setRegData({ ...regData, address: e.target.value }) }}
                                    type="text" className="form-control fs-14 lg on-black font-matterregular" 
                                    placeholder="Type here" autoComplete='off'/>
                                </div>

                                <div className='col-12'>

                                    <input onChange={(e) => browseFile(e)} ref={frontLink} type="file" accept='image/*' className="form-control ui-hide fs-14 mm  on-black font-matterregular"  />

                                    <Link onClick={(e) => openDialog(e)} href="" className={`doc-box option mrgt1 ${ front !== '' ? 'selected' : '' }`}>

                                        {
                                            front !== '' && <span className='ui-absolute link-round mini bg-apple' style={{ right: '1rem', top: '0.8rem' }}><span className='fe fe-check fs-13 onwhite'></span></span>
                                        }

                                        <img src={`${ front ? front : '../../../images/icons/docfront.svg' }`} width={front ? '90px' : ''} alt="icon" />
                                        <p className={`font-matterregular brandxp-dark fs-13 mrgb0 ui-text-center ${front ? 'text-elipsis md' : ''}`}>{ frontName ? frontName : 'Browse Doc' }</p>

                                    </Link>
                                    
                                </div>

                            </div>

                        </div>

                        <div className='d-flex align-items-center mrgt2 mrgb1'>
                            <Link onClick={(e) => submit(e)} href="" className={`btn md stretch-md bg-brandxp-orange ${loading ? 'disabled-lt' : ''} font-mattermedium ml-auto onwhite`}>
                                { loading ? <span className='xp-loader sm white'></span> : 'Submit' }
                            </Link>
                        </div>
                    
                    </>
                }

                {
                    status === 'submitted' && userContext.user.kyc &&
                    <>

                        <div className='mrgb1 ui-line-height'>
                            <span className='font-matterlight brandxp-neutral fs-14'>Your address verification is awaiting approval. contact </span>
                            <span className='font-matterregular brandxp-orange fs-14'>support@xpresschain.co</span>
                            <span className='font-matterlight brandxp-neutral fs-14'> to speed up approval. This should normally take 24 hours</span>
                        </div>
                    
                        <div className='form-group'>

                            <div className='form-row'>

                                <div className='col pdr'>
                                    <label className="font-matterregular brandxp-dark fs-13 mrgb0">Country</label>
                                    <input 
                                    value={ getCountry(userContext.user.kyc.country) }
                                    type="text" className="form-control fs-14 lg on-black font-matterregular" 
                                    placeholder="E.g. Ikeja" autoComplete='off'/>
                                </div>

                                <div className='col pdl'>
                                    <label className="font-matterregular brandxp-dark fs-13 mrgb0">City</label>
                                    <input 
                                    value={ userContext.user.kyc.city }
                                    type="text" className="form-control fs-14 lg on-black font-matterregular" 
                                    placeholder="E.g. Ikeja" autoComplete='off'/>
                                </div>

                            </div>

                        </div>

                        <div className='form-group'>

                            <div className='form-row'>

                                <div className='col pdr'>
                                    <label className="font-matterregular brandxp-dark fs-13 mrgb0">State</label>
                                    <input 
                                    value={ userContext.user.kyc.state }
                                    type="text" className="form-control fs-14 lg on-black font-matterregular" 
                                    placeholder="E.g. Ikeja" autoComplete='off'/>
                                </div>

                                <div className='col pdl'>
                                    <label className="font-matterregular brandxp-dark fs-13 mrgb0">Postal code</label>
                                    <input 
                                    value={ userContext.user.kyc.postalCode }
                                    onChange={(e) => { setRegData({ ...regData, postalCode: e.target.value }) }}
                                    type="text" className="form-control fs-14 lg on-black font-matterregular" 
                                    placeholder="E.g. 120001" autoComplete='off'/>
                                </div>

                            </div>

                        </div>

                        <div className='form-group'>

                            <div className='form-row'>

                                <div className='col-12'>
                                    <label className="font-matterregular brandxp-dark fs-13 mrgb0">Your address</label>
                                    <input 
                                    value={ userContext.user.kyc.address }
                                    type="text" className="form-control fs-14 lg on-black font-matterregular" 
                                    placeholder="Type here" autoComplete='off'/>
                                </div>

                                <div className='col-12'>

                                    <div className={`doc-box option mrgt1 selected`}>
                                    <span className='ui-absolute link-round mini bg-apple' style={{ right: '1rem', top: '0.8rem' }}><span className='fe fe-check fs-13 onwhite'></span></span>
                                        <img src={userContext.user.kyc.utilityDoc} width={'90px'} alt="icon" />
                                        <p className={`font-matterregular brandxp-dark fs-13 mrgb0 ui-text-center text-elipsis md`}>Utility Doc</p>

                                    </div>
                                    
                                </div>

                            </div>

                        </div>
                    
                    </>
                }

            </form>

        </>
    )
  
}

export default Address