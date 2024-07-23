import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='md:h-[80px] h-fit flex items-center border-t w-full px-4'>
        <div className='flex sm:flex-col flex-col md:flex-row md:items-center gap-4 max-w-[1450px] mx-auto py-4 w-full '>
            <div className='flex flex-col sm:flex-col md:flex-row md:items-center justify-between w-full gap-1 sm:gap-1 md:gap-8'>
                <div className='flex items-center gap-1'>
                    <img src="/public/assets/revise-loop-icon-xs.svg" alt="" className='size-4'/>
                    <p className='text-xl font-medium tracking-tighter'>Script.it</p>
                </div>
                <div className='flex w-full justify-between text-xs'>
                    <h1>Built by <Link to={`https://www.trufflepig.ai/`} className='underline font-semibold'>TrufflePig</Link>. The source code is available on <Link to={`https://github.com/`} className='hover:underline'>Github</Link>.</h1>
                </div>
            </div>
            {/* <div className='flex md:items-center gap-7'>
                <Link to={`/`} className='hover:underline text-nowrap'>Create Quiz</Link>    
                <Link to={`/`} className='hover:underline text-nowrap'>Generate Flashcard</Link>    
            </div> */}
        </div>
    </div>
  )
}

export default Footer