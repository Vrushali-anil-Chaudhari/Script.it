import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Toaster } from 'sonner';
import { ModalProvider } from './context/context';
import { AuthProvider } from './context/Auth.context';
// import { useLocation } from 'react-router-dom';
type LayoutProps = {
  children: React.ReactNode
}
const Layout = ({ children }: LayoutProps) => {
  // const {pathname} = useLocation()
  return (
    <>
      <div className={`w-full flex flex-col justify-between max-h-screen h-screen overflow-auto`}>
        <AuthProvider>
          <ModalProvider>
            <div className=''>
              <Navbar />
              <div className={`max-w-[1450px] w-full mx-auto px-4`}>
                {children}
              </div>
            </div>
            <Footer />
            <Toaster />
          </ModalProvider>
        </AuthProvider>
      </div>
        {/* <AuthProvider>
          <ModalProvider>
            <Navbar />
            <div className={`max-w-[1450px] bg-red-400 mx-auto px-4 w-full ${pathname !== "/search" ? "lg:h-[calc(100vh-140px)]" : "h-fit" }`}>
              {children}
            </div>
            <Footer />
            <Toaster />
          </ModalProvider>
        </AuthProvider>
      </div> */}
    </>
  )
}

export default Layout