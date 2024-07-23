import { Button } from './ui/Button'
import { Menu, MoveRight } from 'lucide-react'
import UploadStatus from './UploadStatus';
import { Link, useLocation } from 'react-router-dom';
import Avatar from './ui/Avatar/Avatar';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/Auth.context';
type User = {
    username: string;
    email?: string,
};

const Navbar = () => {
    const { pathname } = useLocation();

    const [ham, setHam] = useState<boolean>(false);
    const { getUser  , loggedInUser} = useAuth();

    useEffect(() => {
        getUser()
    }, [])


    return (
        <>
            <div className='h-[60px] border-b border-border px-4 py-2 relative'>
                <div className='flex items-center h-full w-full max-w-[1450px] mx-auto justify-between '>
                    <Link to={'/'} className='flex items-center gap-1 w-fit pr-4'>
                        <img src="/public/assets/revise-loop-icon-xs.svg" alt="" className='size-4' />
                        <p className='text-xl font-medium tracking-tighter'>Script.it</p>

                    </Link>
                    <div className='hidden lg:flex items-center gap-8 w-full justify-between'>

                        {
                            loggedInUser ?
                                <div className='pl-6'>
                                    <Avatar />
                                </div> : <div className='pl-6' />
                        }
                        <div className='flex items-center gap-8'>
                            {
                                !loggedInUser && (pathname == "/") ? (
                                    <>
                                        <Link to={"/search"} className=''>
                                            <Button type='button' variant='ghost' className='text-black border'>
                                                <div className='flex items-center gap-1.5 '>
                                                    <h1>Go to Search Page</h1>
                                                    <MoveRight size={14} />
                                                </div>
                                            </Button>
                                        </Link>
                                    </>
                                ) : null
                            }
                            {
                                loggedInUser ? ( 
                                    <>
                                        <Link to={'/signin'} className='cursor-pointer'>Login</Link>
                                        <Link to={'/signup'}>
                                            <Button type='button' variant='primary' >
                                                <div className='flex items-center gap-1.5 '>
                                                    <h1>Sign up</h1>
                                                    <MoveRight size={14} />
                                                </div>
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to={'/history'}>
                                            <Button type='button' variant='secondary' className='border border-subTextGrey'>
                                                Files History
                                            </Button>
                                        </Link>
                                        <UploadStatus />
                                    </>
                                )
                            }
                        </div>
                    </div>
                    <div className='flex lg:hidden relative '>
                        <div onClick={() => setHam((prev) => !prev)} className='bg-neutral-100 rounded-lg px-1.5 py-1 cursor-pointer'>
                            <Menu />
                        </div>
                    </div>

                    {/* Mobile Ham menu nav */}
                    {
                        ham ? (
                            <div className='lg:hidden absolute right-4 top-12  w-[450px] bg-white shadow rounded-lg p-3 flex flex-col-reverse items-center'>
                                <div className='pb-4'>
                                    <Avatar />
                                </div>
                                <div className='flex h-[110px] flex- items-center'>
                                    {
                                        !loggedInUser ? (
                                            <>
                                                <h1 className='cursor-pointer'>Login</h1>
                                                <Button type='button' variant='primary' >
                                                    <div className='flex items-center gap-1.5 '>
                                                        <h1>Sign up</h1>
                                                        <MoveRight size={14} />
                                                    </div>
                                                </Button>
                                            </>
                                        ) : (
                                            <UploadStatus />
                                        )
                                    }
                                </div>
                            </div>
                        ) : null
                    }
                </div>
            </div>
        </>
    )
}

export default Navbar