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
    const [selectedContent, setSelectedContent] = useState(null);
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [selectedSource, setSelectedSource] = useState('all'); // State to track selected source

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: newsData } = await axios.get('http://localhost:7000/ndtv');
                const { data: redditData } = await axios.get('http://localhost:7000/reddit');
                const { data: ytData } = await axios.get('http://localhost:7000/youtube');

                setNews(newsData);
                setReddit(redditData);
                setYoutube(ytData);

                const combinedData = [...newsData, ...redditData, ...ytData];
                setContent(getRandomItems(combinedData, 100));
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

    // Function to filter content based on the selected source
    const filteredContent = () => {
        if (selectedSource === 'all') {
            return content;
        } else if (selectedSource === 'youtube') {
            return youtube;
        } else if (selectedSource === 'ndtv') {
            return news;
        } else if (selectedSource === 'reddit') {
            return reddit;
        }
        return [];
    };

    return (
        <main className="bg-[#0b0b0e] text-white min-h-screen -mt-4">
            <Navbar />
            <Search />
            <div className="max-w-6xl mx-auto p-4">
                {/* Dropdown to select source */}
                <div className="mb-4">
                    <label htmlFor="source" className="mr-2">Select Source:</label>
                    <select
                        id="source"
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
                        className="bg-neutral-700 text-white p-2 rounded"
                    >
                        <option value="all">All</option>
                        <option value="youtube">YouTube</option>
                        <option value="ndtv">NDTV</option>
                        <option value="reddit">Reddit</option>
                    </select>
                </div>

                <div className="grid auto-rows-[520px] grid-cols-3 gap-4">
                    {filteredContent().map((item, i) => {
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

            {/* Modal */}
            {selectedContent && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-neutral-900 p-6 rounded-lg max-w-6xl w-full relative flex gap-6">
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
                            <p className="text-gray-300 text-md">{selectedContent.description}</p>
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
                            <div className="w-1/2 bg-neutral-800 p-4 rounded-lg">
                                <h3 className="text-lg font-bold mb-4 text-gray-100">Summary</h3>
                                <p className="text-gray-300 leading-relaxed h-[550px] overflow-y-scroll no-scrollbar">{summary}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
};

export default Home;