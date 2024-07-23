import React, { useEffect } from 'react'
import { Button } from '../components/ui/Button'
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, SigninSchema } from '../utils/validation';
import { FieldValues, useForm } from 'react-hook-form';
import { useAuth } from '../context/Auth.context';
import { z } from 'zod';
import { toast } from 'sonner';

type LoginSchemaType = z.infer<typeof SigninSchema>;

const Signin = () => {
  const { Signin, user, auth, Logout } = useAuth();
  const navigate = useNavigate();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(SigninSchema)
  })

  console.log('user', user);
  console.log('auth', auth);
  const {
    register,
    handleSubmit,
    formState: {
      isSubmitting,
      errors,
    },
    setError,
    clearErrors
  } = form;

  const onSubmit =async(values: LoginSchemaType) => {
    console.log('FieldValues', values);
    const data = new FormData()
    for (const key in values) {
      // @ts-ignore
      data.append(key, values[key])
    }
    const response = await Signin(data);

    if(response?.error){
      setError("root", {
        type: "manual",
        message: response?.error
      })
    }
    if (response?.data) {
      console.log('YESSSSSS');
      clearErrors("root");
      navigate("/search")
      toast.success("Successfully LoggedIn !", {
        className: "text-green-500 py-3 px-4"
      })
    }
    clearErrors("root");

  }


  // Just for auto set error 
  useEffect(() => {
    if (user?.message) {
      setError("root", { message: user?.message })
    }
  }, [user])

  console.log('user msg', user?.message);
  return (
    <div className='flex  w-full h-[calc(100vh-140px)] overflow-auto p-4 md:p-0 items-center justify-center'>
      <div className='h-full md:w-2/3 px-4  md:border-r border-border flex items-center justify-center '>
        <div className='md:w-3/4 md:max-w-4xl w-full'>
          <h1 className='text-3xl pb-2 font-medium'>Sign in</h1>
          <h1 className='text-textgray'>New to Script.it ? <a href={`/signup`} className='text-blue-600 cursor-pointer'>Sign up for an account.</a></h1>
          <form noValidate onSubmit={handleSubmit(onSubmit)} className='py-4 flex flex-col gap-4'>
            {
              errors.root && (<div className="text-red-500 text-sm">{errors.root.message}</div>)
            }
            <div className='flex flex-col gap-2'>
              <label htmlFor="">Username</label>
              <input {...register("username", {
                required: "username is Required !"
              })} type="text" id='username' name='username' className={`py-2 px-2 border-subTextGrey bg-input-background outline-none rounded-lg border focus:outline ${errors.username ? "border-primary-red outline-red-400" : "focus:outline-primary-blue focus:border-blue-400"}  transition-colors duration-100 focus:bg-secondary-black`} />
              {
                errors.username && (<div className="text-red-500">{errors.username.message}</div>)
              }
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="">Password</label>
              <input {...register("password", {
                required: "Password is Required !"
              })} type="password" id='password' name='password' className={`py-2 px-2 border-subTextGrey bg-input-background outline-none rounded-lg border focus:outline ${errors.password ? "border-primary-red outline-red-400" : "focus:outline-primary-blue focus:border-blue-400"}  transition-colors duration-100 focus:bg-secondary-black`} />
              {
                errors.password && (<div className="text-red-500">{errors.password.message}</div>)
              }
            </div>
            <div className='flex flex-col gap-2'>
              <Button disabled={isSubmitting} type="submit" id='sign-in-btn'>
                {isSubmitting ? "Loading..." : "Sign in"}
              </Button>
              {/* <button disabled={isSubmitting} type="submit" id='sign-in-btn' className='py-2 px-2 border-input-border text-secondary-black font-semibold outline-none rounded-lg border bg-textwhite transition-colors duration-100'>{isSubmitting ? "Loading..." : "Sign in"}</button> */}
            </div>

          </form>
        </div>
      </div>

      <div className='hidden lg:flex w-full bg-reddish/[6%] h-full items-center justify-center'>
        <h1 className="flex text-black items-center text-5xl font-semibold pl-20">
          Dive Into
          <span className="relative ml-3 h-[1em] w-36 overflow-hidden">
            <span
              className="absolute h-full w-full -translate-y-full animate-slide leading-none text-reddish"
            >
              Ideas
            </span>
            <span
              className="absolute h-full w-full -translate-y-full animate-slide leading-none text-reddish [animation-delay:0.83s]"
            >
              Tech
            </span>
            <span
              className="absolute h-full w-full -translate-y-full animate-slide leading-none text-reddish [animation-delay:1.83s]"
            >
              Art
            </span>
          </span>
        </h1>

      </div>
      {/* <img src="assets/revise-loop-icon-lg.svg" alt="" /> */}
    </div>
  )
}
export const GoogleIcon = () => {
  return <img src="/assets/google-ico.png" alt="" />
}
export default Signin;




{/* <div className='flex  w-full h-[calc(100vh-140px)] overflow-auto p-4 md:p-0'>
      <div className='w-full lg:w-2/3 flex flex-col justify-center items-center md:items-start'>
        <div className='flex flex-col lg:items-start lg:justify-start items-center justify-center'>
            <div className=''>
              <img src="/assets/revise-loop-icon-lg.svg" alt="" />
            </div>
            <div className='py-2 flex flex-col items-center lg:items-start'>
                <p className='text-4xl pb-5'>Sign in to Script.it</p>
                <input type="text" placeholder='Enter username' />
            </div>
        </div>
      </div>

      <div className='hidden lg:flex w-full bg-reddish/[6%] h-full items-center justify-center'>
        <h1 className="flex text-black items-center text-5xl font-semibold pl-20">
          Dive Into
          <span className="relative ml-3 h-[1em] w-36 overflow-hidden">
            <span
              className="absolute h-full w-full -translate-y-full animate-slide leading-none text-reddish"
            >
              Ideas
            </span>
            <span
              className="absolute h-full w-full -translate-y-full animate-slide leading-none text-reddish [animation-delay:0.83s]"
            >
              Tech
            </span>
            <span
              className="absolute h-full w-full -translate-y-full animate-slide leading-none text-reddish [animation-delay:1.83s]"
            >
              Art
            </span>
          </span>
        </h1>

      </div>
      {/* <img src="assets/revise-loop-icon-lg.svg" alt="" /> */}
// </div > */}