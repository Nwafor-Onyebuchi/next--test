import 'bootstrap/dist/css/bootstrap.min.css'
import '../../public/css/tabler.css'
import '../../public/fonts/icons/fad/css/all.min.css'
import '../../public/fonts/icons/fe/fe.css'
import '../../public/fonts/icons/cp/style.css'
import '../../public/fonts/webfont/clash/style.css'
import '../../public/fonts/webfont/friez/style.css'
import '../../public/css/style.css'
import '../../public/css/webfix.css'
import '../../public/css/custom.css'
import '../../public/css/select-box.css'
import '../../public/css/dashboard.css'
import '../../public/css/responsive.css'
import 'jquery/dist/jquery'
import 'jquery/dist/jquery.slim'
import '../helpers/jquery'
import type { AppProps } from 'next/app'

import UserState from '../context/user/userState'
import BlogState from '../context/blog/blogState'
import ResourceState from '../context/resource/resourceState'
import { Suspense } from 'react'
import loader from '../helpers/loader'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorUI from '@/components/global/ErrorUI'


// most app default
// => product
export default function App({ Component, pageProps }: AppProps) {

  const errorHandler = (err: any, info: any) => {
    console.log(err, 'logged error');
    console.log(info, 'logged error info');
  }


  return (
    <>
      <UserState>

        <BlogState>

          <ResourceState>

            <Suspense fallback={loader.MainLoader()}>

              <ErrorBoundary FallbackComponent={ErrorUI} onReset={() => window.location.reload()} onError={errorHandler}>

                { typeof(window) === undefined ? null : <Component {...pageProps} /> }
                {/* <Component {...pageProps} /> */}

              </ErrorBoundary>

            </Suspense>
            
          </ResourceState>

        </BlogState>

      </UserState>
    </>
  )
}
