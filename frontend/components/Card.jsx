import React from "react";

const Card = ({ item, onClose }) => {

    function summarizeNews(link) {
        // Implement your summarization logic here
    }

    return (
        <div className="flex items-center justify-center fixed w-full backdrop-blur-md h-full -mt-40 z-10">
            <div className="relative flex flex-col gap-y-4 bg-white border border-gray-200 rounded-lg overflow-hidden w-[500px] shadow-md">
                <button onClick={onClose} className="flex item-center justify-center absolute right-2 top-2 bg-red-500 w-7 h-7 text-white font-bold">X</button>
                <div className="px-4 pt-4">
                    <p className="text-gray-600 text-sm">{item.author} • {item.date}</p>
                    <a href={item.link} target='_blank' className="block mt-2 font-bold text-lg text-[#dd2476] hover:underline">
                        {item.title.slice(0, 50)}
                    </a>
                </div>
                {item.imgUrl && (
                    <a href={item.link} target='_blank'><img src={item.imgUrl} alt="News" className="w-full h-80 object-cover" /></a>
                )}
                <div className="px-4">
                    <p className="text-gray-700 ">{item.description.slice(0, 100)}...</p>
                </div>
                <div className="flex items-center justify-between">
                    <button className="ml-4 mb-4 bg-[#dd2476] w-fit px-2 py-1 rounded-full text-white cursor-pointer" onClick={() => summarizeNews(item.link)}>
                        Summarize
                    </button>
                    <div className='px-4 pb-4 flex gap-x-2 items-center justify-end'>
                        <img src={item.sourceImg} alt="" className='h-7' />
                        <div className='bg-[#dd2476] w-fit px-2 py-1 rounded-full text-white '>{item.source}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;