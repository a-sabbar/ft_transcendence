'use client';
import {useRouter} from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import {
  useState,
  useEffect,
  useContext
} from 'react';
import { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem, checkLoged } from '@/utils/localStorage';
import { contextdata } from '@/app/contextApi';
import axiosInstance from '@/utils/axiosInstance';
import Image from "next/image"
import Header from '@/components/Dashboard/Setting/Header/Header';
import Loading from '../loading';
import {useForm} from 'react-hook-form';


export default function Page() {
  const router = useRouter();
  const [qrCodeSrc, setQrCodeSrc] = useState("2fa-qr-code 1.svg");
  const {profiles, user, socket}:any = useContext(contextdata);
  const myProfile = profiles?.find((profile:any) => profile?.userId === user?.id);
  const name = `${myProfile?.firstName} ${myProfile?.lastName}`;
  const [showConfi, setShowConfi] = useState(false);
  const [isloading, setIsLoading] = useState(true);
  const first = myProfile?.firstName;
  const last = myProfile?.lastName;
  const ema = myProfile?.email;
  
  type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
    oldpassword: string;
    newpassword: string;
    confirmpassword: string;
  }
  // type FormValues1 = {
  //   oldpassword: string;
  //   newpassword: string;
  //   confirmpassword: string;
  // }
  // console.log("myProfile : ", myProfile);
  console.log("user : ", myProfile?.first);
  const form = useForm<FormValues>({mode: 'all'});
  const {register, handleSubmit, formState } = form;
  const {errors, isDirty} = formState;
  const form1 = useForm<FormValues>({mode: 'all'});
  const {register : register1, handleSubmit : handleSubmit1, formState: formState1  } = form1;
  const {errors: errors1, isDirty : isDirty1} = formState1;




  useEffect(() => {
    const token = checkLoged();
    if (!token) {
        router.push("/login");
        return;
    }
    setIsLoading(false);
  }, []);

  const qrcode = async (e : any) => {
    e.preventDefault();
    
    try {
      const response = await axiosInstance.get(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/auth/2fa_qr`, {
        responseType: 'blob' 
      });
      const blob = new Blob([response.data], { type: 'image/png' }); 
      const objectURL = URL.createObjectURL(blob);
      setQrCodeSrc(objectURL); 
    } catch (e : any) {
      console.log("Error : ", e.response?.data || e.message); 
      return;
    }
  }
  useEffect(() => {
    qrcode({ preventDefault: () => {} });
  }, []);

  if (isloading) {
    return <Loading />;
  }

  function handleFileInputChange(e:any) 
  {
    const file = e.target.files?.[0];
    const formData = new FormData();
    formData.append('file', file);
    const maxFileSize = 1024 * 1024 * 5;
    axiosInstance.post(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/upload/avatar`, formData).then((res) => {
        console.log(res);
        socket.emit('refresh', {userId: user.id});
    }).catch((err) => {
      console.log(err);
    });
  }
  const avatarUrl = `http://${process.env.NEXT_PUBLIC_APP_URL}:3000/${myProfile?.avatar}`;
  
  function deleteAvatar() {
    axiosInstance.delete(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/upload/userAvatar`).then((res) => {
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const deleteUser = async (e : any) => {
    e.preventDefault();
    
    try {
      const response = await axiosInstance.delete(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/user/delete`);
      removeLocalStorageItem("Token");
      socket?.disconnect();
      router.push('/login');
    } catch (e : any) {
      console.log("Error : ", e.response?.data || e.message);
      return;
    }
  }

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    try {
      const response = await axiosInstance.patch(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/user/change-data`, {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
       });   
       console.log(response);
    } catch (e:any) 
    {
      console.log("Error : ", e.response.data);
      return;
    }
  }
  const onError = (errors:any) => console.log(errors);

  const onSubmit1 = async (data: FormValues) => {
    console.log(data);
    try {
      const response = await axiosInstance.patch(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/user/change-password`, {
        oldPassword: data.oldpassword,
        newPassword: data.newpassword,
       });   
       console.log(response);
    } catch (e:any) 
    {
      console.log("Error : ", e.response.data);
      return;
    }
  }
  const registerOptions = {
    firstName: { required: "First name is required",
    maxLength: {
      value: 20,
      message: "should not exceed 20 characters",
    },
    minLength: {
      value: 2,
      message: "at least 3 characters",
    },
    validate: (val:any) =>
    val?.match(/\p{L}/gu)?.join('') === val || 'must contain only characters'
    // validate: (value:any) => {
    //         return (
    //           [/[a-z]/, /[A-Z]/, /[0-9]/].every((pattern) =>
    //             pattern.test(value)
    //           ) || "can contain only letters"
    //         );
    //       },
   },
    lastName: { required: "Last name is required",
    maxLength: {
      value: 20,
      message: "should not exceed 20 characters",
    },
    minLength: {
      value: 2,
      message: "at least 3 characters",
    },
    validate: (val:any) =>
        val?.match(/\p{L}/gu)?.join('') === val || 'must contain only characters'
    // validate: (value:any) => {
    //   return (
    //     [/[a-z]/, /[A-Z]/, /[0-9]/].every((pattern) =>
    //       pattern.test(value)
    //     ) || "can contain only letters"
    //   );
    // },

   },
    email: { required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "invalid email address"
    },
    emailAvailable: async (value:string) => {
      console.log("emailAvailable", value);
      const response = await axios.post(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/auth/emailAvailable`, {
        email: value,
      });
      if (response.status !== 200) 
        return "Email already exists";
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must have at least 8 characters"
    },
    validate: (value:string) => {
      return (
        [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) =>
          pattern.test(value)
        ) || "must include lower, upper, number, and special chars"
      );
    },

  }
  };

  return (
    <div className='flex items-center  flex-col  gap-[40px] w-[100%] justify-start 3xl:gap-[160px] 3xl:px-[10px]  '>

    <Header />
    <div className="flex flex-col 3xl:flex-row items-center w-[100%] gap-[50px] ">
      {
        showConfi && <div className=" w-full h-full fixed top-0 left-0 z-[8]  inset-0  bg-opacity-5 backdrop-blur-[1.5px]"/>
        
      }
      <div className="flex flex-col w-[100%] items-center 3xl:items-end gap-[50px] ">
        <div className="3xl:max-w-[922px] max-w-[1200px] w-11/12  xl:h-[448px] rounded-[42px] p-inf bg-white">
          <div className="text-[20px] text-center sm:text-left sm:text-[25px] font-[600] text-[#043B6A] pt-[20px] sm:pl-[40px] ">
            Personal Information
          </div>
          <div className="flex items-center flex-col sm:flex-row pb-4 sm:pl-[40px] pt-[4px] gap-[6px]">
            <div className=" w-[130px]  h-[130px] rounded-full  border-[3px] border-[#3887D0]">
              <picture>
                <img
                className="rounded-full w-full h-full object-cover"
                src={avatarUrl}
                alt=""
                />
              </picture>
            </div>
            <div className="flex flex-col sm:pl-[24px] gap-[5px] ">
              <label
                htmlFor="imageUpload"
                className="bg-[#3887D0] text-white  w-[132px] h-[41px] text-center leading-10  text-[10px] cursor-pointer rounded-[12px] hover:bg-[#2f71af] b-save"
              >
                Upload New Picture
              </label>
              <input
                type="file"
                id="imageUpload"
                className="hidden cursor-pointer"
                onChange={handleFileInputChange}
              />
              <button onClick={deleteAvatar}  className="bg-[#F9F9F9] text-[#02539D] text-[10px] font-[600] w-[132px] h-[41px] rounded-[12px] hover:bg-[#f0f0f0] b-reset">
                Delete
              </button>
            </div>
          </div>
          <form className="items-center flex flex-col gap-[16px]" onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <div className="flex  gap-[16px] w-11/12 flex-col sm:flex-row">
              <input

              className={`w-full h-[66px] border-[1px] border-[#D8D8D8] rounded-[15px] placeholder:indent-[24px] indent-[24px]  ${errors.firstName ? 'border-[2px] border-red-400 placeholder:text-red-400' : ""}` }
                type="firstName"
                id=""
                placeholder="First name"
                {...register("firstName", registerOptions.firstName)}
              />
              <input
                 className={`w-full h-[66px] border-[1px] border-[#D8D8D8] rounded-[15px] placeholder:indent-[24px] indent-[24px]  ${errors.lastName ? 'border-[2px] border-red-400 placeholder:text-red-400' : ""}` }
                // className="w-full h-[66px] border-[1px] border-[#D8D8D8] rounded-[15px] placeholder:indent-[24px] indent-[24px]"
                type="lastName"
                id=""
                placeholder="Last name"
                {...register("lastName", registerOptions.lastName)}
              />
            </div>
            <div className="w-11/12">
              <input
              className={`w-full sm:w-[49%] h-[66px] border-[1px] border-[#D8D8D8] rounded-[15px] placeholder:indent-[24px] indent-[24px]  ${errors.email ? 'border-[2px] border-red-400 placeholder:text-red-400' : ""}` }
                // className="w-full sm:w-[49%] h-[66px] border-[1px] border-[#D8D8D8] rounded-[15px] placeholder:indent-[24px] indent-[24px]"
                type="email"
                
                id=""
                placeholder="Email"
                {...register("email", registerOptions.email)}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-end gap-[8px] w-11/12 pb-[35px] xl:pb-0">
            <button disabled={!isDirty} className={`w-[160px] h-[50px] rounded-[12px] cursor-pointer text-[#fff] text-[13px] font-[600] b-save `}>Save changes</button>                {/* <input
                  type="submit"
                  className="w-[160px] h-[50px] rounded-[12px]  cursor-pointer text-[#fff] text-[13px] font-[600] b-save"
                  value="Save Changes"
                /> */}
                <input
                  type="reset"
                  className="w-[160px] h-[50px] rounded-[12px] cursor-pointer text-[#02539D] text-[13px] font-[600] bg-[#F9F9F9] b-reset"
                  value="Discard"
                />
            </div>
          </form>
        </div>
        <div className="3xl:max-w-[922px] max-w-[1200px] w-11/12 xl:h-[339px] rounded-[42px] p-inf bg-white">
          <div className="text-[20px] text-center sm:text-left sm:text-[25px] font-[600] text-[#043B6A] pt-[20px] sm:pl-[40px] pb-[28px]">
            Password
          </div>
          <form className="items-center flex flex-col gap-[16px]"  onSubmit={handleSubmit1(onSubmit1)} noValidate>
            <div className="w-11/12">
              <input
                className={`w-full sm:w-[49%] h-[66px] border-[1px] border-[#D8D8D8] rounded-[15px] placeholder:indent-[24px] indent-[24px]  ${errors1.oldpassword ? 'border-[2px] border-red-400 placeholder:text-red-400' : ""}` }
                type="password"
                id=""
                placeholder="Old password"
                {...register1("oldpassword", registerOptions.password)}
              />
            </div>
            <div className="flex  gap-[16px] w-11/12 flex-col sm:flex-row">
              <input
                className={`w-full h-[66px] border-[1px] border-[#D8D8D8] rounded-[15px] placeholder:indent-[24px] indent-[24px]  ${errors1.newpassword ? 'border-[2px] border-red-400 placeholder:text-red-400' : ""}` }
                type="password"
                id=""
                placeholder="New password"
                {...register1("newpassword", registerOptions.password)}
              />
              <input
                className={`w-full h-[66px] border-[1px] border-[#D8D8D8] rounded-[15px] placeholder:indent-[24px] indent-[24px]  ${errors1.confirmpassword ? 'border-[2px] border-red-400 placeholder:text-red-400' : ""}` }
                type="password"
                id=""
                placeholder="Confirm password"
                {...register1("confirmpassword", registerOptions.password)}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-end gap-[8px] w-11/12 pt-[10px] pb-[40px] xl:pb-0">
                <input
                  type="submit"
                  className="w-[160px] h-[50px] rounded-[12px]  cursor-pointer text-[#fff] text-[13px] font-[600] b-save"
                  value="Save Changes"
                />
                <input
                  type="reset"
                  className="w-[160px] h-[50px] rounded-[12px] cursor-pointer text-[#02539D] text-[13px] font-[600] bg-[#F9F9F9] b-reset"
                  value="Discard"
                />
              </div>
          </form>
        </div>
      </div>
      <div className="flex flex-col w-[100%] items-center 3xl:items-start gap-[50px] ">
        <div className="bg-white rounded-[20px] p-inf  flex items-center flex-col 3xl:max-w-[922px] max-w-[1200px] w-11/12 xl:h-[618px] sm:items-start ">
          <div className="text-[20px] text-center sm:text-left sm:text-[25px] font-[600] text-[#043B6A] pt-[20px] sm:pl-[40px] pb-[28px]">
            Two-factor authentication
          </div>
          <div className="w-[100%] flex justify-center">
            <div className="w-[212px] h-[212px] rounded-[15px] border-[1px] border-[#3887D0] bg-[#F2F2F2] flex items-center justify-center lg:w-[330px] lg:h-[330px]">
              <img
                src={qrCodeSrc}
                alt=""
                className="lg:w-[296px] lg:h-[296px]"
              />
            </div>
          </div>
          <div className="w-[100%] b">
            <p className="text-[8px] text-[#898E94] lg:text-[12px] text-center pt-[16px]">
              Enter 6-digit code from your two factor authenticator APP.
            </p>
          </div>
          <div className="flex flex-col gap-[22px] sm:flex-row justify-center items-center pt-[16px]  w-[100%]">
            <div className="flex gap-[5px]">
              <input
                type="text"
                className="border-[#7D8493] bg-[#F8F8F8] w-[48px] h-[48px] rounded-[15px] indent-[16px]"
              />
              <input
                type="text"
                className="border-[#7D8493] bg-[#F8F8F8] w-[48px] h-[48px] rounded-[15px] indent-[16px]"
              />
              <input
                type="text"
                className="border-[#7D8493] bg-[#F8F8F8] w-[48px] h-[48px] rounded-[15px] indent-[16px]"
              />
            </div>
            <div className="flex gap-[5px]">
              <input
                type="text"
                className="border-[#7D8493] bg-[#F8F8F8] w-[48px] h-[48px] rounded-[15px] indent-[16px]"
              />
              <input
                type="text"
                className="border-[#7D8493] bg-[#F8F8F8] w-[48px] h-[48px] rounded-[15px] indent-[16px]"
              />
              <input
                type="text"
                className="border-[#7D8493] bg-[#F8F8F8] w-[48px] h-[48px] rounded-[15px] indent-[16px]"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center  pt-[24px] pb-[40px] gap-[8px] w-full  xl:pb-0">
                <input
                  type="submit"
                  className="w-[160px] h-[50px] rounded-[12px]  cursor-pointer text-[#fff] text-[13px] font-[600] b-authS"
                  value="Enable"
                />
                <input
                  type="reset"
                  className="w-[160px] h-[50px] rounded-[12px] cursor-pointer text-[#fff] text-[13px] font-[600] bg-[#F9F9F9] b-authR"
                  value="Disable"
                />
            </div>
        </div>
        {
          showConfi && (
            <div className="w-[350px] sm:w-[497px] xl:h-[301px] bg-[#fffefe] absolute top-[38%]  xl:left-[41%] rounded-[25px] z-10 py-[40px] xl:py-0 ">
              <div className="flex flex-col items-center justify-center h-full gap-[37px]">
                <div className="flex xl:items-start flex-col xl:flex-row items-center justify-center ">
                  <img src="Group 246.svg" alt="" className='w-[94px] h-[94px]'  />
                  <div className="pl-[24px]">
                    <p className="text-[#F53649] text-[24px] font-[600] text-center xl:text-left">Are You Sure?</p>
                    <p className="text-[#6C6C6C] text-[16px] font-[500] w-[249px] text-center xl:text-left">
                      If you proceed, you will lose all your personal data, Are you sure you
                      want to delete your account?
                    </p>
                  </div>
                </div>
                <div className="flex xl:gap-[37px] gap-[16px] flex-col md:flex-row">
                  <button className="w-[171px] h-[50px] border-[1px] rounded-[7px] border-[#6C6C6C] text-[#6C6C6C] font-[500] text-[16px] hover:bg-gray-100" onClick={()=>setShowConfi(false)}>
                    Cancel
                  </button>
                  <button className="w-[171px] h-[50px]  rounded-[7px]  text-[#fff] font-[500] bg-[#F53649] text-[16px] hover:bg-[#f53649b3]" onClick={deleteUser}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )
        }
        <div className=" bg-white rounded-[20px] p-inf flex  flex-col  3xl:max-w-[922px] max-w-[1200px] w-11/12 xl:h-[169px] items-center sm:items-start">
          <div className="text-[20px] text-center sm:text-left sm:text-[25px] font-[600] text-[#043B6A] pt-[20px] sm:pl-[40px] pb-[28px]">
            Close Account
          </div>
          <div className="flex flex-col items-center w-full sm:flex-row pb-[40px] gap-[16px] justify-between">
            <div className="text-[#7D8493] text-[20px] font-[400] text-center sm:text-left w-[50%] sm:pl-[50px]">
              You can permanently delete or temprarily freeze your account.
            </div>
            <div className="flex justify-center items-center sm:pr-[40px]">
              <input
                type="submit"
                className="w-[160px] h-[50px] rounded-[12px]  cursor-pointer text-[#fff] text-[13px] font-[600] b-save"
                value="Close Account"
                onClick={()=>{setShowConfi(true)}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
