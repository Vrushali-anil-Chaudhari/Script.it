
const HistorySkeleton = () => {
    return (
        <div className='flex flex-col gap-5 pt-12 justify-center w-full max-w-3xl items-center mx-auto'>
            {
                Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className='border border-subTextGrey/5 bg-border w-full h-[70px] rounded-xl animate-pulse duration-100'></div>
                ))
            }
        </div>
    )
}

export default HistorySkeleton