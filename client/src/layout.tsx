import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Toaster } from 'sonner';
import { ModalProvider } from './context/context';
import { AuthProvider } from './context/Auth.context';
import { useLocation } from 'react-router-dom';
type LayoutProps = {
  children: React.ReactNode
}
const Layout = ({ children }: LayoutProps) => {
  const {pathname} = useLocation()
  return (
    <>
      <div className={`flex flex-col w-full tracking-tighter relative`}>
        <AuthProvider>
          <ModalProvider>
            <Navbar />
            <div className={`max-w-[1450px] mx-auto px-4 w-full ${pathname !== "/search" ? "lg:h-[calc(100vh-140px)]" : "lg:h-[calc(100vh-140px)]" }`}>
              {children}
            </div>
            {/* <div className={`max-w-[1450px] mx-auto px-4 w-full ${pathname !== "/search" ? "lg:h-[calc(100vh-140px)]" : "lg:h-[calc(100vh-140px)]" }`}>
              {children}
            </div> */}
            <Footer />
            <Toaster />
          </ModalProvider>
        </AuthProvider>
      </div>
    </>
  )
}

export default Layout

{/* <div className={`tracking-tighter flex flex-col h-screen w-full relative overflow-auto`}>
        <AuthProvider>
          <ModalProvider>
            <Navbar />
            <div className='max-w-[1450px] mx-auto px-4 w-full lg:h-[calc(100vh-140px)]'>
              {children}
            </div>
            <Footer />
            <Toaster />
          </ModalProvider>
        </AuthProvider>
      </div> */}