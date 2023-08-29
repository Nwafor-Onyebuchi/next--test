import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import storage from '../../../helpers/storage'
import body from '../../../helpers/body'

import { IPostBarProps } from '../../../utils/types'
import moment from 'moment';

import { 
    TwitterIcon, TwitterShareButton, 
    TelegramIcon, TelegramShareButton,
    WhatsappIcon, WhatsappShareButton,
    FacebookIcon, FacebookShareButton,
    LinkedinIcon, LinkedinShareButton, 
} from 'react-share';

const PostBar = ({ isFixed, backgroundColor, doScroll, post, share }: Partial<IPostBarProps>) => {

    const [showNotify, setShowNotify] = useState(false);
    const navigate = useRouter();

    useEffect(() => {

        body.fixNav()

    }, [])

    const formatTag = (name: any) => {

        let result: string = '';

        const sps = name.toString().split(' ');
        const spl = name.toString().split('/');

        if(sps.length > 1){
            result = sps.join('');
        }else if(spl.length > 1){
            result = spl.join('');
        }else{
            result = sps.length === 1 ? sps[0] : spl[0];
        }

        return result;

    } 

    return (
        <>
        
            <div className={`post-bar ${ isFixed ? 'stick' : '' }`} style={{ backgroundColor: backgroundColor }}>

                <h1 className='mrgb0 onwhite font-freibold fs-16 ui-hide-mobile-only'>{ post.title ? post.title : 'No Post Title' }</h1>
                <span className='pdl pdr onwhite ui-hide-mobile-only'>&#8212;</span>

                <div className='' style={{ lineHeight: '0' }}>

                    <TwitterShareButton
                    title={`Checkout this article on concreap.`}
                    url={ post.premalink ? post.premalink : '' }
                    hashtags={
                        ["concreap"].concat(
                            post.tags && post.tags.length > 0 &&
                            post.tags.map((tg: any, i: number) => {
                                return formatTag(tg.name)
                            })
                        )
                    }
                    >
                        <TwitterIcon round={true} size={30} />
                    </TwitterShareButton>

                    <TelegramShareButton
                    title={`Checkout this article on concreap.`}
                    url={ post.premalink ? post.premalink : '' }
                    >
                        <TelegramIcon round={true} size={30} />
                    </TelegramShareButton>

                    <FacebookShareButton
                    title={`Checkout this article on concreap.`}
                    url={ post.premalink ? post.premalink : '' }
                    hashtag={
                        post.tags && post.tags.length > 0 &&
                        post.tags.map((tg: any, i: number) => {
                            return formatTag(tg.name)
                        })
                    }
                    >
                        <FacebookIcon round={true} size={30} />
                    </FacebookShareButton>

                    <LinkedinShareButton
                    title={`Checkout this article on concreap.`}
                    url={ post.premalink ? post.premalink : '' }
                    >
                        <LinkedinIcon round={true} size={30} />
                    </LinkedinShareButton>

                    <WhatsappShareButton
                    title={`Checkout this article on concreap.`}
                    url={ post.premalink ? post.premalink : '' }
                    >
                        <WhatsappIcon round={true} size={30} />
                    </WhatsappShareButton>

                </div>

            </div>

        </>
    )
  
}

export default PostBar