import React, { useEffect } from 'react'
import { Button } from '../components/ui/Button'
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '../utils/validation';
import { FieldValues, useForm } from 'react-hook-form';
import { useAuth } from '../context/Auth.context';
import { z } from 'zod';
import { CircleUser, Lock, Mail, User2, UserIcon, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

type LoginSchemaType = z.infer<typeof LoginSchema>;

const Signup = () => {
  const { SignUp, user, auth, Logout } = useAuth();
  const navigate = useNavigate();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema)
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

  const onSubmit = async (values: LoginSchemaType) => {
    console.log('FieldValues', values);
    const data = new FormData()
    for (const key in values) {
      // @ts-ignore
      data.append(key, values[key])
    }
    const response = await SignUp(data);
    if (response?.error) {
      console.log('data from response', response.error);
      for (const [key, value] of Object.entries(response.error)) {
        console.log(`${key}: ${value}`);

        value.forEach((eachError) => {
          console.log('eachError', eachError);
          setError(key as any, {
            type: "manual",
            message: eachError
          })
        })

      }
    }
    if (response?.data) {
      console.log('YESSSSSS');
      clearErrors("root");
      navigate("/signin")
      toast.success("Successfully Registered !", {
        className: "text-green-500 py-3 px-4"
      })
    }



  }

  console.log('errors', errors.root);

  // Just for auto set error 
  useEffect(() => {
    if (user?.message) {
      setError("root", { message: user?.message })
    }
  }, [user])

  console.log('user msg', user?.message);
  return (
    <div className='flex  w-full h-full overflow-auto p-4 md:p-0 items-center justify-center'>
      <div className='h-full max-w-xl w-full px-4  md:border-r border-border flex items-center justify-center '>
        <div className=' w-full'>
          <h1 className='text-3xl pb-2 font-medium'>Sign up</h1>
          <h1 className='text-textgray'>Already have an account ? <a href={`/signin`} className='text-blue-600 cursor-pointer'>Sign in for an account.</a></h1>
          <form noValidate onSubmit={handleSubmit(onSubmit)} className='pt-3 flex flex-col gap-2'>
            {
              errors.root && (<p className="text-red-500 text-sm">{errors.root.message}</p>)
            }
            <div className='flex flex-col sm:flex-col md:flex-row gap-5'>
              <div className='flex flex-col gap-2 w-full'>
                <label htmlFor="">first_name</label>
                <div className='w-full relative flex items-center'>
                  <UserPlus size={20} className='absolute w-fit m-auto left-3 pb-0.5' />
                  <input {...register("first_name", {
                    required: "first_name is Required !"
                  })} type="text" id='first_name' name='first_name' className={`flex-1 py-2 pl-10 border-subTextGrey bg-input-background outline-none rounded-lg focus:border-reddish border focus:outline ${errors.first_name ? "border-primary-red outline-red-400" : "focus:outline-primary-blue focus:border-blue-400"}  transition-colors duration-100 focus:bg-secondary-black`} />
                </div>
                {
                  errors.first_name && (<p className="text-red-500 text-xs">{errors.first_name.message}</p>)
                }
              </div>
              <div className='flex flex-col gap-2 w-full'>
                <label htmlFor="">last_name</label>
                <div className='w-full relative flex items-center'>
                  <UserPlus size={20} className='absolute w-fit m-auto left-3 pb-0.5' />
                  <input {...register("last_name", {
                    required: "last_name is Required !"
                  })} type="text" id='last_name' name='last_name' className={`flex-1 py-2 pl-10 border-subTextGrey bg-input-background outline-none rounded-lg focus:border-reddish border focus:outline ${errors.last_name ? "border-primary-red outline-red-400" : "focus:outline-primary-blue focus:border-blue-400"}  transition-colors duration-100 focus:bg-secondary-black`} />
                </div>
                {
                  errors.last_name && (<p className="text-red-500 text-xs">{errors.last_name.message}</p>)
                }
              </div>
            </div>
            <div className='flex flex-col sm:flex-col md:flex-row gap-5'>
              <div className='flex flex-col gap-2 w-full'>
                <label htmlFor="">Username</label>
                <div className='w-full relative flex items-center'>
                  <CircleUser size={20} className='absolute w-fit m-auto left-3 pb-0.5' />
                  <input {...register("username", {
                    required: "username is Required !"
                  })} type="text" id='username' name='username' className={`flex-1 py-2 pl-10 border-subTextGrey bg-input-background outline-none rounded-lg focus:border-reddish border focus:outline ${errors.username ? "border-primary-red outline-red-400" : "focus:outline-primary-blue focus:border-blue-400"}  transition-colors duration-100 focus:bg-secondary-black`} />
                </div>
                {
                  errors.username && (<p className="text-red-500 text-xs">{errors.username.message}</p>)
                }
              </div>
              <div className='flex flex-col gap-2 w-full'>
                <label htmlFor="">Email</label>
                <div className='w-full relative flex items-center'>
                  <Mail size={20} className='absolute w-fit m-auto left-3 pb-0.5' />
                  <input {...register("email", {
                    required: "Email is Required !"
                  })} type="text" id='email' name='email' className={`flex-1 py-2 pl-10 border-subTextGrey bg-input-background outline-none rounded-lg focus:border-reddish border focus:outline ${errors.email ? "border-primary-red outline-red-400" : "focus:outline-primary-blue focus:border-blue-400"}  transition-colors duration-100 focus:bg-secondary-black`} />
                </div>
                {
                  errors.email && (<p className="text-red-500 text-xs">{errors.email.message}</p>)
                }
              </div>
            </div>
            <div className='flex flex-col gap-2'>

              <label htmlFor="">Password</label>
              <div className='w-full relative flex items-center'>
                <Lock size={20} className='absolute w-fit m-auto left-3 pb-0.5' />
                <input {...register("password", {
                  required: "Password is Required !"
                })} type="password" id='password' name='password' className={`flex-1 py-2 pl-10 border-subTextGrey bg-input-background outline-none rounded-lg focus:border-reddish border focus:outline ${errors.password ? "border-primary-red outline-red-400" : "focus:outline-primary-blue focus:border-blue-400"}  transition-colors duration-100 focus:bg-secondary-black`} />
              </div>
              {
                errors.password && (<p className="text-red-500 text-xs">{errors.password.message}</p>)
              }
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor="">Confirm Password</label>
              <div className='w-full relative flex items-center'>
                <Lock size={20} className='absolute w-fit m-auto left-3 pb-0.5' />
                <input {...register("password2", {
                  required: "Confirm Password is Required !"
                })} type="password" id='password2' name='password2' className={`flex-1 py-2 pl-10 border-subTextGrey bg-input-background outline-none rounded-lg focus:border-reddish border focus:outline ${errors.password2 ? "border-primary-red outline-red-400" : "focus:outline-primary-blue focus:border-blue-400"}  transition-colors duration-100 focus:bg-secondary-black`} />
              </div>
              {
                errors.password2 && (<p className="text-red-500 text-xs">{errors.password2.message}</p>)
              }
            </div>
            <div className='flex flex-col gap-2'>
              <Button disabled={isSubmitting} type="submit" id='sign-in-btn'>
                {isSubmitting ? "Loading..." : "Sign up"}
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
export default Signup;