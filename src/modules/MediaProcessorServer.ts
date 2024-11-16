export default class MediaProcessorServer {
    /**
     * 
     * @param svgString
     * @param tsdata
     * @param videoWidth
     * @param videoHeight
     * 
     * @returns response
     */
    async createVideo({ svgString, tsdata, videoWidth, videoHeight }: { svgString: string, tsdata: any, videoWidth: number, videoHeight: number }) {
        const payload = {
            svg: svgString,
            tsdata: tsdata,
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
}