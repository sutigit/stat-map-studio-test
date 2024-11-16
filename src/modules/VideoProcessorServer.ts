export default class VideoProcessorServer {
    async createVideo({ svgString, videoWidth, videoHeight }: { svgString: string, videoWidth: number, videoHeight: number }) {
        const payload = {
            svg: svgString,
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