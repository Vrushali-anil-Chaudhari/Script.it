import { File } from 'lucide-react'
import React from 'react'
import { useModalContext } from '../context/context';

type StatusState = "SUCCESS" | "FAILED" | "PROGRESS" | "IDLE"

interface StatusResponse {
    state: StatusState,
    IN_PROGRESS: number,
    result: {
        [key: number]: {
            document_key: string,
            job_status: "SUCCESS" | "FAILED" | "IN_PROGRESS" | "IDLE"
        }
    } | null,
    message: string
}

const FileRow = ({ files }: {
    files: {
        file: File,
        status:  "SUCCESS" | "FAILED" | "IN_PROGRESS" | "IDLE",
        progress: number
    },
}) => {
    // const { files, openModal, status } = useModalContext();

    const STATUS_CLASSES = {
        IN_PROGRESS: "text-orange-600",
        SUCCESS: "text-green-600",
        FAILED: "text-red-600",
        IDLE: ""
    }

    console.log('files in ROW',files);
    return (
        <>
            <div className='w-full h-[65px] bg-white border hover:bg-reddish/10 transition-colors py-2 px-4 rounded-lg animate-opacityToBottom'>
                <div className='flex items-center gap-3'>
                    <File className='text-reddish/40' />
                    <div className='flex justify-between items-center w-full'>
                        <div className='flex-1 flex-col'>
                            <p className='truncate max-w-[100px] sm:max-w-[100px] md:max-w-[130px] lg:max-w-[200px]'>{files.file.name}</p>
                            <p className='uppercase text-sm'>{files.file.type.split("/")[1]}</p>
                        </div>
                        <p className={`${STATUS_CLASSES[files.status]} text-sm`}>
                            {files.status === "FAILED" && "Failed"}
                            {files.status === "SUCCESS" && "Success"}
                            {files.status === "IN_PROGRESS" && `In progress`}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FileRow