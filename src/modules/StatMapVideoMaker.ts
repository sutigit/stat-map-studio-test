// ol imports
import BaseLayer from "ol/layer/Base";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Map from "ol/Map";
import Feature from "ol/Feature";
import { LineString, MultiPolygon, Polygon, Geometry } from "ol/geom";
import { Coordinate } from "ol/coordinate";
import { Style } from "ol/style";

// sharp imports
// sharp does not work on browser, let's do image processing on the server
// import sharp from 'sharp';

// Server imports
import VideoProcessorServer from "./VideoProcessorServer";

export enum Resolution {
    'FULL_HD' = 'FULL_HD',
    '2k' = '2k',
    '4k' = '4k',
}

export default class StatMapVideoMaker {

    mapToSVG({ statMap, viewPortWidth, viewPortHeight }: { statMap: Map, viewPortWidth: number, viewPortHeight: number }): SVGSVGElement {
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

    async createVideo(svg: SVGSVGElement, resolution: Resolution) {
        try {
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

            const vps = new VideoProcessorServer();
            const res = await vps.createVideo({
                svgString,
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