'use client';
import React, { use } from 'react';
import { createContext , useState , useEffect, useRef } from 'react';
import { getLocalStorageItem , removeLocalStorageItem } from '@/utils/localStorage';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import io, { Socket } from 'socket.io-client';
import { Toaster, toast } from 'sonner';
let newSocket: Socket | null = null;
let notificationsocket: Socket | null = null;

export const contextdata = createContext({});



const ContextProvider = ({ children }: { children: React.ReactNode; }) => {
  
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [profiles, setProfiles] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [socket, setSocket] = useState<any>(null);
  const [notifSocket, setNotifSocket] = useState<any>(null);
  const [myChannels, setMyChannels] = useState<any>([]);
  const [channels, setChannels] = useState<any>([]);
  const [loged, setLoged] = useState<boolean>(false);
  const [myFriends, setMyFriends] = useState<any>([]);
  const [mediaDashbord, setMediaDashbord]  = useState<boolean>(false);
  const [myNotif, setMyNotif] = useState<any>([]);
  const dashboardRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (getLocalStorageItem("Token")) {
      setLoged(true);
    }
    if(loged === false) return;
    const getUser = async () => {
      try
      {
        const resp = await axiosInstance.get(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/user/userinfo`);
        if (resp.data === null) {
          removeLocalStorageItem("Token");
          router.push("/login");
          return;
        }
        setUser(resp.data);
      }
      catch (error)
      {
        console.log("error : ",error);
        removeLocalStorageItem("Token");
        router.push("/login");
        return;
      }
    }
    getUser();
    return () => {
      setUser(null);
    }
  }, [loged]);

  useEffect(() => {
    if (!user ) {
      return;
    }
    newSocket = io(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/chat`, {
      extraHeaders: {
        Authorization: `Bearer ${getLocalStorageItem("Token")}`,
      }
    });
    notificationsocket = io(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/notification`, {
      extraHeaders: {
        Authorization: `Bearer ${getLocalStorageItem("Token")}`,
      }
    });
    console.log("newSocket : ", newSocket);
    console.log("notificationsocket : ", notificationsocket);
    if (newSocket) {
      setSocket(newSocket);
    }
    if (notificationsocket) {
      setNotifSocket(notificationsocket);
    }
    return () => {
      newSocket?.disconnect()
      notificationsocket?.disconnect()
    }
  }, [user]);

  useEffect(() => {
    if (!user || user === undefined) {
      return;
    }
    async function getProfiles() {
      try
      {
        const resp = await axiosInstance.get(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/user/profiles`);
        if (resp.data === null) {
          return;
        }
        setProfiles(resp.data);
      }
      catch (error)
      {
        console.log("error : profiles ", error);
        return;
      }
    }
    async function getMessages() {
      try
      {
        const resp = await axiosInstance.get(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/chat/messages/${user?.id}`);
        if (resp.data === null) {
          return;
        }
        resp.data.sort ((a:any, b:any) => {
					return (
						new Date(a.createdAt).getTime() -
						new Date(b.createdAt).getTime()
					);
				});
        setMessages(resp.data);
      }
      catch (error)
      {
        console.log("error : profiles ", error);
        return;
      }
    }
    async function getMyChannels() {
      try
      {
        const resp = await axiosInstance.get(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/chat/myChannels/${user?.id}`);
        if (resp.data === null) {
          return;
        }
        setMyChannels(resp.data);
      }
      catch (error)
      {
        console.log("error : profiles ", error);
        return;
      }
    }
    async function getChannels() {
      try
      {
        const resp = await axiosInstance.get(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/chat/channels`);
        if (resp.data === null) {
          return;
        }
        setChannels(resp.data);
      }
      catch (error)
      {
        console.log("error : profiles ", error);
        return;
      }
    }
    async function getMyFriends() {
      try{
        const getFriends = async () => {
            try{
                const res = await axiosInstance.get(`http://${process.env.NEXT_PUBLIC_APP_URL}:3000/api/friendship/show`);
                console.log("myFrinds : ", res.data);
                setMyFriends(res.data);
            }
            catch(err){
                console.log(err);
            }
        }
        getFriends();
    }
    catch(error)
    {
        console.log(error)
    }
    }
    getChannels();
    getProfiles();
    getMessages();
    getMyChannels();
    getMyFriends();
		return () => {
      setProfiles([]);
      setMessages([]);
      setMyChannels([]);
      setChannels([]);

		}
	}, [user]);
	useEffect(() => {
	  if (!notifSocket) return;

		console.log("notifSocket : ", notifSocket);
		notifSocket.on('notification', (payload:any) => {
			console.log("payload : ", payload);
			setMyNotif((prev:any) => [...prev, payload]);
			setTimeout(() => {
			setMyNotif([]);
			}
			, 100);
		})
		notifSocket.on('redirect', (payload:any) => {
			router.push(`${payload.link}`);
		})
		return () => {
			setMyNotif([]);
			notifSocket.off('notification');
      notifSocket.disconnect();  
		}
	}
	, [notifSocket]);
  return (
    <contextdata.Provider value={{
        socket:socket,
        notifSocket:notifSocket,
        dashboardRef:dashboardRef,
        mediaDashbord:mediaDashbord,
        user:user,
        profiles:profiles,
        messages:messages,
        myChannels:myChannels,
        channels:channels,
        setChannels:setChannels,
        setUser:setUser,
        setMyChannels:setMyChannels,
        setProfiles:setProfiles,
        setMessages:setMessages,
        setLoged:setLoged,
        loged:loged,
        setMediaDashbord:setMediaDashbord,
        myFriends:myFriends,
        setMyFriends:setMyFriends,
      
      }}>
        <div className='w-full h-full relative'>
            {
              <div className='w-full absolute'>
                <Toaster position="top-right"  richColors/>
                {myNotif.length !== 0 && myNotif.map((notif:any, index:number) => (
                <div key={index}>
                  
                  {notif.type === 'success' && toast.success(notif.message)}
                  {notif.type === 'info' && toast.info(notif.message)}
                  {notif.type === 'error' && toast.error(notif.message)}
                  {notif.type === 'warning' && toast.warning(notif.message)}
                </div>
                ))
                }
              </div>
            }
          {children}
        </div>
    </contextdata.Provider>
  );
}

export default ContextProvider;
