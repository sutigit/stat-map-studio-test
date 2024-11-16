
import StatMapVideoMaker, { Resolution } from '../modules/StatMapVideoMaker';
import StatMapDisplay from 'stat-map-display';

// some fake data
import fin_timeseries_data from '../test_data/fin_timeseries_data.json';

export default function MediaExporter({ statMapRef, statMapDiv }: { statMapRef: React.RefObject<StatMapDisplay>, statMapDiv: React.RefObject<HTMLDivElement> }) {

    
    const createVideo = () => {
        const smvm = new StatMapVideoMaker();

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
        const tsdata = fin_timeseries_data;

        // 3. Create the video with the SVG and timeseries data
        smvm.createVideo(svg, tsdata, Resolution.FULL_HD)
            .then(res => {
                console.log(res);

                // 4. Export the video
                // smvm.exportVideo(res);

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