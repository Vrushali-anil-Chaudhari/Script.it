import { useAuth } from '../../../context/Auth.context';
import { useModalContext } from '../../../context/context';



const Avatar = () => {
    const {Logout , loggedInUser} = useAuth();
    const {setFiles , setFileStatuses} = useModalContext();
    const refresh_token = localStorage.getItem("refresh_token") as string
    

    // useMemo(()=>{
    //     getUser().then((user_data)=>{
    //         if(user_data){
    //             const {username,email} = user_data;
    //             setUser({
    //                 username,
    //                 email,
    //             });
    //         }
    //     })
    // },[getUser , access_token])

    const onSubmit=()=>{
        const data = new FormData()
        data.append("refresh",refresh_token)
        Logout(data)
        setFiles([])
        setFileStatuses([])
    }

    return (
        
        <div className='flex items-center gap-2 h-fit'>
            {
                loggedInUser ? (
                    <div className='flex bg-red-4s0 items-center gap-2'>
                        <div className='h-fit flex flex-col text-left'>
                            <p className='font-medium'>{loggedInUser.username}</p>
                            <p className='text-xs -mt-1.5 text-subTextGrey'>{loggedInUser.email}</p>
                        </div>
                        <span>/</span>
                        <p onClick={onSubmit} className={`text-red-600 underline cursor-pointer`}>Logout</p>
                    </div>
                ) : null
            }
        </div>
    )
}

export default Avatar