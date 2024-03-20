import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import M from 'materialize-css';
import classnames from 'classnames';
import questions from '../questions.json';
import isEmpty from '../../utils/is-empty';
import correctNotification from '../../assets/assets/audio/correct-answer.mp3';
import wrongNotification from '../../assets/assets/audio/wrong-answer.mp3';
import buttonSound from '../../assets/assets/audio/button-sound.mp3';
import { useNavigate } from 'react-router-dom';

const Play = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        questions,
        currentQuestion: {},
        nextQuestion: {},
        previousQuestion: {},
        answer: '',
        numberOfQuestions: 0,
        numberOfAnsweredQuestions: 0,
        currentQuestionIndex: 0,
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        hints: 5,
        fiftyFifty: 2,
        usedFiftyFifty: false,
        nextButtonDisabled: false,
        previousButtonDisabled: true,
        previousRandomNumbers: [],
        time: {}
    });
    const [hintUsedForQuestion, setHintUsedForQuestion] = useState({});

    const correctSound = useRef(null);
    const wrongSound = useRef(null);
    const buttonSoundRef = useRef(null);
    let interval = useRef(null);

    useEffect(() => {
        correctSound.current = new Audio(correctNotification);
        wrongSound.current = new Audio(wrongNotification);
        buttonSoundRef.current = new Audio(buttonSound);

        return () => {
            clearInterval(interval.current);
        };
    }, []);

    useEffect(() => {
        if (!isEmpty(state.questions)) {
            const { questions, currentQuestionIndex } = state;
            const currentQuestion = questions[currentQuestionIndex];
            const nextQuestion = questions[currentQuestionIndex + 1];
            const previousQuestion = questions[currentQuestionIndex - 1];
            const answer = currentQuestion?.answer;

            setState(prevState => ({
                ...prevState,
                currentQuestion,
                nextQuestion,
                previousQuestion,
                numberOfQuestions: questions.length,
                answer,
                previousRandomNumbers: []
            }));
        }
    }, [state.questions, state.currentQuestionIndex]);

    useEffect(() => {
        if (state.numberOfAnsweredQuestions === 15) {
            endGame();
        }
    }, [state.numberOfAnsweredQuestions]);

    useEffect(() => {
        const countDownTime = Date.now() + 180000;
        interval.current = setInterval(() => {
            const now = new Date();
            const distance = countDownTime - now;
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                clearInterval(interval.current);
                setState(prevState => ({
                    ...prevState,
                    time: {
                        minutes: 0,
                        seconds: 0
                    }
                }), () => {
                    endGame();
                });
            } else {
                setState(prevState => ({
                    ...prevState,
                    time: {
                        minutes,
                        seconds,
                        distance
                    }
                }));
            }
        }, 1000);
        return () => clearInterval(interval.current);
    }, []);

    const displayQuestions = useCallback(() => {
        if (!isEmpty(state.questions)) {
            const { questions, currentQuestionIndex } = state;
            const currentQuestion = questions[currentQuestionIndex];
            const nextQuestion = questions[currentQuestionIndex + 1];
            const previousQuestion = questions[currentQuestionIndex - 1];
            const answer = currentQuestion?.answer;
            setState(prevState => ({
                ...prevState,
                currentQuestion,
                nextQuestion,
                previousQuestion,
                numberOfQuestions: questions.length,
                answer,
                previousRandomNumbers: []
            }));
        }
    }, [state.questions, state.currentQuestionIndex]);

    const handleOptionClick = (e) => {
        const { currentQuestion } = state;
        if (currentQuestion && e.target.innerHTML.toLowerCase() === currentQuestion.answer?.toLowerCase()) {
            setTimeout(() => {
                correctSound.current?.play();
            }, 500);
            correctAnswer();
        } else {
            setTimeout(() => {
                wrongSound.current?.play();
            }, 500);
            wrongAnswer();
        }
    };

    useEffect(() => {
        const handleTouchMove = (e) => {
            e.preventDefault(); // Prevent default behavior to ensure touch events are not blocked
            const { currentQuestion } = state;
            if (currentQuestion && e.target.innerHTML.toLowerCase() === currentQuestion.answer?.toLowerCase()) {
                setTimeout(() => {
                    correctSound.current?.play();
                }, 500);
                correctAnswer();
            } else {
                setTimeout(() => {
                    wrongSound.current?.play();
                }, 500);
                wrongAnswer();
            }
        };
    
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
    
        return () => {
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, [state]);
    
    
    

    const handleNextButtonClick = () => {
        playButtonSound();
        
        const { currentQuestionIndex, numberOfQuestions } = state;
        if (currentQuestionIndex + 1 < numberOfQuestions) {
            setState(prevState => ({
                ...prevState,
                currentQuestionIndex: prevState.currentQuestionIndex + 1
            }));
        } else if (currentQuestionIndex + 1 === numberOfQuestions) {
            if (state.numberOfAnsweredQuestions === 15) {
                endGame();
            }
        }
        setHintUsedForQuestion(prevState => ({
            ...prevState,
            [state.currentQuestionIndex]: false // Reset hint usage for current question
        }));
    };

    const handlePreviousButtonClick = () => {
        playButtonSound();
        if (state.previousQuestion !== undefined) {
            setState(prevState => ({
                ...prevState,
                currentQuestionIndex: prevState.currentQuestionIndex - 1
            }));
        }
    };

    const handleQuitButtonClick = () => {
        playButtonSound();
        if (window.confirm('Are you sure you want to quit?')) {
            navigate('/');
        }
    };

    const handleButtonClick = (e) => {
        switch (e.target.id) {
            case 'next-button':
                handleNextButtonClick();
                break;

            case 'previous-button':
                handlePreviousButtonClick();
                break;

            case 'quit-button':
                handleQuitButtonClick();
                break;

            default:
                break;
        }
    };

    const playButtonSound = () => {
        buttonSoundRef.current?.play();
    };

    const correctAnswer = () => {
        M.toast({
            html: 'Correct Answer!',
            classes: 'toast-valid',
            displayLength: 1500
        });
        setState(prevState => ({
            ...prevState,
            score: prevState.score + 1,
            correctAnswers: prevState.correctAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
        }));
    };

    const wrongAnswer = () => {
        navigator.vibrate(1000);
        M.toast({
            html: 'Wrong Answer!',
            classes: 'toast-invalid',
            displayLength: 1500
        });
        setState(prevState => ({
            ...prevState,
            wrongAnswers: prevState.wrongAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
        }));
        if (state.nextQuestion === undefined) {
            endGame();
        } else {
            displayQuestions();
        }
    };

    const showOptions = () => {
        const options = Array.from(document.querySelectorAll('.option'));
        options.forEach(option => {
            option.style.visibility = 'visible';
        });
        setState(prevState => ({
            ...prevState,
            usedFiftyFifty: false
        }));
    };
    const handleDisableButton = () => {
        if (state.previousQuestion === undefined || state.currentQuestionIndex === 0) {
            setState(prevState => ({
                ...prevState,
                previousButtonDisabled: true
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                previousButtonDisabled: false
            }));
        }
        if (state.nextQuestion === undefined || state.currentQuestionIndex + 1 === state.numberOfQuestions) {
            setState(prevState => ({
                ...prevState,
                nextButtonDisabled: true
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                nextButtonDisabled: false
            }));
        }
    };

    const handleFiftyFifty = () => {
        if (state.fiftyFifty > 0 && state.usedFiftyFifty === false) {
            const options = document.querySelectorAll('.option');
            const randomNumbers = [];
            let indexOfAnswer;
            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === state.answer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });
            let count = 0;
            do {
                const randomNumber = Math.round(Math.random() * 3);
                if (randomNumber !== indexOfAnswer) {
                    if (randomNumbers.length < 2 && !randomNumbers.includes(randomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                        randomNumbers.push(randomNumber);
                        count++;
                    } else {
                        while (true) {
                            const newRandomNumber = Math.round(Math.random() * 3);
                            if (!randomNumbers.includes(newRandomNumber) && newRandomNumber !== indexOfAnswer) {
                                randomNumbers.push(newRandomNumber);
                                count++;
                                break;
                            }
                        }
                    }
                }
            } while (count < 2);
            options.forEach((option, index) => {
                if (randomNumbers.includes(index)) {
                    option.style.visibility = 'hidden';
                }
            });
            setState(prevState => ({
                ...prevState,
                fiftyFifty: prevState.fiftyFifty - 1,
                usedFiftyFifty: true
            }));
        }
    };
    
    const handleHints = () => {
        const { currentQuestionIndex, hints, hintUsedForQuestion } = state;
        const newHintUsedForQuestion = { ...hintUsedForQuestion };
        if (!newHintUsedForQuestion.hasOwnProperty(currentQuestionIndex)) {
            newHintUsedForQuestion[currentQuestionIndex] = false;
        }
        if (hints > 0 && !newHintUsedForQuestion[currentQuestionIndex]) {
            const options = Array.from(document.querySelectorAll('.option'));
            let indexOfAnswer;
            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === currentQuestion.answer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });
            while (true) {
                const randomNumber = Math.round(Math.random() * 3);
                if (randomNumber !== indexOfAnswer && !state.previousRandomNumbers.includes(randomNumber)) {
                    options.forEach((option, index) => {
                        if (index === randomNumber) {
                            option.style.visibility = 'hidden';
                        }
                    });
                    setState(state => ({
                        ...state,
                        hints: state.hints - 1,
                        hintUsedForQuestion: {
                            ...newHintUsedForQuestion,
                            [currentQuestionIndex]: true
                        },
                        previousRandomNumbers: state.previousRandomNumbers.concat(randomNumber)
                    }));
                    break;
                }
                if (state.previousRandomNumbers.length >= 3) break;
            }
        }
    };
    ;
    
     
    

    const endGame = () => {
        const { score, numberOfQuestions, correctAnswers, wrongAnswers, fiftyFifty, hints } = state;
        const playerStats = {
            score,
            numberOfQuestions,
            numberOfAnsweredQuestions: correctAnswers + wrongAnswers,
            correctAnswers,
            wrongAnswers,
            fiftyFiftyUsed: 2 - fiftyFifty,
            hintsUsed: 5 - hints
        };
        console.log("Player stats:", playerStats);
        navigate('/play/quizSummary', { state: playerStats });
    };
    
    
    


    const { currentQuestion, currentQuestionIndex, fiftyFifty, hints, numberOfQuestions, time } = state;

    return (
        <Fragment>
            <Helmet><title>Quiz Page</title></Helmet>
            <Fragment>
                <audio ref={correctSound} src={correctNotification}></audio>
                <audio ref={wrongSound} src={wrongNotification}></audio>
                <audio ref={buttonSoundRef} src={buttonSound}></audio>
            </Fragment>
            <div className="questions">
                <h2>Quiz Mode</h2>
                <div className="lifeline-container">
                    <p>
                        <span onClick={handleFiftyFifty} className="mdi mdi-set-center mdi-24px lifeline-icon">
                            <span className="lifeline">{fiftyFifty}</span>
                        </span>
                    </p>
                    <p>
                        <span onClick={handleHints} className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon">
                            <span className="lifeline">{hints}</span>
                        </span>
                    </p>
                </div>
                <div className="timer-container">
                    <p>
                        <span className="left" style={{ float: 'left' }}>{currentQuestionIndex + 1} of {numberOfQuestions}</span>
                        <span className={classnames('right valid', {
                            'warning': time.distance <= 120000,
                            'invalid': time.distance < 30000
                        })}>
                            {time.minutes}:{time.seconds}
                            <span  className="mdi mdi-clock-outline mdi-24px"></span>
                        </span>
                    </p>
                </div>
                <h5>{currentQuestion?.question}</h5>
                <div className="options-container">
                    <p onClick={handleOptionClick} className="option">{currentQuestion?.optionA}</p>
                    <p onClick={handleOptionClick} className="option">{currentQuestion?.optionB}</p>
                </div>
                <div className="options-container">
                    <p onClick={handleOptionClick} className="option">{currentQuestion?.optionC}</p>
                    <p onClick={handleOptionClick} className="option">{currentQuestion?.optionD}</p>
                </div>

                <div className="button-container">
                    <button 
                        className={classnames('', {'disable': state.previousButtonDisabled})}
                        id="previous-button" 
                        onClick={handleButtonClick}>
                        Previous
                    </button>
                    <button 
                        className={classnames('', {'disable': state.nextButtonDisabled})}
                        id="next-button" 
                        onClick={handleButtonClick}>
                        Next
                    </button>
                    <button id="quit-button" onClick={handleButtonClick}>Quit</button>
                </div>
            </div>
        </Fragment>
    );
}

export default Play
