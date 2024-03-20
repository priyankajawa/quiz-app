import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // Import useHistory
import Home from './Component/Home';
import QuizInstructions from './Component/quiz/QuizInstructions';
import Play from './Component/quiz/Play';
import QuizSummary from './Component/quiz/QuizSummary';
import { useState } from 'react';
import Login from './Component/quiz/Login';
import SignUp from './Component/quiz/SignUp';


function App() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate =useNavigate();
  const [name,setName] =useState('');
  const [email,setEmail]=useState('');
  const [newPassword,setNewPassword] =useState('');
  const [mobileNumber,setMobileNumber]=useState('');



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName) return;
    console.log('Form submitted with username:', userName, 'and password:', password);
    setUserName('');
    setPassword('');
    // // Use Navigate to redirect to '/play/Quiz'
    // return <Navigate to="/play/Quiz" />;
    navigate('/play/Quiz')
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/play/instructions" element={<QuizInstructions />} />
      {/* Define the /play route to render the Play component */}
      <Route path="/play/Quiz" element={<Play />} />
      <Route path="/play/QuizSummary" element={<QuizSummary />} />
      <Route
        path="/login"
        element={
          <Login
            userName={userName}
            setUserName={setUserName}
            handleSubmit={handleSubmit}
            password={password}
            setPassword={setPassword}
          />
        }
      />
      <Route path ="/register" element={
        <SignUp 
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        mobileNumber={mobileNumber}
        setMobileNumber={setMobileNumber}
        />
      }
      />
    </Routes>
  );
}

export default App;

