import { Text } from 'lucide-react'
import Drawer from './Drawer'
import { useModalContext } from '../context/context'
import { useState } from 'react'

interface ResultCardProps {
  isOpen: boolean
  setOpen: (value: boolean) => void,
  data: {
    data: string
    document_key: string
  }
}

const ResultCard = ({ data }: ResultCardProps) => {
  const { GetFileContent, setFileContent } = useModalContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<{ data: string, document_key: string } | null>(null);

  const handleViewDocument = () => {
    console.log('clicked On Data with Document key : => ', data, "with key", data.document_key);
    GetFileContent(data.document_key).then((fileData) => {
      if (!fileData) return;
      setFileContent(fileData.text);
      setDrawerData({ data: data.data, document_key: data.document_key });
      setIsDrawerOpen(true);
    });
  }

  return (
    <>
      <div className='border border-subTextGrey/5 bg-reddish/5 w-full sm:w-full rounded-xl p-5 cursor-pointer'>
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
        isDrawerOpen && drawerData && (
          <Drawer
            setOpen={setIsDrawerOpen}
            data={drawerData}
            isOpen={isDrawerOpen}
          />
        )
      }
    </>
  )
}

export default ResultCard;
