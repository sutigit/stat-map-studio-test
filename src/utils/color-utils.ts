
// COLOR UTILITIES ---------------------------------------------------------
interface RgbColor {
    r: number;
    g: number;
    b: number;
}


export default class ColorUtils {
    startColor: string;
    endColor: string;
    numOfTresholds: number;
    treshHoldColors: string[];

    constructor({ startColor, endColor, tresholds }: { startColor: string, endColor: string, tresholds: number[] }) {
        this.startColor = startColor;
        this.endColor = endColor;
        this.numOfTresholds = tresholds.length;
        this.treshHoldColors = [];

        // for (let i = 0; i < this.numOfTresholds; i++) {
        //     this.treshHoldColors.push(this.interpolateNumToRGB(tresholds[i], 0, 100));
        // }
    }

    /**
     * Returns a hex color code based on an RGB color.
     * @param {RgbColor} color - The RGB color to convert to a hex color code.
     * @returns {string} A hex color code based on the input RGB color.
     * @example
     * rgbToHex({ r: 255, g: 255, b: 255 });
     * // returns "#FFFFFF"
     */
    rgbToHex = (color: RgbColor): string => {
        return "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1).toUpperCase();
    }

    /**
     * Returns an RGB color based on a hex color code.
     * @param {string} hex - The hex color code to convert to an RGB color.
     * @returns {RgbColor} An RGB color based on the input hex color code.
     * @example
     * hexToRGB("#FFFFFF");
     * // returns { r: 255, g: 255, b: 255 }
     */
    hexToRGB = (hex: string): RgbColor => {
        const code = hex.replace('#', '');
        let bigint = parseInt(code, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;

        return { r, g, b };
    }

    /**
     * Returns an RGB color based on a number between two numbers.
     * @param {number} value - The number to calculate the color for.
     * @param {number} min - The minimum number.
     * @param {number} max - The maximum number.
     * @param {RgbColor} startRGB - The starting RGB color.
     * @param {RgbColor} targetRGB - The target RGB color.
     * @returns {RgbColor} An RGB color based on the input number.
     * @example
     * interpolateNumToRGB(50, 0, 100, { r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
     * // returns { r: 128, g: 128, b: 128 }
     */
    interpolateNumToRGB = (value: number, min: number, max: number, startRGB: RgbColor, targetRGB: RgbColor): RgbColor => {
        const ratio = (value - min) / (max - min);

        const r = Math.floor(startRGB.r + (targetRGB.r - startRGB.r) * ratio);
        const g = Math.floor(startRGB.g + (targetRGB.g - startRGB.g) * ratio);
        const b = Math.floor(startRGB.b + (targetRGB.b - startRGB.b) * ratio);

        return { r, g, b };
    }

    mapToChoroplethTresholds = (value: number): string => {
        /*
    
        tresh      percentage    color-transition
        75,        0
        750,       20
        7500,      40%
        50000,     60%
        500000     80%
    
        0          0%
        300        50%
        6000       100%
    
    
         returns rgb
    
        */
        // const startColor = hexToRGB('#FFFFFF');
        // const endColor = hexToRGB('#000000');
        // const color_0 = interpolateNumToRGB(0, 0, 100, startColor, endColor);
        // const color_20 = interpolateNumToRGB(20, 0, 100, startColor, endColor);
        // const color_40 = interpolateNumToRGB(40, 0, 100, startColor, endColor);
        // const color_60 = interpolateNumToRGB(60, 0, 100, startColor, endColor);
        // const color_80 = interpolateNumToRGB(80, 0, 100, startColor, endColor);
        // const color_100 = interpolateNumToRGB(100, 0, 100, startColor, endColor);

        // let color;

        // if (value < thresholds[1]) {
        //     color = interpolateNumToRGB(value, thresholds[0], thresholds[1], hexToRGB('#FFFFFF'), hexToRGB('#FFFF00'));
        // }
        // else if (value < thresholds[2]) {
        //     color = interpolateNumToRGB(value, thresholds[1], thresholds[2], hexToRGB('#FFFF00'), hexToRGB('#FFA500'));
        // }
        // else if (value < thresholds[3]) {
        //     color = interpolateNumToRGB(value, thresholds[2], thresholds[3], hexToRGB('#FFA500'), hexToRGB('#FF0000'));
        // }
        // else if (value < thresholds[4]) {
        //     color = interpolateNumToRGB(value, thresholds[3], thresholds[4], hexToRGB('#FF0000'), hexToRGB('#8B0000'));
        // }
        // else {
        //     color = interpolateNumToRGB(value, thresholds[4], thresholds[5], hexToRGB('#8B0000'), hexToRGB('#000000'));
        // }

        // return `rgb(${color.r}, ${color.g}, ${color.b})`;
        return 'blue';
    };



}
