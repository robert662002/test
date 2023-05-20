import React from 'react'
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Hall from '../assets/halls.jpg'
import axios from '../api/axios'
//import axios from '../api/axios'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const MAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

const REGISTER_URL = '/register';

const Signup = () => {

  const userRef = useRef();
  const errRef = useRef();
  const mailRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [mail, setMail] = useState('');
  const [validMail, setValidMail] = useState(false);
  const [mailFocus, setMailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    mailRef.current.focus();
  }, [])

  useEffect(() => {
    setValidMail(MAIL_REGEX.test(mail));
  }, [mail])

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user])

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd, mail])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = MAIL_REGEX.test(mail);
    const v2 = USER_REGEX.test(user);
    const v3 = PWD_REGEX.test(pwd);

    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(REGISTER_URL,
        JSON.stringify({ mail, user, pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      // TODO: remove console.logs before deployment
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response))
      setSuccess(true);
      //clear state and controlled inputs
      setUser('');
      setMail('')
      setPwd('');
      setMatchPwd('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed')
      }
      errRef.current.focus();
    }
  }


  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <div className='md:mt-[-100px] grid h-[50%] w-full grid-cols-1 md:grid-cols-2'>
          <div className='max-h-full hidden md:block'>
            <img className='w-full h-screen object-contain' src={Hall} alt='/' />
          </div>
          <div className='bg-[#000300] flex flex-col items-center justify-center'>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <form className='max-w-[400px] w-full items-center justify-center mx-auto bg- p-4 border border-white rounded-sm text-white' onSubmit={handleSubmit}>
              <h2 className='text-3xl font-bold text-center py-6'>SIGN UP :)</h2>
              <div className='flex flex-col py-2'>
                <label>Email
                  <FontAwesomeIcon icon={faCheck} className={validMail ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validMail || !mail ? "hide" : "invalid"} />
                </label>
                <input
                  type='text'
                  className='text-black w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm'
                  ref={mailRef}
                  autoComplete='off'
                  onChange={(e) => setMail(e.target.value)}
                  value={mail}
                  required
                  aria-invalid={validMail ? "false" : "true"}
                  aria-describedby="mailnote"
                  onFocus={() => setMailFocus(true)}
                  onBlur={() => setMailFocus(false)}
                />
                <p id="mailnote" className={mailFocus && mail && !validMail ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  enter a valid Email
                </p>
              </div>
              <div className='flex flex-col py-2'>
                <label>Name:<FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                </label>
                <input
                  type='text'
                  className='text-black w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm '
                  id="username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                />
                <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  4 to 24 characters.<br />
                  Must begin with a letter.<br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </div>
              <div className='flex flex-col py-2'>
                <label>Password
                  <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                </label>
                <input
                  type='password' className='text-black w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm ' id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)} />
                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  8 to 24 characters.<br />
                  Must include uppercase and lowercase letters, a number and a special character.<br />
                  Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                </p>
              </div>
              <div className='flex flex-col py-2'>
                <label>Retype Password <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                </label>
                <input type='password' className='text-black w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm ' id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />
                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must match the first password input field.
                </p>
              </div>
              <div className='flex flex-col items-center justify-center'>
                <button disabled={!validName || !validPwd || !validMatch ? true : false} className='text-black border w-[75%] my-5 py-2 bg-[#00df9a] '>Sign In</button></div>
              <div className='text-center'>
                <p>Already Created ? Login</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Signup
