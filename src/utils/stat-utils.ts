
// STAT UTILITIES ---------------------------------------------------------

/**
 * Returns the metric value for a given national code, year, and stat data.
 * 
 * @param {string} natcode - The national code to get the metric value for.
 * 
 * @param {StatData} statData - The stat data to get the metric value from.
 * 
 * @param {number} year - The year to get the metric value for.
 * 
 * @returns {number} The metric value for the given national code, year, and stat data.
 * 
 * @example
 * 
 * natcodeToMetric("FI", statData, 2010);
 * // returns 100
 */
// function natcodeToMetric(natcode: string, statData: object, year: number): number {
//     const role_geo: string = statData.role.geo[0];
//     const role_time: string = statData.role.time[0];

//     const geo_index: number = statData.dimension[role_geo].category.index["KU" + natcode];
//     // const geo_label: string = statData.dimension[role_geo].category.label["KU" + natcode];

//     const time_index: number = statData.dimension[role_time].category.index[year.toString()];

//     const time_size = statData.size[statData.id.indexOf(role_time)];

//     const value_index = geo_index * time_size + time_index;
//     const statValue = statData.value[value_index];
//     return statValue;
// }

// export { natcodeToMetric };