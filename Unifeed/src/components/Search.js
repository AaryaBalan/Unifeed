import React, { useState } from 'react';
import axios from 'axios';
import Loading from './Loading';

const Search = () => {
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
        } catch (error) {
            console.error("Error sending search request:", error);
        }
    }

    return (

        <div>
            {load && <Loading />}
            <form className='flex w-full justify-center my-10 gap-x-5' onSubmit={sendSearchText}>
                <input
                    type="text"
                    placeholder='Search Anything you need...'
                    className='border border-[#00845d] px-3 py-1 rounded text-lg outline-none'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button type='submit' className='bg-[#00845d] px-3 py-1 text-white'>
                    Search
                </button>
            </form>
        </div>
    );
};

export default Search;
