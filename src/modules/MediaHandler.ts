// ol imports
import BaseLayer from "ol/layer/Base";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Map from "ol/Map";
import Feature from "ol/Feature";
import { LineString, MultiPolygon, Polygon, Geometry } from "ol/geom";
import { Coordinate } from "ol/coordinate";
import { Style } from "ol/style";

// Media processing API
import { processToVideo } from "../api/MediaProcessorAPI";

export enum Resolution {
    'FULL_HD' = 'FULL_HD',
    '2k' = '2k',
    '4k' = '4k',
}

export interface SVGData {
    statMap: Map,
    viewPortWidth: number,
    viewPortHeight: number
}

export interface TimeSeriesData {
    meta: {
        name: string,
        minYear: number,
        maxYear: number,
        minValue: number,
        maxValue: number,
        choropleth_tresholds: number[]
    },
    regiondata: {
        [key: string]: {
            [key: string]: number
        }
    }
}

/**
 * This class is handles converting the openlayer map into different media formats.
 * ol-map -> svg
 * ol-map + tsdata -> video
 */
export default class MediaHandler {

    /**
     * This funciton converts an openlayer map object into an svg element.
     * 
     * @param statMap: Map
     * @param viewPortWidth: number
     * @param viewPortHeight: number
     * @returns svg: SVGSVGElement
     */
    mapToSVG({ statMap, viewPortWidth, viewPortHeight }: SVGData): SVGSVGElement {
        const svgNamespace = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNamespace, 'svg');
        const svgGroup = document.createElementNS(svgNamespace, 'g');
        svg.appendChild(svgGroup);

        svg.setAttribute('width', viewPortWidth.toString());
        svg.setAttribute('height', viewPortHeight.toString());
        svg.setAttribute('xmlns', svgNamespace);

        statMap.getLayers().forEach((layer: BaseLayer) => {
            if (layer instanceof VectorLayer) {
                const source: VectorSource = layer.getSource();
                const features: Feature[] = source.getFeatures();

                features.forEach(feature => {
                    const geometry: Geometry | undefined = feature.getGeometry()
                    const style: Style | undefined = layer.getStyle() as Style;

                    if (!geometry) throw new Error('Geometry is undefined');


                    const svgPath = document.createElementNS(svgNamespace, 'path')

                    let pathString: string = this.createPathString(geometry, statMap);

                    const fillColor = style?.getFill()?.getColor()?.toString() || 'none';
                    const strokeColor = style?.getStroke()?.getColor()?.toString() || 'none';
                    const strokeWidth = style?.getStroke()?.getWidth()?.toString() || '0.2';

                    svgPath.setAttribute('d', pathString);
                    svgPath.setAttribute('fill', geometry?.getType() === 'Polygon' || geometry?.getType() === 'MultiPolygon' ? fillColor : 'none');
                    svgPath.setAttribute('stroke', strokeColor);
                    svgPath.setAttribute('stroke-width', strokeWidth);
                    svgGroup.appendChild(svgPath);
                })
            }
        });

        return svg;
    }

    /**
     * This function takes in individual Geometry objects from an ol layer and converts them into a path string.
     * It is privately in the mapToSVG function.
     * 
     * @param geometry 
     * @param statMap 
     * @returns 
     */
    private createPathString(geometry: Geometry, statMap: Map): string {
        const roundCoord = (coord: number | null): number | null => {
            if (coord === null) return null;
            return Math.round(coord * 100) / 100; // Round to two decimal places
        };

        let pathString = '';

        switch (geometry.getType()) {
            case 'Polygon': {
                const polygon = geometry as Polygon;

                polygon.getCoordinates().forEach((ring: Coordinate[]) => {
                    pathString += ring
                        .map((point: Coordinate, index: number) => {
                            const coordinates = statMap.getPixelFromCoordinate(point);
                            if (!coordinates) {
                                console.warn(`Null pixel coordinates for point: ${point}`);
                                return ''; // Skip the point
                            }
                            const [x, y] = coordinates.map(roundCoord);
                            return `${index === 0 ? 'M' : 'L'}${x},${y}`;
                        })
                        .filter(Boolean) // Remove empty strings from skipped points
                        .join(' ') + ' Z ';
                });
                break;
            }
            case 'MultiPolygon': {
                const multipolygon = geometry as MultiPolygon;

                multipolygon.getCoordinates().forEach((polygon: Coordinate[][]) => {
                    polygon.forEach((ring: Coordinate[]) => {
                        pathString += ring
                            .map((point: Coordinate, index: number) => {
                                const coordinates = statMap.getPixelFromCoordinate(point);
                                if (!coordinates) {
                                    console.warn(`Null pixel coordinates for point: ${point}`);
                                    return ''; // Skip the point
                                }
                                const [x, y] = coordinates.map(roundCoord);
                                return `${index === 0 ? 'M' : 'L'}${x},${y}`;
                            })
                            .filter(Boolean) // Remove empty strings from skipped points
                            .join(' ') + ' Z ';
                    });
                });
                break;
            }
            case 'LineString': {
                const linestring = geometry as LineString;

                pathString = linestring
                    .getCoordinates()
                    .map((point: Coordinate, index: number) => {
                        const coordinates = statMap.getPixelFromCoordinate(point);
                        if (!coordinates) {
                            console.warn(`Null pixel coordinates for point: ${point}`);
                            return ''; // Skip the point
                        }
                        const [x, y] = coordinates.map(roundCoord);
                        return `${index === 0 ? 'M' : 'L'}${x},${y}`;
                    })
                    .filter(Boolean) // Remove empty strings from skipped points
                    .join(' ');
                break;
            }
            default:
                throw new Error('Unsupported geometry type');
        }

        return pathString.trim(); // Ensure no trailing whitespace
    }

    /**
     * This method attempts to process a video based on the map svg and tsdata which stands for timeseries data.
     * The tsdata contains some mandatory information on how to process the svg to turn it into a timeseries video.
     * The function first creates an svg string out of the map svg, validates the resolution and then sends it to 
     * the server to process it together with the tsdata and resolution information.
     * 
     * @param svg 
     * @param tsdata 
     * @param resolution 
     * @returns 
     */
    async mapToVideo(svgdata: SVGData, tsdata: TimeSeriesData, resolution: Resolution) {
        try {
            const svg: SVGSVGElement = this.mapToSVG(svgdata);

            const svgString = new XMLSerializer().serializeToString(svg);

            if (!svgString) {
                throw new Error('SVG string is empty');
            }

            let videoWidth: number;
            let videoHeight: number;

            switch (resolution) {
                case Resolution.FULL_HD:
                    videoHeight = 1920;
                    videoWidth = 1080;
                    break;
                case Resolution['2k']:
                    videoHeight = 2560;
                    videoWidth = 1440;
                    break;
                case Resolution['4k']:
                    videoHeight = 3840;
                    videoWidth = 2160;
                    break;
                default:
                    throw new Error('Unsupported resolution');
            }

            const res = await processToVideo({
                svgString,
                tsdata,
                videoWidth,
                videoHeight
            });

            return res;
        }
        catch (e) {
            console.error(e);
        }
    }

}