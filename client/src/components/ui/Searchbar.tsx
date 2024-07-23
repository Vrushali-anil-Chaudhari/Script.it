import React, { useState } from 'react'
import { useModalContext } from '../../context/context';
import { toast } from 'sonner';
import { API_URL } from '../../config/apiconfig';

const Searchbar = () => {
    const {files , handleQuery} = useModalContext();
    console.log('files',files);
    const [search , setSearch] = useState("");
    
    const handleSearch=async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        console.log('api call NOT started');

        // if(!files.length){
        //     toast.error("First upload one file before searching content", {
        //         className: "p-4 text-red-400"
        //     })
        //     return;
        // }

        // API call :
        console.log('api call started');
        const searchFormData = new FormData();
        searchFormData.append("query",search)
        handleQuery(searchFormData)

    }
    return (
        <>
            <div className=''>
                <form onSubmit={handleSearch} className='flex'>
                    <input type="search" onChange={(e)=>setSearch(e.target.value)}  placeholder='Eg: Implement Pub-sub architecture' className='flex-1 placeholder:text-xs pl-4 lg:placeholder:text-sm p-2 md:p-4 lg:p-6 rounded-full ring-offset-1 border focus:outline-reddish focus:bg-reddish/5 text-reddish focus:ring-2 focus:ring-reddish/10 transition-all duration-300' />
                </form>
            </div>
        </>
    )
}

export default Searchbar