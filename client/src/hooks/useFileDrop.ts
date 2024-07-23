import { useState } from "react";
type FileDropProps = {
  onDrop: (file:File[])=>void
}
const useFileDrop=({onDrop}:FileDropProps)=>{
    const [isDragActive , setIsDragActive] = useState<boolean>(false);

    const handleDrop=(e:React.DragEvent)=>{
      e.preventDefault();

      const file = Array.from(e.dataTransfer.files) as File[];
      console.log('dropped file is ',file);
      onDrop(file)

      setIsDragActive(false)
      console.log('Yes file is dropped !');
    }

    const handleDragEnter=(e:React.DragEvent)=>{
        e.preventDefault();

        console.log('yes drag entered !');
        setIsDragActive(true)
    }

    const handleDragLeave=(e:React.DragEvent)=>{
      e.preventDefault();

      console.log('yes drag left !');
      setIsDragActive(false)
    }

    const handleDragOver=(e:React.DragEvent)=>{
       e.preventDefault();
    }

    return {
      isDragActive,
      handleDragEnter,
      handleDragLeave,
      handleDrop,
      handleDragOver
    }
}
export default useFileDrop;