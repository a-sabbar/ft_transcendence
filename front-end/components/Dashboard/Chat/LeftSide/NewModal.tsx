'use client'

import { useState } from "react";

type NewModalProps = {
    setShowBody: any
}

export default function NewModal({setShowBody}: NewModalProps) {

    const [showPen, setShowPen] = useState(true);
    const [showModal, setShowModal] = useState(false);
    return (
    
        <div className=" NewModal bg-[#025063] min-h-[70px] min-w-[70px] rounded-full absolute bottom-[-400px] right-[50px] z-[90] flex justify-center items-center cursor-pointer lsm:max-lg:bottom-[10px]  lsm:max-lg:right-[10px]" onClick={() => {setShowPen(!showPen); setShowModal(!showModal)}}
        >
            <div className="flex justify-center items-center relative">
                {showPen ?(
                <svg stroke="currentColor" fill="#FFF"  viewBox="0 0 512 512" height="22px" width="22px" xmlns="http://www.w3.org/2000/svg"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"></path>
                </svg>
                )
                :
                (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.9415 0.735395C18.1574 0.507121 18.4169 0.32445 18.7046 0.198178C18.9923 0.0719063 19.3024 0.00459649 19.6166 0.000227299C19.9307 -0.00414189 20.2426 0.0545182 20.5337 0.17274C20.8248 0.290962 21.0893 0.466347 21.3115 0.688528C21.5337 0.910709 21.709 1.17518 21.8273 1.4663C21.9455 1.75742 22.0041 2.06929 21.9998 2.38347C21.9954 2.69765 21.9281 3.00777 21.8018 3.29549C21.6756 3.58321 21.4929 3.8427 21.2646 4.05862L14.3769 10.9464C14.3678 10.9555 14.3606 10.9663 14.3557 10.9782C14.3507 10.9901 14.3482 11.0029 14.3482 11.0158C14.3482 11.0286 14.3507 11.0414 14.3557 11.0533C14.3606 11.0652 14.3678 11.076 14.3769 11.0851L21.2646 17.9729C21.4859 18.1905 21.6618 18.4498 21.7823 18.7357C21.9029 19.0217 21.9656 19.3287 21.9669 19.639C21.9682 19.9493 21.9081 20.2568 21.7899 20.5438C21.6718 20.8307 21.498 21.0914 21.2786 21.3109C21.0592 21.5303 20.7985 21.7042 20.5116 21.8224C20.2247 21.9406 19.9172 22.0008 19.6069 21.9996C19.2966 21.9984 18.9896 21.9357 18.7036 21.8152C18.4176 21.6948 18.1583 21.5189 17.9407 21.2977L11.053 14.4099C11.0439 14.4008 11.0331 14.3935 11.0212 14.3886C11.0093 14.3837 10.9965 14.3811 10.9837 14.3811C10.9708 14.3811 10.958 14.3837 10.9461 14.3886C10.9342 14.3935 10.9234 14.4008 10.9143 14.4099L4.02664 21.2977C3.80903 21.5189 3.54978 21.6949 3.26383 21.8154C2.97788 21.936 2.6709 21.9987 2.36059 22C2.05028 22.0013 1.74278 21.9411 1.45583 21.823C1.16888 21.7049 0.908163 21.5311 0.688712 21.3117C0.469261 21.0923 0.29542 20.8316 0.177218 20.5447C0.059016 20.2577 -0.00120848 19.9502 1.83738e-05 19.6399C0.00124523 19.3296 0.0638992 19.0226 0.184366 18.7366C0.304833 18.4506 0.48073 18.1913 0.701909 17.9737L7.58958 11.0859C7.5987 11.0768 7.60594 11.066 7.61088 11.0541C7.61581 11.0422 7.61835 11.0294 7.61835 11.0165C7.61835 11.0037 7.61581 10.9909 7.61088 10.979C7.60594 10.9671 7.5987 10.9563 7.58958 10.9472L0.701909 4.0594C0.266937 3.61738 0.0242452 3.02139 0.0266969 2.40125C0.0291487 1.7811 0.276546 1.18705 0.714999 0.748482C1.15345 0.309918 1.74744 0.0623762 2.36757 0.0597782C2.98771 0.0571802 3.58374 0.299736 4.02586 0.734611L10.9135 7.6224C10.9226 7.63152 10.9334 7.63876 10.9453 7.6437C10.9572 7.64864 10.97 7.65118 10.9829 7.65118C10.9958 7.65118 11.0085 7.64864 11.0204 7.6437C11.0323 7.63876 11.0431 7.63152 11.0522 7.6224L17.9399 0.734611L17.9415 0.735395Z" fill="white"/>
                    </svg>
                )
                }
                
                {showModal && (
                <div onMouseLeave={()=> {setShowModal(false); setShowPen(true)}} className=" absolute bottom-[70px] right-0 flex flex-col min-w-[200px] gap-[15px] bg-[#EDFAFF] px-[25px] py-[19px] rounded-[20px] notifShadow  lsm:max-lg:bottom-[50px]">
                    <span className="flex items-center gap-[20px]" >
                        <span>
                            <svg width="16" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 6C7.6575 6 9 4.6575 9 3C9 1.3425 7.6575 0 6 0C4.3425 0 3 1.3425 3 3C3 4.6575 4.3425 6 6 6ZM6 7.5C3.9975 7.5 0 8.505 0 10.5V12H12V10.5C12 8.505 8.0025 7.5 6 7.5Z" fill="#003163"/>
                            </svg>
                        </span>
                        <p>New chat</p>
                    </span>
                    <span className="flex items-center gap-[20px]" onClick={() => setShowBody("selectUsers")}>
                        <span>
                            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 12V9.90001C0 9.47501 0.106182 9.08426 0.318545 8.72776C0.530909 8.37126 0.812606 8.09951 1.16364 7.91251C1.91515 7.52501 2.67879 7.23426 3.45455 7.04026C4.2303 6.84626 5.01818 6.74951 5.81818 6.75001C6.61818 6.75001 7.40606 6.84701 8.18182 7.04101C8.95758 7.23501 9.72121 7.52551 10.4727 7.91251C10.8242 8.10001 11.1062 8.37201 11.3185 8.72851C11.5309 9.08501 11.6368 9.47551 11.6364 9.90001V12H0ZM13.0909 12V9.75C13.0909 9.20001 12.9423 8.67176 12.6451 8.16526C12.3479 7.65876 11.9268 7.22451 11.3818 6.86251C12 6.93751 12.5818 7.06576 13.1273 7.24726C13.6727 7.42876 14.1818 7.65051 14.6545 7.91251C15.0909 8.16251 15.4242 8.44051 15.6545 8.74651C15.8848 9.05251 16 9.387 16 9.75V12H13.0909ZM5.81818 6.00001C5.01818 6.00001 4.33333 5.70626 3.76364 5.11876C3.19394 4.53126 2.90909 3.82501 2.90909 3.00001C2.90909 2.17502 3.19394 1.46877 3.76364 0.881268C4.33333 0.293769 5.01818 1.92305e-05 5.81818 1.92305e-05C6.61818 1.92305e-05 7.30303 0.293769 7.87273 0.881268C8.44242 1.46877 8.72727 2.17502 8.72727 3.00001C8.72727 3.82501 8.44242 4.53126 7.87273 5.11876C7.30303 5.70626 6.61818 6.00001 5.81818 6.00001ZM13.0909 3.00001C13.0909 3.82501 12.8061 4.53126 12.2364 5.11876C11.6667 5.70626 10.9818 6.00001 10.1818 6.00001C10.0485 6.00001 9.87879 5.98426 9.67273 5.95276C9.46667 5.92126 9.29697 5.88701 9.16364 5.85001C9.49091 5.45001 9.74255 5.00626 9.91855 4.51876C10.0945 4.03126 10.1823 3.52501 10.1818 3.00001C10.1818 2.47502 10.0941 1.96877 9.91855 1.48127C9.74303 0.993768 9.49139 0.550018 9.16364 0.150019C9.33333 0.087519 9.50303 0.0467693 9.67273 0.0277693C9.84242 0.00876935 10.0121 -0.000480769 10.1818 1.92305e-05C10.9818 1.92305e-05 11.6667 0.293769 12.2364 0.881268C12.8061 1.46877 13.0909 2.17502 13.0909 3.00001Z" fill="#003163"/>
                            </svg>
                        </span>
                        <p>New group</p>
                    </span>
                </div>
                
                )}
            </div>
        </div>

    )
}