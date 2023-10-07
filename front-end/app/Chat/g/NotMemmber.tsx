import Link from 'next/link'

export default function NotMemmber() {
    return (
        <div className=' items-center justify-center w-[calc(100%-450px)] min-h-full flex flex-col min-w-[490px] lg:max-xl:w-[calc(100%-350px)] lsm:max-lg:min-w-full '>
            <div className='flex flex-col items-center justify-center gap-[26px]'>
                <div className='flex  items-center justify-center w-[148px] h-[148px] bg-[#D2E5F5] rounded-full shadow-notmember'>
                    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M36 12C29.6348 12 23.5303 14.5286 19.0294 19.0294C14.5286 23.5303 12 29.6348 12 36C12 42.3652 14.5286 48.4697 19.0294 52.9706C23.5303 57.4714 29.6348 60 36 60C42.3652 60 48.4697 57.4714 52.9706 52.9706C57.4714 48.4697 60 42.3652 60 36C60 29.6348 57.4714 23.5303 52.9706 19.0294C48.4697 14.5286 42.3652 12 36 12ZM6 36C6 19.431 19.431 6 36 6C52.569 6 66 19.431 66 36C66 52.569 52.569 66 36 66C19.431 66 6 52.569 6 36ZM21 28.5C21 27.3065 21.4741 26.1619 22.318 25.318C23.1619 24.4741 24.3065 24 25.5 24C26.6935 24 27.8381 24.4741 28.682 25.318C29.5259 26.1619 30 27.3065 30 28.5C30 29.6935 29.5259 30.8381 28.682 31.682C27.8381 32.5259 26.6935 33 25.5 33C24.3065 33 23.1619 32.5259 22.318 31.682C21.4741 30.8381 21 29.6935 21 28.5ZM42 28.5C42 27.3065 42.4741 26.1619 43.318 25.318C44.1619 24.4741 45.3065 24 46.5 24C47.6935 24 48.8381 24.4741 49.682 25.318C50.5259 26.1619 51 27.3065 51 28.5C51 29.6935 50.5259 30.8381 49.682 31.682C48.8381 32.5259 47.6935 33 46.5 33C45.3065 33 44.1619 32.5259 43.318 31.682C42.4741 30.8381 42 29.6935 42 28.5ZM23.4 44.148C26.7614 40.8446 31.2871 38.9955 36 39C40.905 39 45.357 40.965 48.6 44.145C48.8878 44.4193 49.1183 44.748 49.278 45.1121C49.4377 45.4762 49.5234 45.8684 49.5302 46.2659C49.5369 46.6634 49.4646 47.0583 49.3175 47.4276C49.1703 47.7969 48.9511 48.1333 48.6728 48.4172C48.3945 48.7011 48.0625 48.9268 47.6962 49.0813C47.3298 49.2358 46.9364 49.3159 46.5389 49.317C46.1413 49.3181 45.7475 49.2402 45.3803 49.0877C45.0131 48.9353 44.6799 48.7114 44.4 48.429C42.1595 46.2264 39.1419 44.9945 36 45C32.73 45 29.769 46.305 27.6 48.429C27.0293 48.9727 26.2676 49.27 25.4795 49.2566C24.6914 49.2431 23.9402 48.9201 23.3884 48.3572C22.8366 47.7944 22.5284 47.037 22.5306 46.2487C22.5328 45.4605 22.8451 44.7078 23.4 44.148Z" fill="#315778"/>
                    </svg>
                </div>
                <div className='flex flex-col items-center justify-center gap-[26px]'>
                    <p className='text-[#5A83A7] text-[40px] max-w-[481px] font-[Poppins] font-[600] text-center'>
                        Your are not a memeber of this group
                    </p>
                    <Link href='/Chat' className='text-[#FFF] text-[20px] max-w-[481px] font-[Poppins] font-[600] text-center bg-[#5C9BD8] py-[19px] px-[94px] rounded-[11px] shadow-notmember1' >
                        Go back
                    </Link>
                </div>
            </div>
        </div>
    )
}