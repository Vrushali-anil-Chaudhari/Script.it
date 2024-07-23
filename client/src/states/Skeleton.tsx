import React from 'react'

const Skeleton = () => {
  return (
    <>
        <div className='flex gap-10 pt-12 justify-center w-full'>
            {
                Array.from({length: 3}).map((_,idx)=>(
                    <div className='border border-subTextGrey/5 bg-border w-full h-[120px] rounded-xl animate-pulse duration-100'></div>
                ))
            }
        </div>
    </>
  )
}

export default Skeleton