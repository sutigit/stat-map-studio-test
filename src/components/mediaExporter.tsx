
import { mapToVideo, Resolution, SVGData, TimeSeriesData } from '../modules/MediaHandler';
import StatMapDisplay from 'stat-map-display';

// some fake data
import fin_timeseries_data from '../test_data/fin_timeseries_data.json';

export default function MediaExporter({ statMapRef, statMapDiv }: { statMapRef: React.RefObject<StatMapDisplay>, statMapDiv: React.RefObject<HTMLDivElement> }) {


    const createVideo = () => {
        const map = statMapRef.current?.getMap();

        if (!map) throw new Error('Map not initialized');
        if (!statMapDiv.current) throw new Error('Map container not initialized');

        const tsdata: TimeSeriesData = fin_timeseries_data;
        const svgdata: SVGData = {
            statMap: map,
            viewPortWidth: statMapDiv.current.clientWidth,
            viewPortHeight: statMapDiv.current.clientHeight
        }

        mapToVideo(svgdata, tsdata, Resolution.FULL_HD)
            .then(res => {
                console.log(res);

                // meh.exportVideo(res);

            });
    };

    return (
        <div>
            <button
                onClick={createVideo}
                style={{ backgroundColor: 'purple', marginLeft: '1rem' }}>
                EXPORT VIDEO
            </button>
        </div>
    );
}