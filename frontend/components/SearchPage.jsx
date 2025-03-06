import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { YouTubeEmbed } from 'react-social-media-embed';
import Search from './Search';
import Navbar from './Navbar';

const SearchPage = () => {
    const [news, setNews] = useState([]);
    const [reddit, setReddit] = useState([]);
    const [youtube, setYoutube] = useState([]);

    useEffect(() => {
        async function getNews() {
            try {
                const { data: newsData } = await axios.get('http://localhost:7000/ndtv');
                const { data: redditData } = await axios.get('http://localhost:7000/reddit');
                const { data: ytData } = await axios.get('http://localhost:7000/youtube');

                setNews(newsData.slice(0, 10));
                setReddit(redditData.slice(0, 5));
                setYoutube(ytData.slice(0, 20));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        getNews();
    }, [news, reddit, youtube]);

    return (
        <main>
            <Navbar/>
            <Search />
            <div className="m-7 flex gap-8 items-start">
                {/* News Section */}
                <div className='w-2/3 flex flex-col gap-y-2'>
                    <h1 className='text-xl rounded bg-white font-bold border border-[#00845d] w-fit px-2 py-1 text-[#00845d]'>News</h1>
                    <div className="flex flex-wrap gap-8">
                        {news.map((item, index) => (
                            <div key={index} className="flex flex-col gap-y-4 bg-white border border-gray-200 rounded-lg overflow-hidden w-[300px]">
                                <div className="px-4 pt-4">
                                    <p className="text-gray-600 text-sm">{item.author} • {item.date}</p>
                                    <a href={item.link} target='_blank' className="block mt-2 font-bold text-lg text-green-700 hover:underline">
                                        {item.title.slice(0, 50)}
                                    </a>
                                </div>
                                {item.imgUrl && (
                                    <a href={item.link} target='_blank'><img src={item.imgUrl} alt="News" className="w-full h-80 object-cover" /></a>
                                )}
                                <div className="px-4">
                                    <p className="text-gray-700 ">{item.description.slice(0, 100)}...</p>
                                </div>
                                <div className='px-4 pb-4 flex gap-x-2 items-center justify-end'>
                                    <img src={item.sourceImg} alt="" className='h-7' />
                                    <div className='bg-[#00845d] w-fit px-2 py-1 rounded-full text-white '>{item.source}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reddit Section */}
                <div className='w-1/3 flex flex-col gap-y-2'>
                    <div className='text-xl rounded bg-white font-bold border border-[#00845d] w-fit px-2 py-1 text-[#00845d]'>Reddit</div>
                    <div className="flex flex-wrap gap-4 -ml-40">
                        {reddit.map((item, index) => (
                            <div key={index} className="w-[350px] bg-white border border-gray-200  rounded-lg p-4">
                                {/* Reddit Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {item.channelImg && (
                                            <img className="w-10 h-10 rounded-full" src={item.channelImg} alt="Channel" />
                                        )}
                                        <div>
                                            <p className="font-bold text-gray-800">{item.channelName}</p>
                                            <a href={item.channelLink} className=" text-blue-500 hover:underline">
                                                View Channel
                                            </a>
                                        </div>
                                    </div>
                                    <p className=" text-gray-500">{item.time}</p>
                                </div>

                                {/* Reddit Content */}
                                {item.imgUrl && (
                                    <img src={item.imgUrl} alt="Reddit Post" className="mt-3 rounded-lg w-[200px] h-[200px] object-cover" />
                                )}
                                <p className="mt-3 text-gray-800 font-medium">{item.title}</p>
                                <a href={item.link} className="mt-2 text-green-700 hover:underline ">
                                    View Post →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='w-[95%] mx-auto flex flex-col gap-y-2 justify-center items-center mt-10 border border-[#00845d] p-3'>
                <div className='text-xl rounded bg-white font-bold border border-[#00845d] w-fit px-2 py-1 text-[#00845d]'>Youtube</div>
                <div className='w-full flex gap-x-5 flex-wrap justify-center gap-y-10'>
                    {youtube.map((item, index) => (
                        <div key={index} className="flex flex-col gap-y-1 bg-white border border-gray-200 rounded-lg overflow-hidden w-[400px]">
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <YouTubeEmbed url={item.link} width='100%' />
                            </div>
                            <div className='p-4 flex flex-col gap-y-1'>
                                <div className="">
                                    <p className="text-md font-bold"><a href={item.authorLink}>@{item.authorName}</a></p>
                                    <a href={item.link} target='_blank' className="block mt-2 font-bold text-lg text-green-700 hover:underline">
                                        {item.title.slice(0, 50)}
                                    </a>
                                </div>
                                <div className="">
                                    <p className="text-gray-700 ">{item.descriptionText && item.descriptionText.slice(0, 100)}</p>
                                </div>
                                <div className='flex justify-between'>
                                    <div>{item.views}</div>
                                    <div>{item.time}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default SearchPage;
