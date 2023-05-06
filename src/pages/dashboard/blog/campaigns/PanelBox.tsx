import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IBlogContext, IPanelBoxProps, IUserContext } from '../../../../utils/types';
import moment from 'moment'
import Axios from 'axios';
import Alert from '../../../../components/partials/Alert';
import storage from '../../../../helpers/storage';
import BlogContext from '@/context/blog/blogContext';
import UserContext from '@/context/user/userContext';

const PanelBox = ({ display, show, animate, data, close, size  }: IPanelBoxProps) => {

    const blogContext = useContext<IBlogContext>(BlogContext)
    const userContext = useContext<IUserContext>(UserContext)

    const [loading, setLoading] = useState<boolean>(false)
    const [alert, setAlert] = useState({
        type: '',
        show: false,
        message: ''
    });

    useEffect(() => {

    }, [])

    const closeX = (e: any): void => {
        if (e) e.preventDefault();
        close(e, null, 'close');
    }

    const publishCampaign = async (e: any) => {

        if(e){ e.preventDefault(); }

        blogContext.setLoading()

        await Axios.put(`${process.env.NEXT_PUBLIC_BLOG_URL}/campaigns/publish/${data && data._id}`, {  } , storage.getConfigWithBearer())
        .then((resp) => {

            if(resp.data.error === false && resp.data.status === 200){
                closeX(e)
                reloadData()
            }

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
            
        })

    }

    const reloadData = () => {

        if(userContext.getUserType() === 'superadmin'){
            blogContext.getCampaigns(30, 1);
        }

        if(userContext.getUserType() === 'admin'){
            blogContext.getUserCampaigns(30, 1, storage.getUserID());
        }

    }

    const formatClicks = (data: Array<any>) => {

        let total: number = 0;

        if(data.length > 0){
            data.map((x) => {
                total = total + x.count;
            })
        }

        return total;

    }

    return (
        <>

            <div className={`panel-box ${show ? '' : 'ui-hide'}`}>

                <div className={`display ${size} ${animate ? 'animate-box' : ''}`}>

                    {/* Panel head */}
                    <div className='d-flex align-items-center'>

                        <h4 className='font-freimedium onwhite mrgb0 fs-15'>Campaign Details</h4>

                        <div className='ml-auto'>

                            {
                                data && data.isEnabled && data.status === 'pending' &&
                                <>
                                    <Link onClick={(e) => publishCampaign(e)} href="" className='link-round sm onwhite bgd-disable'>
                                        <span className='fe fe-check fs-14'></span>
                                    </Link>
                                    <span className='pdl'></span>
                                </>
                            }

                            <Link href={`/dashboard/blog/campaigns/${data && data._id}`} className='link-round sm onwhite bgd-disable'>
                                <span className='fe fe-edit-2 fs-14'></span>
                            </Link>
                            <span className='pdl'></span>
                            <Link onClick={(e) => closeX(e)} href="" className='link-round sm onwhite bgd-disable'>
                                <span className='fe fe-x fs-14'></span>
                            </Link>
                        </div>

                    </div>
                    {/* End Panel head */}

                    {/* Panel box body */}
                    <div className='panel-box-body'>

                        {
                            display === 'details' &&
                            <>

                                <div className='pdt2 pdb1 camp-stats'>

                                    <div className='stat-item'>
                                        <h3 className='mrgb0 fs-30 font-freibold onwhite'>{ data.clicks ? formatClicks(data.clicks) : 0 }</h3>
                                        <span className='mrgb0 fs-12 font-frei onwhite'>Clicks from { data.clicks ? data.clicks.length : 0 } users</span>
                                    </div>
                                    <div className='stat-item'>
                                        <h3 className='mrgb0 fs-30 font-freibold onwhite'>{ data.seen ? data.seen.length : 0 }</h3>
                                        <span className='mrgb0 fs-12 font-frei onwhite'>Users saw campaign</span>
                                    </div>

                                </div>
                                
                                <div className='campaign-wrapper panel dark pdl0 pdr0 pdt0 pdb0'>

                                    <div className='wrapper-inner'>

                                        <div className='camp-head'>
                                            <img src="../../../images/assets/logo-full.svg" alt='concreap-logo' />
                                        </div>

                                        <div className='camp-date'>
                                            <span className='fs-17 font-frei ui-upcase'>{ moment(data.createdAt).format("Do MMMM, YYYY") }</span>
                                        </div>

                                        {
                                            data.sections && data.sections.length > 0 &&
                                            data.sections.map((stn: any, index: number) => 
                                            
                                                <>
                                                
                                                    <div key={stn.label} className={`camp-box ${stn.color}`}>

                                                        <div className={`box-inner`}>

                                                            <h2 className='fs-16 font-freibold'>{ stn.caption }</h2>

                                                            <div className='camp-thumb lg' style={{ backgroundImage: `url("${stn.thumbnail ? stn.thumbnail : 'https://storage.googleapis.com/concreap-buckets/blog-post-01.jpg'}")` }}></div>

                                                            <div className='camp-html font-frei fs-13'
                                                            dangerouslySetInnerHTML={{ __html: stn.marked }} ></div>

                                                            <div className='ui-group-button mrgt2'>

                                                                <a href={stn.url} target="_blank" className='btn smd bgd-yellow stretch onwhite'>
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

                            </>
                        }

                    </div>
                    {/* End Panel box body */}

                </div>

            </div>
        
        </>
    )
  
}

export default PanelBox