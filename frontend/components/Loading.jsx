import React from 'react'
import loader from "../../frontend/src/assets/images/loader.gif"

const Loading = () => {
    return (
        <div className='bg-white top-0 w-full h-full fixed flex flex-col justify-center item-center'>
            <img src={loader} alt="" className='mx-auto'/>
            <div className='text-[#ff371a] text-xl mx-auto -mt-10'>Loading… because perfection takes a moment.</div>
        </div>
    )
}

export default Loading