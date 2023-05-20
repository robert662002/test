import React from 'react'
import Hall from '../assets/halls.jpg'
import AuthContext from '../context/AuthProvider'
import { useRef, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
const LOGIN_URL = '/auth'
const Login = () => {

    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href="#">Go to Home</a>
                    </p>
                </section>
            ) : (
                <div className='md:mt-[-100px] grid h-[50%] w-full grid-cols-1 md:grid-cols-2'>
                    <div className='max-h-full hidden md:block'>
                        <img className='w-full h-screen object-contain' src={Hall} alt='/' />
                    </div>
                    <div className='bg-[#000300] flex flex-col justify-center'>
                        <form className='max-w-[400px] w-full mx-auto  p-4 border border-white rounded-sm text-white' onSubmit={handleSubmit}>
                            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                            <h2 className='text-4xl font-bold text-center py-6'>LOG IN :)</h2>
                            <div className='flex flex-col py-2'>
                                <label>Email</label>
                                <input
                                    type='text'
                                    className='text-black w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm' id="username"
                                    ref={userRef}
                                    autoComplete="off"
                                    onChange={(e) => setUser(e.target.value)}
                                    value={user}
                                    required
                                />
                            </div>
                            <div className='flex flex-col py-2'>
                                <label>Password</label>
                                <input
                                    type='password'
                                    className='text-black w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm'
                                    id="password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                    required
                                />
                            </div>
                            <div className='flex flex-col items-center justify-center'>
                                <button className='text-black border w-[75%] my-5 py-2 bg-[#00df9a] '>Sign In</button></div>
                            <div className='text-center'>
                                <p>Create an account</p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )


}

export default Login
