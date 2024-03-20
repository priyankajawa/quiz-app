import React, { useState, useEffect, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const QuizSummary = ({ location = {} }) => {
    const { state: locationState } = location;
    const [state, setState] = useState({
        score: 0,
        numberOfQuestions: 0,
        numberOfAnsweredQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        hintsUsed: 0,
        fiftyFiftyUsed: 0
    });

    useEffect(() => {
        if (locationState) {
            setState(locationState);
        }
    }, [locationState]);

    let remark;
    const userScore = state.score;
    // Logic to determine remark based on user's score...

    return (
        <Fragment>
            <Helmet><title>Quiz App - Summary</title></Helmet>
            <div className="quiz-summary">
                <div style={{ textAlign: 'center' }}>
                    <span className="mdi mdi-check-circle-outline success-icon"></span>
                </div>
                <h1>Quiz has ended</h1>
                
                <section>
                    <ul>
                        <li>
                            <Link to="/play/quiz">Play Again</Link>
                        </li>
                        <li>
                            <Link to="/">Back to Home</Link>
                        </li>
                    </ul>
                </section>
            </div>
        </Fragment>
    );
};
export default QuizSummary;