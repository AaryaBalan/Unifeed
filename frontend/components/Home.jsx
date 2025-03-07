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
    const [content, setContent] = useState({}); // Store content by category
    const [selectedContent, setSelectedContent] = useState(null);
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
   
    
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:7000/dashboard/user_2tvPpLWcgSL1Yl4FmIVjpYNWY1Z`);
                setContent(data); // Store the entire data object
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    const handleSummarize = async (link) => {
        setIsSummarizing(true);
        setSummary(''); // Reset summary before making a new request
        try {
            console.log("Calling the summarization function");

            const response = await axios.post("http://localhost:8000/ask-question/", {
                question: `Summarize this link in 200 words: ${link}`,
            });

            console.log("API Response:", response.data); // Log the API response

            if (response.data && response.data.answer) {
                setSummary(response.data.answer); // Use `answer` instead of `summary`
            } else {
                throw new Error("Invalid response format: Answer field not found");
            }
        } catch (error) {
            console.error("Error summarizing content:", error);
            setSummary(`Failed to generate summary. Error: ${error.message}`);
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <main className="bg-[#0b0b0e] text-white min-h-screen -mt-4">
            <Navbar />
            <Search />
            <div className="max-w-6xl mx-auto p-4">
                {/* Loop through each category in the content object */}
                {Object.keys(content).map((category) => (
                    <div key={category} className='mt-20'>
                        <h2 className="text-2xl font-bold mb-4">{category}</h2>
                        <div className="grid auto-rows-[520px] grid-cols-3 gap-4">
                            {/* Loop through the content for the current category */}
                            {getRandomItems(content[category], 7).map((item, i) => {
                                const hasImage = item.imgUrl;
                                const hasVideo = item.link && item.link.includes("youtube");
                                const hasText = item.title;

                                return (
                                    <div
                                        key={i}
                                        className={`row-span-1 rounded-xl border-2 border-slate-400/10 bg-neutral-900 p-4 cursor-pointer ${i === 3 || i === 6 ? "col-span-2" : ""
                                            }`}
                                        style={{ height: '100%', overflow: 'hidden' }}
                                        onClick={() => setSelectedContent(item)}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            {item.channelImg && (
                                                <img src={item.channelImg} alt="Channel" className="w-10 h-10 rounded-full" />
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-200">{item.channelName || item.author || item.authorName}</p>
                                                <p className="text-sm text-gray-400">{item.time || item.date}</p>
                                            </div>
                                        </div>

                                        <div className="h-[calc(100%-120px)] overflow-y-auto no-scrollbar">
                                            {hasText && (
                                                <p className="text-lg font-bold text-gray-100 mb-2">{item.title}</p>
                                            )}
                                            {hasImage && (
                                                <img src={item.imgUrl} alt="" className="w-full h-auto object-cover rounded-lg mb-2" />
                                            )}
                                            {hasVideo && (
                                                <div className="h-[360px]">
                                                    <YouTubeEmbed url={item.link} height={320} width={'100%'} />
                                                </div>
                                            )}
                                            {item.description && (
                                                <p className="text-gray-300 mb-2">
                                                    {item.description.slice(0, 150)}...
                                                </p>
                                            )}
                                        </div>

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
                ))}
            </div>

            {/* Modal */}
            {selectedContent && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-neutral-900 p-6 rounded-lg max-w-5xl w-full relative flex gap-6">
                        {/* Left Side: Content Details */}
                        <div className="flex-1">
                            <button
                                className="absolute top-2 right-2 text-gray-300 hover:text-gray-100 text-2xl"
                                onClick={() => {
                                    setSelectedContent(null);
                                    setSummary(''); // Reset summary when modal closes
                                }}
                            >
                                &times;
                            </button>
                            <div className="mb-4">
                                <h2 className="text-xl font-bold">{selectedContent.title}</h2>
                                <p className="text-gray-400">{selectedContent.time || selectedContent.date}</p>
                            </div>
                            {selectedContent.imgUrl && (
                                <img src={selectedContent.imgUrl} alt="" className="w-full h-auto rounded-lg mb-4" />
                            )}
                            {selectedContent.link && selectedContent.link.includes("youtube") && (
                                <YouTubeEmbed url={selectedContent.link} width="100%" height="300px" />
                            )}
                            <p className="text-gray-300">{selectedContent.description}</p>
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    onClick={() => handleSummarize(selectedContent.link)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    disabled={isSummarizing}
                                >
                                    {isSummarizing ? "Summarizing..." : "Summarize"}
                                </button>
                                <a
                                    href={selectedContent.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    {selectedContent.link.includes("youtube") ? "Watch Video" : "Read More"}
                                </a>
                            </div>
                        </div>

                        {/* Right Side: Summary Section */}
                        {summary && (
                            <div className="w-1/3 bg-neutral-800 p-4 rounded-lg">
                                <h3 className="text-lg font-bold mb-4 text-gray-100">Summary</h3>
                                <p className="text-gray-300 leading-relaxed">{summary}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
};

export default Home;

