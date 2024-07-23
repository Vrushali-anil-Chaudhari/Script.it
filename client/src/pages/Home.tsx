import { Button } from '../components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <>
            <section className='pb-20 pt-4 h-full w-full'>
                <div className='flex flex-col sm:flex-col lg:flex-row lg:justify-between md:gap-5'>
                    <div className='w-full lg:w-2/3 flex flex-col items-start py-36'>
                        <h1 className='font-medium text-5xl sm:text-5xl md:text-5xl tracking-tighter'>
                            Revolutionize TV Show
                            Planning with Enhanced
                            <br />Search Capabilities
                        </h1>
                        <div className='py-8 text-lg leading-tight tracking-tight'>
                            <p className='w-full text-subTextGrey'>
                                Transform TV planning with our advanced search.
                                <br className='hidden lg:block'/>Say goodbye to endless searches and hello to efficiency.
                                <br className='hidden lg:block'/>Seamlessly integrate our innovative solution with your tools
                                <br className='hidden lg:block'/> revolutionizing document management.
                            </p>
                        </div>
                        <div className='flex flex-col gap-4'>
                            <p>Want to use Script.it ?</p>
                            <Link to={'/signin'}>
                                <Button type='button' className='w-[150px]' variant='primary' iconType='trailing' Icon={ArrowRight}>Get Started</Button>
                            </Link>
                        </div>
                    </div>
                    <div className='flex md:w-[800px] md:h-[500px]'>
                        <img src="assets/flow-diagram2.svg" alt="" className='w-full h-full object-contain' />
                    </div>
                </div>
            </section>
        </> 
    )
}

export default Home