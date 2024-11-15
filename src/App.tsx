import './App.css';
import { useEffect, useRef } from 'react';
import StatMapDisplay, { Country, AdministrativeLevel, ResolutionLevel } from 'stat-map-display';

function App() {
  const statMapRef = useRef<StatMapDisplay | null>(null);

  useEffect(() => {
    if (!statMapRef.current) {
      statMapRef.current = new StatMapDisplay({
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

  const exportMap = () => {
    console.log('helllo');
  }

  return (
    <main id="app">
      <div className="options">
        <p>Hello</p>
      </div>

      <div className='map-container'>
        <div id='stat-map' style={{height: '100%', aspectRatio: '9/16', overflow: 'hidden', borderRadius: '1rem'}}></div>
      </div>

      <div>
        <button 
          style={{backgroundColor: 'purple', marginLeft: '1rem'}}
          onClick={exportMap}>
          EXPORT
        </button>
      </div>
    </main>
  )
}

export default App
