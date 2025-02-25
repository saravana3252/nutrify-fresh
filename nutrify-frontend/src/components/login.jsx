import { useEffect } from 'react';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../context/userContext';

function Login() {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState({
    type: '',
    text: '',
  });
  const [isLoading,setIsLoading] =useState(false)
  const loggedData = useContext(userContext);

  const navigate = useNavigate();

  function HandleSubmit(event) {
    event.preventDefault();
    setIsLoading(true)
    fetch('https://nutrify-fresh.onrender.com/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 404) {
          setMessage({ type: 'error', text: 'Email does not exist' });
        } else if (res.status === 403) {
          setMessage({ type: 'error', text: 'Incorrect password' });
        }

        setTimeout(() => {
          setMessage({ type: 'invisible-msg', text: '' });
        }, 5000);
        return res.json();
      })
      .then((datas) => {
        if (datas.token !== undefined) {
          localStorage.setItem('nutrify-users', JSON.stringify(datas));
          loggedData.setloggedUser(datas);
          navigate('/home');
        }
      })
      .catch((err) => {
        console.log(err);
      }).finally(()=>{
        setIsLoading(false)
      })
  }

  function HandleInput(event) {
    setData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  return (
    <section className="form-container">
      <form className="form form-login" onSubmit={HandleSubmit}>
        <h1 className="form-heading">Start Your Fitness</h1>
        <input
          className="form-control"
          type="email"
          placeholder="Enter your email"
          required
          onChange={HandleInput}
          name="email"
          value={data.email}
        />
        <input
          className="form-control"
          type="password"
          placeholder="Enter your password"
          required
          maxLength={10}
          onChange={HandleInput}
          name="password"
          value={data.password}
        />
        <button className="btn btn-md btn-primary">{isLoading ? "LOADING..." :"LOGIN"}</button>
        <p className="p-regis">
          Not Registered?{' '}
          <Link className="link-regis" to="/register">
            Register
          </Link>
        </p>
        <p className={message.type}>{message.text}</p>
      </form>
    </section>
  );
}

export default Login;
