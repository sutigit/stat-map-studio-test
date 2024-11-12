import './App.css';
import { useEffect, useRef } from 'react';
import StatMapDisplay, { Country, AdministrativeLevel } from 'stat-map-display';

function App() {
  const viewRef = useRef<StatMapDisplay | null>(null);

  useEffect(() => {
    if (!viewRef.current) {
      viewRef.current = new StatMapDisplay({
        id: 'my-map',
        country: Country.FINLAND,
        administrativeLevel: AdministrativeLevel.MUNICIPALITY,
        style: {
          strokeWidth: 0.1,
        },
        settings: {
          select: false,
          highlight: false,
        }
      });
    }
  }, []);

  return (
    <main id="app">
      <div className="options">
        <p>Hello</p>
      </div>

      <div className='map-container'>
        <div id='my-map'></div>
      </div>
    </main>
  )
}

export default App
