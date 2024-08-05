import { Text } from 'lucide-react'
import { useModalContext } from '../context/context'
import { useState } from 'react'
import DocumentModal from './DocumentModal'

interface ResultCardProps {
  isOpen: boolean
  setOpen: (value: boolean) => void,
  data: {
    response: string,
    page: number,
    score: number,
    document_key: string,
    question: string

  }
}

const ResultCard = ({ data }: ResultCardProps) => {
  const { GetFileContent, setFileContent } = useModalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [documentData, setDocumentData] = useState<ResultCardProps["data"] | null>(null);

  const handleViewDocument = () => {
    setIsLoading(true)
    console.log('clicked On Data with Document key : => ', data, "with key", data.document_key , data.question);
    GetFileContent(data.document_key).then((fileData) => {
      if (!fileData) return;
      setFileContent(fileData.url);
      setDocumentData({
        response: data.response,
        page: data.page,
        score: data.score,
        document_key: data.document_key,
        question: data.question
      });
      setIsDrawerOpen(true);
      setIsLoading(false)
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
        <div className={`pt-4 flex flex-col gap-3 justify-start items-start ${isLoading ? "pl-20" : "pl-1"}`}>
          {/* <div className='max-w-[320px] w-full'>
            <p className='font-normal text-subTextGrey truncate'>{data.data}</p>
          </div> */}
          {
            isLoading ? (
              <>
                <span className="loader"></span>
              </>
            ) : (
              <p onClick={handleViewDocument} className='text-reddish'>View Document</p>
            )
          }
        </div>
      </div>
      {
        isDrawerOpen && documentData && (
          <DocumentModal
            setOpen={setIsDrawerOpen}
            data={documentData}
            isOpen={isDrawerOpen}
          />
          // <Drawer
          //   setOpen={setIsDrawerOpen}
          //   data={documentData}
          //   isOpen={isDrawerOpen}
          // />
        )
      }
    </>
  )
}

export default ResultCard;
