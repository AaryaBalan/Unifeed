'use client';
import styles from './page.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import Card from './Card';
import Lenis from "@studio-freight/lenis";
import { useUser } from "@clerk/clerk-react";
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
  const { user } = useUser(); // Get logged-in user

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

    if (!user) {
      console.error("User not found or not logged in.");
      return;
    }

    const userId = user.id; // Clerk user ID
    console.log("User ID:", userId);

    const extractedElements = [answers[3], answers[4]].join(" ");

    try {
      // Fetch extracted keywords
      const response = await fetch('http://localhost:8000/extract-keyword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: extractedElements }),
      });

      if (!response.ok) throw new Error("Failed to extract keywords");

      const data = await response.json();
      console.log("Extracted Keywords Response:", data);

      // ✅ Extract the `keywords` array safely
      const extractedKeywords = Array.isArray(data.keywords) ? data.keywords : [];

      console.log("Extracted Keywords:", extractedKeywords);


      // ✅ Merge with answers[0] safely
      const mergedKeywords = Array.from(new Set([...answers[0], ...extractedKeywords]));
      console.log(mergedKeywords);

      // Save keywords to backend
      const saveResponse = await fetch('http://localhost:8000/save-keyword/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid: userId, keywords: mergedKeywords }),
      });

      if (!saveResponse.ok) throw new Error("Failed to save keywords");

      console.log("Saved Keywords:", await saveResponse.json());
    } catch (error) {
      console.error("Error:", error);
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