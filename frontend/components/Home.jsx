import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { YouTubeEmbed } from 'react-social-media-embed';
import Search from './Search';
import Navbar from './Navbar';

const getRandomItems = (arr, num) => {
    let shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
};

const Home = () => {
    const [news, setNews] = useState([]);
    const [reddit, setReddit] = useState([]);
    const [youtube, setYoutube] = useState([]);
    const [content, setContent] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: newsData } = await axios.get('http://localhost:7000/ndtv');
                const { data: redditData } = await axios.get('http://localhost:7000/reddit');
                const { data: ytData } = await axios.get('http://localhost:7000/youtube');
                
                setNews(newsData);
                setReddit(redditData);
                setYoutube(ytData);
                
                // Combine all data into a single array
                const combinedData = [...newsData, ...redditData, ...ytData];
                // Shuffle and limit the content to a specific number (e.g., 20 items)
                setContent(getRandomItems(combinedData, 100));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <main className="bg-[#0b0b0e] text-white min-h-screen -mt-4">
            <Navbar />
            <Search />
            <div className="max-w-6xl mx-auto p-4">
                {/* Bento Grid Layout */}
                <div className="grid auto-rows-[460px] grid-cols-3 gap-4"> {/* Increased row height */}
                    {content.map((item, i) => {
                        const hasImage = item.imgUrl;
                        const hasVideo = item.link && item.link.includes("youtube");
                        const hasText = item.title;

                        return (
                            <div
                                key={i}
                                className={`row-span-1 rounded-xl border-2 border-slate-400/10 bg-neutral-900 p-4 ${
                                    i === 3 || i === 6 ? "col-span-2" : ""
                                }`}
                                style={{ height: '100%', overflow: 'hidden' }} // Ensure the card height is constrained
                            >
                                {/* Content Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    {item.channelImg && (
                                        <img src={item.channelImg} alt="Channel" className="w-10 h-10 rounded-full" />
                                    )}
                                    <div>
                                        <p className="font-bold text-gray-200">{item.channelName || item.author || item.authorName}</p>
                                        <p className="text-sm text-gray-400">{item.time || item.date}</p>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="h-[calc(100%-120px)] overflow-y-auto no-scrollbar"> {/* Constrain content height */}
                                    {hasText && (
                                        <p className="text-lg font-bold text-gray-100 mb-2">
                                            {item.title}
                                        </p>
                                    )}
                                    {hasImage && (
                                        <img src={item.imgUrl} alt="" className="w-full h-auto object-cover rounded-lg mb-2" />
                                    )}
                                    {hasVideo && (
                                        <div className="mb-2 h-[150px]"> {/* Fixed height for YouTube embed */}
                                            <YouTubeEmbed url={item.link} width="100%" height="100%" />
                                        </div>
                                    )}
                                    {item.description && (
                                        <p className="text-gray-300 mb-2">
                                            {item.description.slice(0, 150)}...
                                        </p>
                                    )}
                                </div>

                                {/* Content Footer */}
                                <div className="flex items-center justify-between mt-4">
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-400 hover:underline"
                                    >
                                        {hasVideo ? "Watch Video" : "Read More"}
                                    </a>
                                    {item.source && (
                                        <div className="flex items-center gap-2">
                                            <img src={item.sourceImg} alt="Source" className="h-6" />
                                            <span className="text-sm text-gray-400">{item.source}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

export default Home;