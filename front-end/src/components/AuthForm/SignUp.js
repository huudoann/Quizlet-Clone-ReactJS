import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';       //
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';  // add icon EyeSlash for hide/unhide password


const SignUpForm = ({ switchForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {

    console.log('SignUp:', { email, password});

  };

  return (
    <div className="auth-form">
      <h2>Sign up</h2>
      <form>

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <div className="password-container">
          <label>Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className="toggle-password-icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>

        <button type="button" onClick={handleSignUp}>Sign up</button>

        <p>
          <span onClick={() => switchForm('login')}>Already have an account? Log in</span>
        </p>
        
      </form>
    </div>
  );
};

export default SignUpForm;






//  Form contains Date of Birth
//
//
//
// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';       //
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';  // add icon EyeSlash for hide/unhide password


// const SignUpForm = ({ switchForm }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [day, setDay] = useState('');
//   const [month, setMonth] = useState('');
//   const [year, setYear] = useState('');

//   const handleSignUp = () => {

//     console.log('SignUp:', { email, password, day, month, year });

//   };

//   Generate options for Dob
  
//   const generateOptions = (start, end, reverse = false) => {
//     const options = [];
//     for (let i = start; reverse ? i >= end : i <= end; reverse ? i-- : i++) {
//       options.push(
//         <option key={i} value={i}>
//           {i}
//         </option>
//       );
//     }
//     return options;
//   };

//   return (
//     <div className="auth-form">
//       <h2>Sign up</h2>
//       <form>

//         <div className="dob-container">
//           <label>Birth Day:</label>
//           <div>
//             <select value={month} onChange={(e) => setMonth(e.target.value)} required>
//               <option value="">Month</option>
//               {generateOptions(1, 12)};
//             </select>
//             <select value={day} onChange={(e) => setDay(e.target.value)} required>
//               <option value="">Day</option>
//               {generateOptions(1, 31)};
//             </select>
//             <select value={year} onChange={(e) => setYear(e.target.value)} required>
//               <option value="">Year</option>
//               {generateOptions(new Date().getFullYear(), 1895, true)}
//             </select>
//           </div>
//         </div>

//         <label>Email:</label>
//         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         <div className="password-container">
//           <label>Password:</label>
//           <input
//             type={showPassword ? 'text' : 'password'}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <FontAwesomeIcon
//             icon={showPassword ? faEyeSlash : faEye}
//             className="toggle-password-icon"
//             onClick={() => setShowPassword(!showPassword)}
//           />
//         </div>
//         <button type="button" onClick={handleSignUp}>Sign up</button>
//         <p>
//           <span onClick={() => switchForm('login')}>Already have an account? Log in</span>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default SignUpForm;
