import React, { useRef } from 'react';

const Login = ({ username, setUserName, password, setPassword, handleSubmit }) => {
    const usernameRef = useRef();
    const passwordRef = useRef();


    return (
        <section>
            <h1>Login Page</h1>
            <form className='userName' onSubmit={handleSubmit}>
                <label htmlFor='userName'>User Name</label><br />
                <input
                    autoFocus
                    ref={usernameRef}
                    id='userName'
                    type='text'
                    placeholder='Please Enter your User Name here'
                    required
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                /> <br />

                <label className='pswd' htmlFor='pswd'>Password</label><br />
                <input
                    ref={passwordRef}
                    id='pswd'
                    type='password'
                    placeholder='Enter your password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <p>
                    <button className='wrap' type='Submit'>Submit</button>
                </p>
            </form>
        </section>
    );
};

export default Login;
