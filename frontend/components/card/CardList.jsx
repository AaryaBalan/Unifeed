'use client';
import styles from './page.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import Card from './Card';
import Lenis from "@studio-freight/lenis";

const tags = [
    "Technology", "Health", "Business", "Entertainment", "Science", "Education", "Sports", "Finance",
    "Art", "Music", "Fashion", "Travel", "Food", "Gaming", "Politics", "Environment",
    "History", "Culture", "Psychology", "Space", "AI", "Blockchain", "Cryptocurrency", "Startups",
    "Marketing", "Social Media", "Photography", "Film", "Literature", "Fitness", "Nutrition", "Wellness",
    "DIY", "Crafts", "Parenting", "Relationships", "Self Improvement", "Productivity", "Mindfulness",
    "Cybersecurity", "Data Science", "Machine Learning", "Robotics", "Virtual Reality", "Augmented Reality",
    "Renewable Energy", "Sustainability", "Climate Change", "Wildlife", "Adventure"
];

const questions = [
    { question: "Search and select your interests", type: "search", options: tags },
    { question: "How often do you consume content?", type: "mcq", options: ["Daily", "Weekly", "Monthly", "Rarely"] },
    { question: "Which platforms do you use?", type: "mcq", options: ["YouTube", "Instagram", "Twitter", "LinkedIn"] },
    { question: "Describe your ideal content in a few words", type: "text", options: [] },
    { question: "What kind of creators do you follow?", type: "text", options: [] }
];

export default function Home() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    });

    const [answers, setAnswers] = useState({});
    const [visibleTags, setVisibleTags] = useState(15); // Number of tags visible initially

    useEffect(() => {
        const lenis = new Lenis();
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }, []);

    const handleAnswer = (index, value) => {
        if (index === 0 && Array.isArray(value) && value.length > 10) {
            alert("You can select a maximum of 10 tags.");
            return;
        }
        setAnswers((prev) => ({ ...prev, [index]: value }));
    };

    const handleShowMoreTags = () => {
        setVisibleTags((prev) => prev + 15); // Show 15 more tags when "Show More" is clicked
    };

    const handleSubmit = async () => {
      console.log("User Answers:", answers);
  
      // Extract elements at index 3 and 4 from the answers array
      const extractedElements = [answers[3], answers[4]].join(" "); // Combine the two answers into a single string
  
      try {
          // Make a POST request to the 'extract-keyword' URL
          const response = await fetch('http://localhost:8000/extract-keyword', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ description: extractedElements }), // Send the combined string as 'description'
          });
  
          // Check if the response is ok
          if (!response.ok) {
              const errorData = await response.json(); // Log the error response
              console.error("Error Response:", errorData);
              throw new Error('Network response was not ok');
          }
  
          // Parse the JSON response
          const data = await response.json();
  
          // Store the response in a new variable
          const extractedKeywordsResponse = data;
  
          console.log("Extracted Keywords Response:", extractedKeywordsResponse);
  
          // You can now use the extractedKeywordsResponse variable as needed
      } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
      }
  };

    return (
        <main ref={container} className={styles.main}>
            {questions.map((question, i) => {
                const targetScale = 1 - ((questions.length - i) * 0.05);

                // For the first question (tags), limit the number of visible options
                const options = i === 0 ? question.options.slice(0, visibleTags) : question.options;

                return (
                    <Card
                        key={`q_${i}`}
                        i={i}
                        {...question}
                        options={options} // Pass the limited options
                        progress={scrollYProgress}
                        range={[i * 0.25, 1]}
                        targetScale={targetScale}
                        onAnswer={handleAnswer}
                        selectedAnswer={answers[i]}
                    />
                );
            })}

            {/* Show "Show More" button if there are more tags to display */}
            {visibleTags < tags.length && (
                <div className={styles.showMoreContainer}>
                    <button className={styles.showMoreButton} onClick={handleShowMoreTags}>
                        Show More
                    </button>
                </div>
            )}

            <div className={styles.submitContainer}>
                <button className={styles.submitButton} onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </main>
    );
}