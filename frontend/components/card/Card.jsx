import styles from './style.module.scss';
import { useTransform, motion, useScroll } from 'framer-motion';
import { useRef, useState } from 'react';

const Card = ({ i, question, options, type, progress, range, targetScale, onAnswer, selectedAnswer }) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    });

    const scale = useTransform(progress, range, [1, targetScale]);

    // Local state for search input & selected tags
    const [searchInput, setSearchInput] = useState('');
    const [filteredTags, setFilteredTags] = useState(options || []);
    const [selectedTags, setSelectedTags] = useState(selectedAnswer || []);

    const handleSelect = (value) => {
        onAnswer(i, value);
    };

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
        setFilteredTags(options.filter(tag => tag.toLowerCase().includes(e.target.value.toLowerCase())));
    };

    const handleTagSelect = (tag) => {
        if (!selectedTags.includes(tag)) {
            const updatedTags = [...selectedTags, tag];
            setSelectedTags(updatedTags);
            onAnswer(i, updatedTags);
        }
    };
    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
        setSelectedTags(updatedTags);
        onAnswer(i, updatedTags);
    };


    return (
        <div ref={container} className={styles.cardContainer}>
            <motion.div
                style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
                className={styles.card}
            >
                <h2>{question}</h2>

                <div className={styles.body}>
                    <div className={styles.body}>
                        {type === 'mcq' && (
                            <div className={styles.optionsWithImage}>
                                <div className={styles.options}>
                                    {options.map((option, index) => (
                                        <button
                                            key={index}
                                            className={`${styles.optionButton} ${selectedAnswer === option ? styles.selected : ''}`}
                                            onClick={() => handleSelect(option)}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                <div className={styles.imageContainer}>
                                    <img src="social.png" alt="Descriptive Alt Text" className={styles.image} />
                                </div>
                            </div>
                        )}
                    </div>

                    {type === 'text' && (
                        <textarea
                            className={styles.textarea}
                            placeholder="Type your answer..."
                            value={selectedAnswer || ''}
                            onChange={(e) => handleSelect(e.target.value)}
                        />
                    )}

                    {type === 'search' && (
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={handleSearch}
                                placeholder="Search interests..."
                                className={styles.searchBar}
                            />

                            <div className={styles.suggestions}>
                                {filteredTags.map((tag) => (
                                    <button key={tag} onClick={() => handleTagSelect(tag)} className={styles.tagButton}>
                                        {tag}
                                    </button>
                                ))}
                            </div>

                            <div className={styles.selectedTags}>
                                {selectedTags.map((tag) => (
                                    <span key={tag} className={styles.selectedTag}>
                                        {tag}
                                        <button className={styles.removeTag} onClick={() => handleRemoveTag(tag)}>❌</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </motion.div>
        </div>
    );
};

export default Card;