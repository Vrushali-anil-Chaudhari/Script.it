import useFileDrop from "../hooks/useFileDrop"
import { validateFile } from "../utils/fileValidator"
import { toast } from 'sonner';


// types
type ConfigTypes = {
    manualFile?: boolean,
    mimeType?: ".pdf"
}
type FileDropProps = {
    onDrop: (file: File[]) => void,
    config: ConfigTypes
}



// File Schema
const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const FileDrop = ({ onDrop, config: { manualFile, mimeType } }: FileDropProps) => {
    const { isDragActive, handleDragEnter, handleDragLeave, handleDrop, handleDragOver } = useFileDrop({
        onDrop: (files) => {
            const validFiles = files.filter(file => {
                const result = validateFile(file, MAX_SIZE);
                if (!result.success) {
                    toast.error(result.error.errors[0].message, {
                        className: "p-4 text-red-400"
                    })
                    return false;
                }
                return true;
            });
            onDrop(validFiles);
        }
    })
    const handleManualFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!e.target.files) {
          return;
        }
        const files = Array.from(e.target.files) as File[];
        const validFiles = files.filter(file => {
          const result = validateFile(file, MAX_SIZE);
          if (!result.success) {
            toast.error(result.error.errors[0].message, {
                className: "p-4 text-red-400"
            })
            return false;
          }
          return true;
        });
        onDrop(validFiles);
      };
    
    return (
        <>
            <div onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop} onDragOver={handleDragOver} className={`h-full max-h-[250px] border border-dashed border-black rounded-lg ${isDragActive ? "bg-reddish/20" : "bg-none"}`}>
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    {
                        isDragActive ? <div className="bg-blue-400">
                            <p>JUST DROP HERE FILES</p>
                        </div> : (
                            <>
                                <img src="assets/file-upload.svg" alt="" />
                                <div className='flex flex-col items-center justify-center cursor-default text-xs sm:text-xs md:text-sm'>
                                    <input multiple onChange={(e) => handleManualFileUpload(e)} type="file" name="file" id="file" hidden />
                                    <div className="inline-flex gap-2">
                                        {
                                            manualFile ? <p onClick={() => document.getElementById("file")?.click()} className="underline cursor-pointer">Click to upload</p> : <p className="underline cursor-pointer">Click to upload</p>
                                        }

                                        <span>or Drag and Drop</span>
                                    </div>
                                    {/* <p className="underline">Click to upload or <span>drag and drop</span></p> */}
                                    <p>Maximum file size 2mb</p>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default FileDrop;