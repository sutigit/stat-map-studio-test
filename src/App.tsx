import './App.css';
import { useEffect, useRef } from 'react';
import StatMapDisplay, { Country, AdministrativeLevel, ResolutionLevel } from 'stat-map-display';

function App() {
  const viewRef = useRef<StatMapDisplay | null>(null);

  useEffect(() => {
    if (!viewRef.current) {
      viewRef.current = new StatMapDisplay({
        id: 'stat-map',
        country: Country.FINLAND,
        administrativeLevel: AdministrativeLevel.MUNICIPALITY,
        resolution: ResolutionLevel.LEVEL_1,
        style: {
          strokeWidth: 0.2,
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
        <div id='stat-map'></div>
      </div>
    </main>
  )
}

export default App
