import { useModalContext } from "../context/context";


const Skeleton = () => {
  const { isSearchResponseLoading } = useModalContext();
  return (
    <>
        <div className={`flex ${isSearchResponseLoading ? "flex-col lg:flex-row" : "flex-row"} gap-10 pt-12 justify-center w-full`}>
            {
                Array.from({length: 3}).map((_,idx)=>(
                    <div key={idx} className='border border-subTextGrey/5 bg-border w-full h-[120px] rounded-xl animate-pulse duration-100'></div>
                ))
            }
        </div>
    </>
  )
}

export default Skeleton