
export default function Page() {
  return (
    <div className="flex flex-col 3xl:flex-row items-center w-[100%] gap-[50px] h-screen">
      <div className="flex flex-col w-[100%] items-center 3xl:items-end gap-[50px]">
        <div className="3xl:max-w-[922px] max-w-[1200px] w-11/12  xl:h-[448px] rounded-[42px] p-inf bg-white">
          <div className="text-[20px] text-center sm:text-left sm:text-[25px] font-[600] text-[#043B6A] pt-[20px] sm:pl-[40px] ">
            Personal Information
          </div>
          <div className="flex items-center flex-col sm:flex-row pb-4 sm:pl-[40px] pt-[18px]">
            <div className="pb-4">
              <img src="Ellipse 188.png" alt="" />
            </div>
            <div className="flex flex-col sm:pl-[24px] gap-[5px] ">
              <label
                htmlFor="imageUpload"
                className="bg-[#3887D0] text-white  w-[132px] h-[41px] text-center leading-10  text-[10px] cursor-pointer rounded-[12px] hover:bg-[#2f71af]"
              >
                Upload New Picture
              </label>
              <input
                type="file"
                id="imageUpload"
                className="hidden cursor-pointer"
              />
              <button className="bg-[#F9F9F9] text-[#02539D] text-[10px] font-[600] w-[132px] h-[41px] rounded-[12px] hover:bg-[#f0f0f0]">
                Delete
              </button>
            </div>
          </div>
          <div className="items-center flex flex-col gap-[16px]">
            <div className="flex  gap-[16px] w-11/12 flex-col sm:flex-row">
              <input
                className="w-full h-[66px] border-[1px] border-[#D8D8D8] rounded-[15px] placeholder:indent-[24px] indent-[24px]"
                type="text"
                name=""
                id=""
                placeholder="First name"
              />
              <input
                className="w-full h-[66px] border-[1px] border-[#D8D8D8] rounded-[15px] placeholder:indent-[24px] indent-[24px]"
                type="text"
                name=""
                id=""
                placeholder="First name"
              />
            </div>
            <div className="w-11/12">
              <input
                className="w-full sm:w-[49%] h-[66px] border-[1px] border-[#D8D8D8] rounded-[15px] placeholder:indent-[24px] indent-[24px]"
                type="text"
                name=""
                id=""
                placeholder="First name"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-end gap-[8px] pt-[24px] pb-[28px] sm:w-12/12 sm:pr-[40px]">
            <input
              type="submit"
              className=" w-[132px] h-[41px] rounded-[12px] bg-[#3887D0] cursor-pointer text-[#fff] text-[10px] font-[600] b-save"
              value="Save Changes"
            />
            <input
              type="reset"
              className=" w-[132px] h-[41px] rounded-[12px] bg-[#F9F9F9] cursor-pointer text-[#02539D] text-[10px] font-[600] b-save"
              value="Discard"
            />
          </div>
        </div>
        <div className="3xl:max-w-[922px] max-w-[1200px] w-11/12 xl:h-[339px] rounded-[42px] p-inf bg-white">
          <div className="text-[20px] text-center sm:text-left sm:text-[25px] font-[600] text-[#043B6A] pt-[20px] sm:pl-[40px] pb-[28px]">
            Password
          </div>
          <div className="items-center flex flex-col gap-[16px]">
            <div className="flex  gap-[16px] w-11/12 flex-col sm:flex-row">
              <input
                className="w-full h-[66px] border-[1px] border-[#D8D8D8] rounded-[15px] placeholder:indent-[24px] indent-[24px]"
                type="text"
                name=""
                id=""
                placeholder="First name"
              />
              <input
                className="w-full h-[66px] border-[1px] border-[#D8D8D8] rounded-[15px] placeholder:indent-[24px] indent-[24px]"
                type="text"
                name=""
                id=""
                placeholder="First name"
              />
            </div>
            <div className="w-11/12">
              <input
                className="w-full sm:w-[49%] h-[66px] border-[1px] border-[#D8D8D8] rounded-[15px] placeholder:indent-[24px] indent-[24px]"
                type="text"
                name=""
                id=""
                placeholder="First name"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-end gap-[8px] pt-[24px] pb-[40px] sm:w-12/12 sm:pr-[40px]">
            <input
              type="submit"
              className=" w-[132px] h-[41px] rounded-[12px] bg-[#3887D0] cursor-pointer text-[#fff] text-[10px] font-[600] b-save"
              value="Save Changes"
            />
            <input
              type="reset"
              className=" w-[132px] h-[41px] rounded-[12px] bg-[#F9F9F9] cursor-pointer text-[#02539D] text-[10px] font-[600] b-save"
              value="Discard"
            />
          </div>
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
                src="2fa-qr-code 1.svg"
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
          <div className="flex justify-center items-center pt-[24px] pb-[40px] w-[100%]  ">
            <input
              type="submit"
              className=" w-[160px] h-[50px] rounded-[12px] bg-[#3887D0] cursor-pointer text-[#fff] text-[13px] font-[600] b-save"
              value="Save Changes"
            />
          </div>
        </div>
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
                className="w-[160px] h-[50px] rounded-[12px] bg-[#3887D0] cursor-pointer text-[#fff] text-[13px] font-[600] b-save"
                value="Close Account"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}