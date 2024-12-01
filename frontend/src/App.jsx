import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CakeProcessor from './components/CakeProcessor';

function App() {
  const [cakeCount, setCakeCount] = useState(0);
  const [burntCakeCount, setBurntCakeCount] = useState(0);

  const handleCakeReady = () => {
    setCakeCount((prev) => prev + 1);
  };

  const handleCakeBurnt = () => {
    setBurntCakeCount((prev) => prev + 1);
  };

  return (
    <>
      <ToastContainer />
      <h1>Django Channels Bakery</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="card">You have {cakeCount} 🎂 cakes</div>
        <div className="card">
          <img
            src="/pngtree-bakery.jpg"
            alt="Bakery"
            style={{ width: '150px', height: 'auto' }}
          />
        </div>
        <div className="card">You have {burntCakeCount} 🔥 burnt cakes</div>
      </div>
      <CakeProcessor onCakeReady={handleCakeReady} onCakeBurnt={handleCakeBurnt} />
    </>
  );
}

export default App;
