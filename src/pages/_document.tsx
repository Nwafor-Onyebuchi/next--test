import Document, { Html, Main, Head, NextScript } from 'next/document';
// import Head from 'next/head'

class AppDocument extends Document {

  static async getInitialProps(ctx: any) {
      const originalRenderPage = ctx.renderPage
      
      // Run the React rendering logic synchronously
      ctx.renderPage = () =>
      originalRenderPage({
        // Useful for wrapping the whole react tree
        enhanceApp: (App: any) => App,
        // Useful for wrapping in a per-page basis
        enhanceComponent: (Component: any) => Component,
      })
      
      // Run the parent `getInitialProps`, it now includes the custom `renderPage`
      const initialProps = await Document.getInitialProps(ctx)
  
      return initialProps
  }

  render() {

      return (

          <Html lang='en'>

              <Head>

                <meta charSet="UTF-8" />
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
                <meta name="description" content="React-App" />
                <meta name="Keywords" content="next-app react-app typescript" />

                {/* bots tag */}
                <meta name="robots" content="all" />
                <meta name="googlebot" content="all" />

                {/* This tag tells Google not to show the sitelinks search box. */}
                <meta name="google" content="nositelinkssearchbox" key="sitelinks" />

                {/* This meta tag tells Google that you don't want them to provide a translation for this page. */}
                <meta name="google" content="notranslate" key="notranslate" />

                {/* fav icons */}
                <link rel="apple-touch-icon" sizes="180x180" href="../../../images/fav/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="../../../images/fav/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="../../../images/fav/favicon-16x16.png" />
                <link rel="icon" type="icon" href="../../../images/fav/favicon.ico" />
                <link rel="mask-icon" href="../../../images/fav/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />

                {/* metadata used when your app is installed on a mobile device */}
                <link rel="manifest" href="../../../manifest.json" />

                {/* t  */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@react-app" />
                <meta name="twitter:creator" content="@react-app" />
                <meta name="twitter:title" content="React-App" />
                <meta name="twitter:description" content="React app" />
                <meta name="twitter:image" content="" />

                {/* w */}
                <meta property="og:site_name" content="React-App.co" />
                <meta property="og:title" content="React-App" />
                <meta property="og:description" content="React app" />
                <meta property="og:image" itemProp="image" content="" />
                <meta property="og:type" content="website" />

              </Head>

              <body className='body'>
                  <Main />
                  <NextScript />
              </body>

          </Html>
      )
      
  }

}

export default AppDocument;
