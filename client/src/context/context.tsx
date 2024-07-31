import { createContext, ReactNode, useContext, useState } from "react";
import { apiRoutes } from "../config/apiconfig";
import { toast } from "sonner";


type TModalContext = {
    modal: boolean,
    openModal: () => void,
    closeModal: () => void,
    fileContent: string ,
    setFileContent: React.Dispatch<React.SetStateAction<string>>
    status: StatusResponse,
    setStatus: (status: StatusResponse) => void

    files: File[],
    setFiles: (file: File[] | []) => void,
    handleDrop: (acceptedFiles: File[]) => void
    GetUploadedFiles: () => Promise<FileHistory | undefined>;
    deletedSingleFile: (fileName: string) => void;
    GetFileContent:(fileName: string) => Promise<{text: string} | undefined>;

    searchQueryResponse: MutatedSearchResponse,
    setSearchQueryResponse?: React.Dispatch<React.SetStateAction<MutatedSearchResponse>>;
    isSearchResponseLoading: boolean
    setSearchResponseLoading: React.Dispatch<React.SetStateAction<boolean>>

    // taskId: string
    // setTaskId: React.Dispatch<React.SetStateAction<string>>

    handleQuery: (search: FormData) => void

    fileStatuses: FileStatus[],
    setFileStatuses: React.Dispatch<React.SetStateAction<FileStatus[]>>

}
type TModalProvider = {
    children: ReactNode
}
interface SearchResponse {
    results: {
        data: string[]
        document_key: string
    }[] | null,
    total_results: number
}

interface MutatedSearchResponse extends SearchResponse {
    query: string,
    message: string,
    error: string | Error
}



type StatusState = "SUCCESS" | "FAILED" | "IN_PROGRESS" | "IDLE"
interface StatusResponse {
    state: StatusState,
    IN_PROGRESS: number,
    result: { [key: string]: { document_key: string; job_status: StatusState } } | null;
    message: string
}

type FileStatus = {
    file: File,
    status: StatusState,
    IN_PROGRESS: number,
};

type FileHistory = {
    files: string[]
}

const ModalContext = createContext<TModalContext | null>(null);


export const useModalContext = () => {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error("useAPIContext must be inside the ModalProvider.")
    }
    else {
        return context;
    }
}


