import './App.css';
import { useEffect, useRef } from 'react';

// ol imports
import { Feature } from 'ol';
import { Fill, Style } from 'ol/style';

import StatMapDisplay, { Country, AdministrativeLevel, ResolutionLevel } from 'stat-map-display';

// fake data
import fin_timeseries_data from './test_data/fin_timeseries_data.json';

// My components
import MediaExporter from './components/mediaExporter';

// Utils
import { mapToChoroplethTresholds } from './utils/color-utils';

interface TSData {
  meta: {
    name: string,
    minYear: number,
    maxYear: number,
    minValue: number,
    maxValue: number,
    choropleth_tresholds: number[],
  },
  regiondata: {
    [key: string]: {
      [key: string]: number
    }
  }
}


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
      const tsdata: TSData = fin_timeseries_data;
      const targetYear = String(tsdata.meta.minYear);

      statMapRef.current.forEachFeature((feature: Feature, natcode: string) => {
        const value = tsdata.regiondata['KU' + natcode][targetYear];

        feature.setStyle(new Style({
            fill: new Fill({
              color: mapToChoroplethTresholds(value, tsdata.meta.choropleth_tresholds),
            }),
          })
        );
      });
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
        <MediaExporter statMapRef={statMapRef} statMapDiv={statMapDiv} />
      </div>
    </main>
  )
}

export default App
