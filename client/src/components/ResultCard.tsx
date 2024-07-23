import { Text } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Drawer from './Drawer'
import { useModalContext } from '../context/context'

interface ResultCardProps {
  isOpen: boolean
  setOpen: (value: boolean) => void,
  data: {
    data: string
    document_key: string
  }
}

const ResultCard = ({ isOpen, setOpen, data }: ResultCardProps) => {
  const { GetFileContent , setFileContent } = useModalContext();

  // const [searchData , setSearchData] = useState("");


  const handleViewDocument=()=>{
    GetFileContent(data.document_key).then((data)=>{
      if(!data) return;
      setFileContent(data.text)
   })
  }
  return (
    <>
      {/* w-[250px] h-[120px]  */}
      <div onClick={() => setOpen(true)} className='border border-subTextGrey/5 bg-reddish/5 w-full sm:w-full rounded-xl p-5 cursor-pointer'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center justify-center rounded-full size-10 bg-white border border-border'>
            <Text className='text-reddish' />
          </div>
          <p className='font-medium'>{data.document_key}</p>
        </div>
        <div className='pt-4 flex flex-col gap-3'>
          <div className='max-w-[320px] w-full'>
            <p className='font-normal text-subTextGrey truncate'>{data.data}</p>
          </div>
          <p onClick={handleViewDocument} className='text-reddish'>View Document</p>
        </div>
      </div>
      {
        isOpen ? <Drawer setOpen={setOpen} data={data} isOpen={isOpen} /> : null
      }
    </>
  )
}

export default ResultCard