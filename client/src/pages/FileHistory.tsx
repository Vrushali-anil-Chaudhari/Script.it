import  { useEffect, useState } from 'react';
import HistorySkeleton from '../states/HistorySkeleton';
import { useModalContext } from '../context/context';
import { Button } from '../components/ui/Button';
import { Trash2 } from 'lucide-react';

const FileHistory = () => {
  const { GetUploadedFiles, deletedSingleFile } = useModalContext();
  const [files, setFiles] = useState<string[] | null>(null);

  const fetchFiles = async () => {
    const data = await GetUploadedFiles();
    if (data && data.files) {
      setFiles(data.files);
    } else {
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [deletedSingleFile]);

  useEffect(() => {
    if (files !== null) {
      fetchFiles();
    }
  }, [deletedSingleFile]);

  return (
    <div className='w-full h-full overflow-auto p-5'>
      <p className='pt-4 pb-10 text-reddish text-xl text-center'>Uploaded Files History</p>
      {files === null ? (
        <HistorySkeleton />
      ) : files.length === 0 ? (
        <div className='w-full flex items-center justify-center'>
            <div className='border border-dashed bg-blue-50 border-blue-600 text-blue-700 py-1 px-4 rounded-full'>
                <p className='text-center'>No File found</p>
            </div>
        </div>
      ) : (
        <div className='flex flex-col gap-3 max-w-3xl w-full mx-auto'>
          {files.map((file) => (
            <div key={file} className='border border-subTextGrey/20 bg-white w-full h-[70px] rounded-xl flex justify-between items-center px-4'>
              <div>
                <p>{file}</p>
              </div>
              <div className='flex gap-2'>
                <div className='border border-dashed py-1 px-4 rounded-full bg-green-50 border-green-600 text-green-700'>
                  <p>Success</p>
                </div>
                <Button onClick={() => deletedSingleFile(file)} type='button' iconType='icon' Icon={Trash2} className='bg-red-700'>
                  Delete File
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileHistory;
