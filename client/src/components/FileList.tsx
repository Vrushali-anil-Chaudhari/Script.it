import FileRow from './FileRow'

type FileListProps = {
    files: {
        file: File,
        status: "SUCCESS" | "FAILED" | "IN_PROGRESS" | "IDLE",
        progress?: number
    }[],
}
const FileList = ({files}:FileListProps) => {
    return (
        files?.map((file) => {
            console.log('mappedFile',file);
            return (
                <>
                    <FileRow files={file} />
                </>
            )
        })
    )
}

export default FileList