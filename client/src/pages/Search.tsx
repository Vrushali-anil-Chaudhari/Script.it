import React, { useState } from 'react'
import Modal from '../components/Modal'
import { useModalContext } from '../context/context';
import Skeleton from '../states/Skeleton';
import ResultCard from '../components/ResultCard';
import Searchbar from '../components/ui/Searchbar';
import { Button } from '../components/ui/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Drawer from '../components/Drawer';

const Search = () => {
  const { modal, searchQueryResponse } = useModalContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)


  console.log('searchQueryResponse', searchQueryResponse);

  return (
    <>
      <div className='max-w-[1150px] mx-auto flex flex-col w-full h-full pt-4 px-4'>
        <div className='pt-8 flex flex-col gap-3 items-center justify-center'>
          <p className='uppercase italic font-medium text-[0.6rem] md:text-xs text-subTextGrey'>SEARCH • ORGANIZE • CREATE</p>
          <div className='flex gap-2 font-extrabold text-lg md:text-2xl lg:text-4xl items-center'>
            <img src="/public/assets/truffle-logo.svg" alt="" className='w-10' />
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
            {/* <div className='flex items-center gap-4'>
              <Button disabled={true} type='button' variant='primary' iconType='icon' Icon={ArrowLeft}>Left</Button>
              <p>1</p>
              <Button type='button' variant='primary' iconType='icon' Icon={ArrowRight}>Right</Button>
            </div> */}
          </div>

            <div className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center place-items-center gap-4 w-full py-10`}>
              {
                searchQueryResponse.results?.map((searchedData) => (
                  <ResultCard data={searchedData} isOpen={isDrawerOpen} setOpen={setIsDrawerOpen} />
                ))
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