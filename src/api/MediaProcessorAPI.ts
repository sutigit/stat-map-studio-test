/**
 * This method sends a POST request to the stat-map-video-processing server to attempt to process it 
 * for a video based on the attached timeseries data.
 * It sends the maps_svg string, timesries data as tsdata, videoWidth, and videoHeight as the payload.
 * 
 * @param svgString
 * @param tsdata
 * @param videoWidth
 * @param videoHeight
 * 
 * @returns response
 */
export async function processToVideo({ svgString, tsdata, videoWidth, videoHeight }: { svgString: string, tsdata: any, videoWidth: number, videoHeight: number }) {
    const payload = {
        map_svg: svgString,
        ts_data: tsdata,
        videoWidth,
        videoHeight
    }

    try {
        const res = await fetch('http://localhost:5000/api/video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        return await res.json();
    }
    catch (e) {
        console.error(e);
    }
}