export const ModalProvider = ({ children }: TModalProvider) => {
    const access_token = localStorage.getItem("access_token") as string;
    const [modal, setModal] = useState<boolean>(false);
    // const [isUploading, setIsUploading] = useState<boolean>(false);
    const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
    const [fileContent , setFileContent] = useState<string>("")
    const [status, setStatus] = useState<StatusResponse>({
        state: "IDLE",
        IN_PROGRESS: 0,
        result: null,
        message: ""
    })
    const [isSearchResponseLoading, setSearchResponseLoading] = useState<boolean>(false);
    const [searchQueryResponse, setSearchQueryResponse] = useState<MutatedSearchResponse>({
        query: "",
        error: "",
        message: "",
        results: null,
        total_results: 0
    })

    const openModal = () => {
        setModal(true)
    }
    const closeModal = () => {
        setModal(false)
    }

    const [files, setFiles] = useState<File[] | []>([]);
    const handleDrop = async (acceptedFiles: File[]) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
        const initialFileStatuses = acceptedFiles.map(file => ({
            file,
            status: "IDLE" as StatusState,
            IN_PROGRESS: 0
        }));
        setFileStatuses(prevStatuses => [...prevStatuses, ...initialFileStatuses]);
        // setIsUploading(true);

        const fileFormData = new FormData();
        acceptedFiles.forEach((file) => {
            fileFormData.append("files", file);
        });

        try {
            const url = apiRoutes.files.upload as string;
            const response_upload = await fetch(url, {
                body: fileFormData,
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            });

            if (!response_upload.ok) {
                throw new Error(`HTTP error! Status: ${response_upload.status}`);
            }

            const responseData: { task_id: string } = await response_upload.json();
            const task_id = responseData.task_id;

            if (task_id) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                await pollStatus(task_id, acceptedFiles);
            } else {
                console.error('Received task_id is empty or undefined.');
            }

        } catch (error) {
            console.error('Upload Error:', error);
        } finally {
            // setIsUploading(false);
        }
    };
    console.log('status', status);

    const pollStatus = async (task_id: string, files: File[]) => {
        const checkInterval = 5000;

        const checkStatus = async () => {
            const statusResponse = await handleStatus(task_id);
            console.log('checkStatus',statusResponse);

            if (statusResponse?.state === "SUCCESS" || statusResponse?.state === "FAILED") {
                updateFileStatuses(statusResponse, files);
                console.log('Status Response:', statusResponse);
            } else {
                updateFileStatuses(statusResponse, files);
                setTimeout(checkStatus, checkInterval);
            }
        };

        checkStatus();
    };

    console.log('fileStatus', fileStatuses);
    const updateFileStatuses = (statusResponse: StatusResponse | undefined, files: File[]) => {
        if (!statusResponse || !statusResponse.result) return;

        console.log('statusResp', statusResponse.state);

        

        setFileStatuses(prevStatuses => {
            return prevStatuses.map(fileStatus => {
                const fileIndex = files.findIndex(file => file.name === fileStatus.file.name);
                if (fileIndex !== -1 && statusResponse.result![fileIndex]) {
                    setStatus({
                        state: statusResponse.result![fileIndex].job_status || (statusResponse.result![fileIndex].job_status === "FAILED" && "FAILED"),
                        message: statusResponse.message,
                        result: {},
                        IN_PROGRESS: 0
                    })
                    return {
                        ...fileStatus,
                        status: statusResponse.result![fileIndex].job_status || (statusResponse.result![fileIndex].job_status === "FAILED" && "FAILED")
                    };
                }
                return fileStatus;
            });
        });
    };

    const handleStatus = async (task_id: string): Promise<StatusResponse | undefined> => {
        try {
            const url = apiRoutes.tasks.getTaskStatus(task_id) as string;

            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData: StatusResponse = await response.json();

            return responseData;
        } catch (error) {
            console.error('Fetch Error:', error);
            return undefined;
        }
    };




    const handleQuery = async (searchFormData: FormData) => {
        const search = searchFormData.get("query") as string;
        if (!search) {
            console.log("Please enter the search query")
            toast.info("Please enter the search query",{
                className: "text-blue-600 px-4 py-3"
            })
            return;
        }

        try {
            setSearchResponseLoading(true)
            const response = await fetch(`${apiRoutes.files.searchFromFiles}`, {
                method: "POST",
                body: searchFormData,
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            })
            const {results , total_results ,query }: MutatedSearchResponse = await response.json();

            console.log('Searched Data' , results);

            setSearchQueryResponse({
                results,
                query,
                error: "",
                message: "Searched the document successfully !",
                total_results
            })
        } catch (error) {
            setSearchQueryResponse({
                query: search,
                error: (error as Error).message,
                message: "",
                results: null,
                total_results: 0
            })
        }
        finally {
            setSearchResponseLoading(false)
        }


    }

    const GetUploadedFiles = async (): Promise<FileHistory | undefined> => {
        try {
            const response = await fetch(`${apiRoutes.files.getUploadedFiles}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            })
            const { files }: FileHistory = await response.json();
            console.log('Get Uploaded Files', files);

            return {
                files: files
            }

        } catch (error) {
            return {
                files: Array.from((error as Error).message)
            }
        }
    }

    const deletedSingleFile = async (fileName: string) => {
        try {
            const response = await fetch(`${apiRoutes.files.deleteSingleFile(fileName)}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            });

            const respData = await response.json();

            if (respData && respData.status) {
                toast.success("File deleted successfully done", {
                    className: "text-green-600 px-4 py-3"
                })
            }

        } catch (error) {
            toast.error((error as Error).message)
        }

    }

    const GetFileContent=async(fileName:string):Promise<{text: string} | undefined>=>{
        try {
            const response = await fetch(`${apiRoutes.files.getFileContent(fileName)}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            });

            const {text}:{text: string} = await response.json();
            return {
                text
            }

        } catch (error) {
            toast.error((error as Error).message,  {
                className: "text-red-600 px-4 py-3"
            })
            return {
                text: "No file content found !"
            }
        }
    }
    return (
        <ModalContext.Provider value={{ modal, openModal, closeModal, files, handleDrop, setFiles, status, setStatus, handleQuery, searchQueryResponse, isSearchResponseLoading, setSearchResponseLoading, fileStatuses, setFileStatuses, GetUploadedFiles, deletedSingleFile , GetFileContent , fileContent , setFileContent}}>
            {children}
        </ModalContext.Provider>
    )
}