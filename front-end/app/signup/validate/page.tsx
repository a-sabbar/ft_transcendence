"use client";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'
import axios from "axios";
import { useState, useEffect, useRef, use } from "react";
import {
  setLocalStorageItem,
  removeLocalStorageItem,
} from "@/utils/localStorage";
import Loading from "@/app/loading";
import CompleteProfile from "@/components/Dashboard/CompleteProfile/CompleteProfile";

export default function validateForm() {
  const [isloading, setIsLoading] = useState(true);
  const [info, setInfo] = useState<any>();
  const [avatarUrl, setAvatarUrl] = useState("/nouser.avif");
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter();
  console.log("this is token : ", token);
    useEffect(() => {
        if (!token) {
            return;
        }
        const fetchMyProfile = async () => {
            try {
            const response = await axios.get(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/auth/oauth2/tempUser/${token}`);
            console.log("this is response : ", response.data);
            setInfo({
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                userName: response.data.username,
                email: response.data.email,
                password: response.data.password,
                avatar: response.data.avatar,
                token: token
            });
            // setAvatarUrl(`${response.data.avatar}`);
            setIsLoading(false);
            } catch (e: any) {
            console.log("Error : ", e);
            return;
            }
        };
        const getJWT = async () => {
            try {
                const response = await axios.get(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/auth/oauth2/tempUser/${token}`);
                setLocalStorageItem("Token", response.data);
                router.push("/");
                setIsLoading(false);
                } catch (e: any) {
                console.log("Error : ", e);
                return;
                }
        }
        fetchMyProfile();
        getJWT();
    }, [token]);
  if (isloading) {
    return <Loading/>;
  }

  return (
    <>
    {
      info ? (
        <CompleteProfile info={info} setInfo={setInfo}/>
      ) : <Loading/>
    }
    </>
  );
}
