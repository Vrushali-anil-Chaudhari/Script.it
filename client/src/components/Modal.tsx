import { X } from 'lucide-react'
import FileDrop from './FileDrop'
import FileList from './FileList';
import { Button } from './ui/Button';
import { useModalContext } from '../context/context';
import {  apiRoutes } from '../config/apiconfig';
import { toast } from 'sonner';



const Modal = () => {
  const { closeModal, files, setFiles, handleDrop, modal , fileStatuses , setFileStatuses } = useModalContext();
  const access_token = localStorage.getItem("access_token") as string
  // const [files, setFiles] = useState<File[] | []>([]);

  // const handleDrop = (acceptedFiles: File[]) => {
  //   console.log('acceptedFiles', acceptedFiles);
  //   setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  // };

  console.log('final_files', fileStatuses);

  const handleClearFiles = async () => {
    try {
      const res = await fetch(`${apiRoutes.files.deleteAllFiles}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      });

      if (res.status === 200) {
        // files = await res.json() as string[];
        // const data = await res.json();
        setFiles([])
        setFileStatuses([])
      }
    } catch (error) {
      toast.error((error as Error).message, {
        className: "text-red-500 py-4 px-3"
      })
    }
  }

  return (
    <>
      <div className={`fixed backdrop-blur-sm bg-neutral-200/5 inset-0 flex items-center justify-center w-full h-full max-h-screen z-40 ${modal ? "animate-opacity-on" : "animate-opacity-off"}`}>
        <div className='max-w-3xl w-full h-fit max-h-screen  z-40 rounded-xl border shadow p-7 bg-white flex flex-col justify-between'>
          <div className=''>
            <div className='flex items-center justify-between'>
              <p className='text-xl font-medium'>Upload Files</p>
              <X onClick={closeModal} className='cursor-pointer' />
            </div>
            <div className='py-4 h-[230px]'>
              <FileDrop
                onDrop={handleDrop}
                config={{
                  manualFile: true,
                  mimeType: ".pdf"
                }}
              />
            </div>
          </div>
          <div className={`${files.length ? "h-[250px]" : null} overflow-auto`}>
            {/* //@ts-ignore */}
            <FileList files={fileStatuses}/>
    
          </div>
          <div className='w-full text-center flex items-center justify-center'>
            <div className='w-fit'>
              <Button variant='ghost' disabled={files.length ? false : true} onClick={handleClearFiles} className='w-fit disabled:text-subTextGrey text-reddish underline cursor-pointer'>Clear all files</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal;


