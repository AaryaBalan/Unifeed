import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Search from './Search';

const getRandomItems = (arr, num) => {
    let shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
};

const Home = () => {
    const [dashboardData, setDashboardData] = useState({});
    const [displayedItems, setDisplayedItems] = useState([]);
    const [remainingItems, setRemainingItems] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get('http://localhost:7000/dashboard/user_2tvPpLWcgSL1Yl4FmIVjpYNWY1Z');
                setDashboardData(data);
                prepareItems(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    const prepareItems = (data) => {
        let allItems = [];
        Object.keys(data).forEach((category) => {
            let selected = data[category].slice(0, 5).map(item => ({ ...item, category }));
            allItems.push(...selected);
        });
        
        let shuffledItems = getRandomItems(allItems, 5);
        setDisplayedItems(shuffledItems);
        setRemainingItems(allItems.filter(item => !shuffledItems.includes(item)));
    };

    const loadMore = () => {
        if (remainingItems.length === 0) return;
        let newSelection = getRandomItems(remainingItems, 5);
        setDisplayedItems(newSelection);
        setRemainingItems(remainingItems.filter(item => !newSelection.includes(item)));
    };

    return (
        <main className="bg-[#0b0b0e] text-white min-h-screen -mt-4">
            <Navbar />
            <Search />
            <div className="max-w-6xl mx-auto p-4">
                <div className="grid grid-cols-3 gap-4">
                    {displayedItems.map((item, i) => (
                        <div key={i} className="border border-[#00845d] px-3 py-1 rounded text-lg outline-none bg-neutral-900 p-4 cursor-pointer">
                            <h2 className="text-lg font-bold text-gray-100">{item.title}</h2>
                            <p className="text-gray-400">{item.category}</p>
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                                Read More
                            </a>
                        </div>
                    ))}
                </div>
                {remainingItems.length > 0 && (
                    <button onClick={loadMore} className="mt-4 bg-[#00845d] px-3 py-1 text-white rounded hover:bg-green-600">
                        Load More
                    </button>
                )}
            </div>
        </main>
    );
};

export default Home;