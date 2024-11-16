import './App.css';
import { useEffect, useRef } from 'react';

import StatMapDisplay, { Country, AdministrativeLevel, ResolutionLevel } from 'stat-map-display';

import StatMapVideoMaker, { Resolution } from './modules/StatMapVideoMaker';

function App() {
  const statMapRef = useRef<StatMapDisplay | null>(null);
  const statMapDiv = useRef<HTMLDivElement | null>(null);

  const smvm = new StatMapVideoMaker();

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

  const createVideo = () => {
    const map = statMapRef.current?.getMap();

    if (!map) throw new Error('Map not initialized');
    if (!statMapDiv.current) throw new Error('Map container not initialized');

    // 1. First, we need to convert the map to an SVG element
    const svg: SVGSVGElement = smvm.mapToSVG({
      statMap: map,
      viewPortWidth: statMapDiv.current.clientWidth,
      viewPortHeight: statMapDiv.current.clientHeight
    });

    // 2. Then we create a timeseries metadata object for the video
    // const tsdata = ...

    // 3. Create the video
    smvm.createVideo(svg, Resolution.FULL_HD)
      .then(res => {
        console.log(res);

        // 4. Export the video
        // smvm.exportVideo(res);

      });
  };

  return (
    <main id="app">
      <div className="options">
        <p>Hello</p>
      </div>

      <div className='map-container'>
        <div id='stat-map' ref={statMapDiv} style={{ height: '100%', aspectRatio: '9/16', overflow: 'hidden', borderRadius: '1rem' }}></div>
      </div>

      <div>
        <button
          onClick={createVideo}
          style={{ backgroundColor: 'purple', marginLeft: '1rem' }}>
          EXPORT VIDEO
        </button>
      </div>
    </main>
  )
}

export default App
