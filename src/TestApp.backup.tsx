function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'black', fontSize: '24px' }}>App is Working!</h1>
        <p style={{ color: 'gray' }}>Testing basic React rendering</p>
        <div
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#FBC02D',
            borderRadius: '50%',
            margin: '20px auto',
          }}
        ></div>
      </div>
    </div>
  );
}

export default App;
