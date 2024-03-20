import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ name, setName, email, setEmail, newPassword, setNewPassword, mobileNumber, setMobileNumber }) => {
    const passwordRef = useRef();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return;
        console.log('Form submitted with username:', name, 'password:', newPassword, 'email:', email, 'and mobileNumber:', mobileNumber);
        setName('');
        setEmail('');
        setNewPassword('');
        setMobileNumber('');
        navigate('/play/Quiz');
    };

    return (
        <div>
            <h1>Create your Own Account</h1>
            <form className='name' onSubmit={handleSubmit}>
                <label htmlFor='Name'>Register</label>
                <input
                    id="Name"
                    type="text"
                    placeholder='Create your UserName'
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label className='email' htmlFor='email'>Email</label>
                <input
                    id="Email"
                    type="text"
                    placeholder='Type Your Email Id'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label className='password' htmlFor='password'>Password</label>
                <input
                    ref={passwordRef}
                    id="Password"
                    type="password"
                    placeholder='create you password here'
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <label className='mobilenumber' htmlFor='MobileNumber'>MobileNumber</label>
                <input
                    id="MobileNumber"
                    placeholder='Enter you Mobile Number'
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                />
                <p>
                    <button className='wrap' type='Submit'>Submit</button>
                </p>
            </form>
        </div>
    );
};

export default SignUp;
