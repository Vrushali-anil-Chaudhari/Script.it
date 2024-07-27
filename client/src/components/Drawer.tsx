import { X } from 'lucide-react'
import Highlighter from './Highligher'
import { useModalContext } from '../context/context'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type DrawerProps = {
  isOpen: boolean,
  setOpen: (value: boolean) => void,
  data: {
    data: string
    document_key: string
  }
}
const Drawer = ({setOpen, data: {
  data, document_key
} }: DrawerProps) => {
  const { searchQueryResponse  , fileContent} = useModalContext();

  // const [searchData , setSearchData] = useState("");

  // useEffect(()=>{
  //   GetFileContent(document_key).then((data)=>{
  //      if(!data) return;

  //      setSearchData(data.text)
  //   })
  // },[])

  console.log('searchQueryResponse',searchQueryResponse);
  // console.log("fileContent " , fileContent);
  return (
    <>
      {/* bg-neutral-200/5 */}
      <div className={`fixed backdrop-blur-sm bg-neutral-200/5  inset-0 flex flex-col justify-end w-full h-full max-h-screen z-40`}>
        <div className={`w-full h-[700px] z-40 rounded-tl-3xl rounded-tr-3xl border bg-white flex flex-col justify-between animate-drawer drop-shadow-2xl pb-2`}>
          <div className='w-full'>
            <div className='w-full p-5 flex justify-end border-b animate-blur'>
              <div className='w-full flex items-center text-left justify-start md:justify-center md:text-center gap-2'>
                <div className='size-2 bg-[#00D254] rounded-full' />
                <p className='font-medium'>{document_key || "N/A"} <span className='text-subTextGrey/60 font-extralight'>( Total 4 results found )</span></p>
              </div>
              <X onClick={() => setOpen(false)} className='cursor-pointer' />
            </div>
            <div className='w-full h-screen overflow-auto scroll-smooth'>
              <div className='w-full h-full p-8 leading-loose'>
              {/* <Markdown remarkPlugins={[remarkGfm]} > */}
                <Highlighter content={fileContent} query={data} />
              {/* </Markdown> */}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Drawer