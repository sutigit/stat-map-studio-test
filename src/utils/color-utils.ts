
// COLOR UTILITIES ---------------------------------------------------------
interface RgbColor {
    r: number;
    g: number;
    b: number;
}

export class ColorUtils {

    /**
     * Returns a hex color code based on an RGB color.
     * 
     * @param {RgbColor} color - The RGB color to convert to a hex color code.
     * 
     * @returns {string} A hex color code based on the input RGB color.
     * 
     * @example
     * 
     * rgbToHex({ r: 255, g: 255, b: 255 });
     * // returns "#FFFFFF"
     */
    static rgbToHex(color: RgbColor): string {
        return "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1).toUpperCase();
    }

    /**
     * Returns an RGB color based on a hex color code.
     * 
     * @param {string} hex - The hex color code to convert to an RGB color.
     * 
     * @returns {RgbColor} An RGB color based on the input hex color code.
     * 
     * @example
     * 
     * hexToRGB("#FFFFFF");
     * // returns { r: 255, g: 255, b: 255 }
     */
    static hexToRGB(hex: string): RgbColor {
        const code = hex.replace('#', '');
        let bigint = parseInt(code, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;

        return { r, g, b };
    }

    /**
     * Returns an RGB color based on a number between two numbers.
     * 
     * @param {number} value - The number to calculate the color for.
     * 
     * @param {number} min - The minimum number.
     * 
     * @param {number} max - The maximum number.
     * 
     * @param {RgbColor} startRGB - The starting RGB color.
     * 
     * @param {RgbColor} targetRGB - The target RGB color.
     * 
     * @returns {RgbColor} An RGB color based on the input number.
     * 
     * @example
     * 
     * interpolateNumToRGB(50, 0, 100, { r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
     * // returns { r: 128, g: 128, b: 128 }
     */
    static interpolateNumToRGB(value: number, min: number, max: number, startRGB: RgbColor, targetRGB: RgbColor): RgbColor {
        const ratio = (value - min) / (max - min);

        const r = Math.floor(startRGB.r + (targetRGB.r - startRGB.r) * ratio);
        const g = Math.floor(startRGB.g + (targetRGB.g - startRGB.g) * ratio);
        const b = Math.floor(startRGB.b + (targetRGB.b - startRGB.b) * ratio);

        return { r, g, b };
    }
}