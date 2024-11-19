import './App.css';
import { useEffect, useRef } from 'react';

import StatMapDisplay, { Country, AdministrativeLevel, ResolutionLevel } from 'stat-map-display';

// fake data
import fin_timeseries_data from './test_data/fin_timeseries_data.json';

// My components
import MediaExporter from './components/mediaExporter';

function App() {
  const statMapRef = useRef<StatMapDisplay | null>(null);
  const statMapDiv = useRef<HTMLDivElement | null>(null);

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

      // Style features according to selected(initial) year of timeseries
      // statMapRef.current.forEach('feature', (feature) => {
      //   feature.setStyle({
      //     fill: 'rgba(0, 0, 0, 0.1)',
      //   });
      // }
    }
  }, []);


  const playTimeseries = () => {
    console.log(fin_timeseries_data.meta.minYear);
  };

  return (
    <main id="app">
      <div className="options">
        <button onClick={playTimeseries}>
          Play timeseries
        </button>
      </div>

      <div className='map-container'>
        <div id='stat-map' ref={statMapDiv} style={{ height: '100%', aspectRatio: '9/16', overflow: 'hidden', borderRadius: '1rem' }}></div>
      </div>

      <div>
        <MediaExporter statMapRef={statMapRef} statMapDiv={statMapDiv}/>
      </div>
    </main>
  )
}

export default App
