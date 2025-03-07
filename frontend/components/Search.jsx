import React, { useState } from 'react';
import axios from 'axios';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
const Search = () => {
    const navigate = useNavigate(); // Initialize navigation function

    const [searchText, setSearchText] = useState('');
    const [load, setLoad] = useState(false);

    async function sendSearchText(e) {
        e.preventDefault();
        if (!searchText.trim()) return; // Prevent empty searches
        setLoad(true);

        try {
            const response = await axios.post('http://localhost:7000/search', { searchText });
            console.log(response.data);
            setLoad(false);
            navigate("/search")
            window.location.reload();
        } catch (error) {
            console.error("Error sending search request:", error);
        }
    }

    return (
        <div className="flex flex-col items-center my-10">
            {load && <Loading />}
            <form className='flex w-full max-w-lg justify-center gap-x-5 bg-gradient-to-r from-[#ff512f] to-[#dd2476] p-4 rounded-xl shadow-lg backdrop-blur-md bg-opacity-80' onSubmit={sendSearchText}>
                <input
                    type="text"
                    placeholder='Search Anything you need...'
                    className='border border-white bg-transparent px-3 py-2 rounded-lg text-lg outline-none text-white placeholder-white w-full'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button type='submit' className='bg-white text-[#dd2476] px-4 py-2 rounded-lg font-semibold hover:bg-opacity-80 transition-all'>
                    Search
                </button>
            </form>
        </div>
    );
};

export default Search;