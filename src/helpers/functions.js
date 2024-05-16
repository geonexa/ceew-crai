




export const fillDensityColor = (ColorLegendsDataItem, density) => {
    if (!ColorLegendsDataItem) return null;
  
    const valueColorsMap = ColorLegendsDataItem.Value.map((value, index) => ({ value, color: ColorLegendsDataItem.Colors[index] }));
  
    for (let i = 0; i < valueColorsMap.length; i++) {
      if (density > valueColorsMap[i].value) {
        return valueColorsMap[i].color;
      }
    }
    // return valueColorsMap[valueColorsMap.length - 1].color; // Default to the last color
    return ColorLegendsDataItem.Colors[ColorLegendsDataItem.Colors.length - 1]; // Default to the last color
  };
  