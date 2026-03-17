import { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import axios from 'axios';
import SolarSystem from './components/SolarSystem';

function App() {
  const [earthSpeed, setEarthSpeed] = useState(1);
  const [moonSpeed, setMoonSpeed] = useState(1);
  const [earthSpinSpeed, setEarthSpinSpeed] = useState(1);
  const [presetName, setPresetName] = useState('');
  const [savedPresets, setSavedPresets] = useState([]);
  const [showOrbits, setShowOrbits] = useState(true);
  const timeRef = useRef(null);

  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/presets');
      setSavedPresets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const savePreset = async () => {
    if (!presetName) return alert("Enter a name for your preset");
    try {
      await axios.post('http://localhost:5000/api/presets', {
        name: presetName,
        earthOrbitSpeed: earthSpeed,
        moonOrbitSpeed: moonSpeed,
        earthSpinSpeed: earthSpinSpeed
      });
      setPresetName('');
      fetchPresets();
    } catch (err) {
      console.error(err);
    }
  };

  const loadPreset = (preset) => {
    setEarthSpeed(preset.earthOrbitSpeed);
    setMoonSpeed(preset.moonOrbitSpeed);
    setEarthSpinSpeed(preset.earthSpinSpeed || 1);
  };

  return (
    <div className="w-screen h-screen relative bg-black font-sans text-white">

      {/* Time Tracking Pill (Floating top right) */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-gray-900/80 border border-gray-700 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl shadow-blue-900/20">
          <span
            ref={timeRef}
            className="font-mono text-emerald-400 font-bold tracking-widest text-sm whitespace-nowrap"
          >
            Year 0 | Month 00 | Day 000 | Lunar Cycles: 000
          </span>
        </div>
      </div>

      {/* Control Panel */}
      <div className="absolute top-0 left-0 z-10 p-6 w-80 max-h-screen overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Orbital Engine
        </h1>

        <div className="bg-gray-900/80 p-5 rounded-xl border border-gray-700 backdrop-blur-md mb-4 shadow-xl">
          <div className="mb-5">
            <label className="block text-sm text-gray-400 mb-2">
              Earth Orbit Speed: {earthSpeed}x</label>
            <input
              type="range" min="0" max="10" step="0.1"
              value={earthSpeed} onChange={(e) => setEarthSpeed(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Earth Spin Speed Slider */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              Earth Spin (Days): {earthSpinSpeed}x</label>
            <input
              type="range" min="0" max="10" step="0.1"
              value={earthSpinSpeed} onChange={(e) => setEarthSpinSpeed(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              Moon Orbit Speed: {moonSpeed}x</label>
            <input
              type="range" min="0" max="10" step="0.1"
              value={moonSpeed} onChange={(e) => setMoonSpeed(parseFloat(e.target.value))}
              className="w-full accent-gray-400 cursor-pointer"
            />
          </div>

          {/* Toggle Orbit Lines Button */}
          <div className="mb-4">
            <button
              onClick={() => setShowOrbits(!showOrbits)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 rounded transition-colors flex items-center justify-center gap-2"
            >
              <div className={`w-3 h-3 rounded-full ${showOrbits ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
              {showOrbits ? 'Hide Orbit Lines' : 'Show Orbit Lines'}
            </button>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <input
              type="text"
              placeholder="Preset Name (e.g., Hyperdrive)"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="w-full bg-gray-800 text-white rounded px-3 py-2 mb-2 border border-gray-600 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={savePreset}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded transition-colors"
            >
              Save to Database
            </button>
          </div>
        </div>

        {savedPresets.length > 0 && (
          <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-700 backdrop-blur-md">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Saved Configurations</h3>
            <div className="flex flex-col gap-2">
              {savedPresets.map((preset) => (
                <button
                  key={preset._id}
                  onClick={() => loadPreset(preset)}
                  className="text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded border border-gray-600 transition-colors text-sm flex justify-between items-center"
                >
                  <span>{preset.name}</span>
                  <span className="text-gray-500 text-xs">(E:{preset.earthOrbitSpeed} M:{preset.moonOrbitSpeed})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Canvas camera={{ position: [0, 15, 35], fov: 45 }}>
        <color attach="background" args={['#020202']} />

        <Suspense fallback={null}>
          <SolarSystem
            earthSpeed={earthSpeed}
            moonSpeed={moonSpeed}
            earthSpinSpeed={earthSpinSpeed}
            showOrbits={showOrbits}
            timeRef={timeRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;