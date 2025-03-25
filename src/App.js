import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import questions from './data/questions.json';
import scores from './data/scores.json';

// Initialize EmailJS with your public key
emailjs.init("Bi0utAK6Op-F9REKC");

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(-1); // -1 represents name input screen
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getThemeClass = () => {
    if (currentQuestion === -1) return 'theme-0';
    if (showResult) return 'theme-12';
    return `theme-${(currentQuestion % 12) + 1}`;
  };

  const calculateRMSE = (userAnswers, linAnswers) => {
    let sumSquaredDiff = 0;
    Object.keys(userAnswers).forEach(q => {
      const diff = userAnswers[q] - linAnswers[`q${parseInt(q) + 1}`];
      sumSquaredDiff += diff * diff;
    });
    return Math.sqrt(sumSquaredDiff / Object.keys(userAnswers).length);
  };

  const determineHouse = () => {
    const rmseScores = scores.map(lin => ({
      lin_name: lin.lin_name,
      rmse: calculateRMSE(answers, lin)
    }));
    
    return rmseScores.reduce((prev, current) => 
      prev.rmse < current.rmse ? prev : current
    );
  };

  const handleNameSubmit = () => {
    if (!name.trim()) return;
    setCurrentQuestion(0);
  };

  const sendResultEmail = async (result) => {
    setIsSubmitting(true);
    try {
      const templateParams = {
        to_email: 'dhruv575@gmail.com',
        from_name: name,
        subject: 'New Sorting Hat Result',
        message: `Name: ${name}\nLin Result: ${result.lin_name}\n\nAnswers:\n${
          Object.entries(answers)
            .map(([q, a]) => `Q${parseInt(q) + 1}: ${a}`)
            .join('\n')
        }`
      };

      await emailjs.send(
        'service_8k0pn1w',
        'template_m1s381d',
        templateParams
      );
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSubmitting(false);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    if (selectedValue === null) return;
    
    setIsTransitioning(true);
    setAnswers(prev => ({ ...prev, [currentQuestion]: selectedValue }));
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedValue(null);
      } else {
        const result = determineHouse();
        setResult(result);
        sendResultEmail(result);
      }
      setIsTransitioning(false);
    }, 500);
  };

  const getProgressWidth = () => {
    if (currentQuestion === -1) return '0%';
    return `${((currentQuestion + 1) / questions.length) * 100}%`;
  };

  const choices = [1, 2, 3, 4, 5];

  return (
    <div className={`sorting-hat-container ${getThemeClass()}`}>
      <AnimatePresence mode="wait">
        {currentQuestion === -1 ? (
          <motion.div
            key="name-input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="question-card name-input-card"
          >
            <h1>Welcome to the Sorting Hat</h1>
            <p>Before we begin, please tell us your name</p>
            <div className="name-input-container">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="name-input"
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
              />
              <button
                onClick={handleNameSubmit}
                disabled={!name.trim()}
                className={`next-button ${!name.trim() ? 'disabled' : ''}`}
              >
                Begin
              </button>
            </div>
          </motion.div>
        ) : !showResult ? (
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="question-card"
          >
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: getProgressWidth() }}
              />
            </div>
            
            <h2>{questions[currentQuestion].question}</h2>
            
            <div className="choices-container">
              <div className="choice-labels">
                <span>{questions[currentQuestion].one_moniker}</span>
                <span>{questions[currentQuestion].five_moniker}</span>
              </div>
              
              <div className="choices-grid">
                {choices.map((value) => (
                  <button
                    key={value}
                    onClick={() => setSelectedValue(value)}
                    className={`choice-button ${selectedValue === value ? 'selected' : ''}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="navigation-container">
              <p>
                Question {currentQuestion + 1} of {questions.length}
              </p>
              
              <button
                onClick={handleNext}
                disabled={selectedValue === null || isSubmitting}
                className={`next-button ${selectedValue === null || isSubmitting ? 'disabled' : ''}`}
              >
                {currentQuestion === questions.length - 1 ? (isSubmitting ? 'Sending...' : 'Finish') : 'Next Question'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="result-card question-card"
          >
            <h1>✨ The Mystery Begins...</h1>
            <h2>
              Thank you for completing the sorting, {name}!
            </h2>
            <p>
              Your lin assignment is a carefully guarded secret that will be revealed to you soon.
            </p>
            <p>
              The sorting hat is processing your answers with ancient magic...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
