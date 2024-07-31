import { useState } from 'react'
import Modal from '../components/Modal'
import { useModalContext } from '../context/context';
import ResultCard from '../components/ResultCard';
import Searchbar from '../components/ui/Searchbar';
import Skeleton from '../states/Skeleton';


const Search = () => {
  const { modal, searchQueryResponse, isSearchResponseLoading } = useModalContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)


  console.log('searchQueryResponse', searchQueryResponse);

  return (
    <>
      <div className='max-w-[1150px] mx-auto flex flex-col w-full h-full pt-4 px-4'>
        <div className='pt-8 flex flex-col gap-3 items-center justify-center'>
          <p className='uppercase italic font-medium text-[0.6rem] md:text-xs text-subTextGrey'>SEARCH • ORGANIZE • CREATE</p>
          <div className='flex gap-2 font-extrabold text-lg md:text-2xl lg:text-4xl items-center'>
            <img src="/assets/truffle-logo.svg" alt="" className='w-10' />
            <p>x Script.it</p>
          </div>
          <p className='text-subTextGrey pt-5 text-xs md:text-sm lg:text-lg'>“ Find the story you've been searching for. “</p>
        </div>
        <div className='py-10'>
          <Searchbar />
        </div>

        <div>
          <div className='flex items-center justify-between px-4'>
            <p className='text-subTextGrey text-xs sm:text-xs md:text-sm text-left md:text-center'>Total {searchQueryResponse.total_results} Results found </p>
          </div>

          <div className={` ${isSearchResponseLoading ? null : "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}  justify-center place-items-center gap-4 w-full py-10`}>
            {
              isSearchResponseLoading ? <Skeleton /> : searchQueryResponse?.results?.length === 0 ? <p className='py-6'>No Relevant Results found!</p> : searchQueryResponse.results?.map((searchedData) => {
                console.log('each data mapped', searchedData);
                return (
                  <ResultCard data={searchedData} isOpen={isDrawerOpen} setOpen={setIsDrawerOpen} />
                );
              })
            }
          </div>

        </div >
        {
          modal && <Modal />
        }
      </div >
    </>
  )
}

export default Search