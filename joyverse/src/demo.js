import React from 'react';

const LoginPages = () => {
  return (
    <div style={styles.container}>
      <div style={styles.background}>
        <div style={styles.letters}>
          {/* Stylized letters */}
          {['e', 'd', 'f', 'c', 'b', 'g'].map((letter, index) => (
            <span key={index} style={styles.letter}>{letter}</span>
          ))}
        </div>
        <div style={styles.loginBox}>
          <input type="text" placeholder="username" style={styles.input} />
          <input type="password" placeholder="password" style={styles.input} />
          <button style={styles.button}>login</button>
        </div>
        <div style={styles.title}>JoyVerse</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8efd4', // Light beige
  },
  background: {
    position: 'relative',
    width: '400px',
    height: '500px',
    background: 'linear-gradient(to bottom, #f8efd4 50%, #ff8700 50%)', // Beige to orange split
    borderRadius: '10px',
    overflow: 'hidden',
  },
  letters: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    fontSize: '40px',
    color: '#ffa03b', // Bright orange for letters
  },
  letter: {
    margin: '5px',
    fontWeight: 'bold',
  },
  loginBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    textAlign: 'center',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#ff8700',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  title: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '24px',
    color: '#ffffff',
    fontFamily: 'cursive',
  },
};

export default LoginPages;