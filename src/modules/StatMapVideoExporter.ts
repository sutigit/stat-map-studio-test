import BaseLayer from "ol/layer/Base";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Map from "ol/Map";
import Feature from "ol/Feature";
import { LineString, MultiPolygon, Polygon, Geometry } from "ol/geom";
import { Coordinate } from "ol/coordinate";
import { Style } from "ol/style";

export enum Resolution {
    'FULL_HD' = 'FULL_HD',
    '2k' = '2k',
    '4k' = '4k',
}

export default class StatMapVideoExporter {
    private svgWidth: number;
    private svgHeight: number;
    private pngWidth: number | null;
    private pngHeight: number | null;

    constructor(mapViewWidth: number, mapViewHeight: number, resolution: Resolution) {
        this.svgWidth = mapViewWidth;
        this.svgHeight = mapViewHeight;
        this.pngWidth = null;
        this.pngHeight = null;

        switch (resolution) {
            case Resolution.FULL_HD:
                this.pngWidth = 1920;
                this.pngHeight = 1080;
                break;
            case Resolution['2k']:
                this.pngWidth = 2560;
                this.pngHeight = 1440;
                break;
            case Resolution['4k']:
                this.pngWidth = 3840;
                this.pngHeight = 2160;
                break;
            default:
                throw new Error('Unsupported resolution');
        }
    }


    mapToSVG(statMap: Map): SVGSVGElement {
        const svgNamespace = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNamespace, 'svg');
        const svgGroup = document.createElementNS(svgNamespace, 'g');
        svg.appendChild(svgGroup);

        svg.setAttribute('width', this.svgWidth.toString());
        svg.setAttribute('height', this.svgHeight.toString());
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

    downloadSVG(svg: SVGSVGElement, name: string) {
        // Convert SVG element to data URL and trigger download
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(svgBlob);
        downloadLink.download = name;
        downloadLink.click();
    }

    SVGtoPNG(svg: SVGSVGElement, name: string) {
        // code...
    }
}