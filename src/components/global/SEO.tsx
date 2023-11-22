import React, { useEffect} from 'react'
import Head from 'next/head'
import { ISEOProps } from '../../utils/types'
const SEO = ({ pageTitle, type, url, title, description, language, image, author, site, keywords }: Partial<ISEOProps>) => {

    const meta = {
        url: 'https://concreap.com',
        title: 'Creon',
        description: 'Blending the power of AI tools with the dynamic crypto and NFT markets',
        language: "en-US",
        author: {
            email: `buchi@creon.com`,
            name: 'Creon',
        },
        site: {
            siteName: 'Concreap',
            searchUrl: 'https://www.google.com/search?q=creon'
        },
        keywords: "Creon, creon, AI, crypto, NFT, technology, software,"}

    useEffect(() => {

    }, [])

    const formatTitle = (t: any): string => {

        let result: any = '';

        if (!t) {
            result = `${meta.title}`
        } else {
            
            if (t === 'main') {

                if (title) {
                    result = `${title} - ${description ? description : meta.description}`;
                } else {
                    result = `${meta.title} - ${description ? description : meta.description}`
                }

            }
    
            if ( t !== 'main') {
                result = `${pageTitle} - ${description ? description : meta.description}`
            }

        }

        

        return result;
    }

    const formatPlainTitle = (): string => {

        let result: string = '';
        if(type === 'main'){
            result = title ? title : meta.title;
        }else{
            result = pageTitle ? pageTitle : meta.title
        }

        return result;

    }


    return (
        <>
            <Head>

                <title>{ formatTitle(type) }</title>

                <meta charSet="UTF-8" />
                <meta name="viewport"
                  content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
                <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                <meta httpEquiv="Content-Language" content="en" />
                <meta name="msapplication-TileImage" content="images/fav/ms-icon-144x144.png" />
                <meta name="theme-color" content="#0D242A" />
                <meta name="msapplication-TileColor" content="#" />
                <meta name="theme-color" content="#fff" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="HandheldFriendly" content="True" />
                <meta name="MobileOptimized" content="320" />
                <meta lang={language ? language : meta.language}/>
                <meta name='author' content={author ? author.name : meta.author.name} />

                <meta name="description" content={ description ? description : meta.description}></meta>
                <meta name="keywords" content={ keywords ? keywords : meta.keywords  }></meta>

                {/* bots tag */}
                <meta name="robots" content="all" />
                <meta name="googlebot" content="all" />

                {/* This tag tells Google not to show the sitelinks search box. */}
                <meta name="google" content="nositelinkssearchbox" key="sitelinks" />

                {/* This meta tag tells Google that you don't want them to provide a translation for this page. */}
                <meta name="google" content="notranslate" key="notranslate" />

                <meta itemProp="description" content={ description ? description : meta.description}></meta>
                {/* <meta itemProp="image" content={ image ? image : meta.image  }></meta> */}

                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:site" content="@concreap" />
                <meta name="twitter:creator" content="@concreap" />
                <meta name="twitter:title" content={`${formatPlainTitle()}`}/>
                <meta name="twitter:description" content={ description ? description : meta.description  }/>
                {/* <meta name="twitter:image" content={ image ? image : meta.image  }/> */}

                <meta property="og:site_name" content={url ? url : meta.url} />
                <meta property="og:title" content={`${formatPlainTitle()}`}/>
                <meta property="og:description" content={ description ? description : meta.description  }/>
                {/* <meta property="og:image" content={ image ? image : meta.image  }/> */}
                <meta property="og:url" content={url ? url : meta.url} />

            </Head>
        </>
    )
  
}

export default SEO