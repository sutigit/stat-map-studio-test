import './App.css';
import { useEffect, useRef } from 'react';

import StatMapDisplay, { Country, AdministrativeLevel, ResolutionLevel } from 'stat-map-display';

import StatMapVideoExporter, { Resolution } from './modules/StatMapVideoExporter';

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
    }
  }, []);

  const download = () => {
    const map = statMapRef.current?.getMap();

    if (!map) throw new Error('Map not initialized');
    if (!statMapDiv.current) throw new Error('Map container not initialized');

    const width = statMapDiv.current.clientWidth;
    const height = statMapDiv.current.clientHeight;

    const exporter = new StatMapVideoExporter(width, height, Resolution.FULL_HD);
    const svg: SVGSVGElement = exporter.mapToSVG(map);
    // exporter.downloadSVG(svg, 'stat-map.svg');

    // exporter.SVGtoPNG(svg)
    //   .then(png => {
    //     exporter.downloadPNG(png, 'stat-map.png');
    //   });
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
          onClick={download}
          style={{ backgroundColor: 'purple', marginLeft: '1rem' }}>
          EXPORT
        </button>
      </div>
    </main>
  )
}

export default App
