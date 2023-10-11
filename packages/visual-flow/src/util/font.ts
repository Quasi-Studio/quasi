const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

function calculateTextSize(
  font_size: number,
  font_family: string,
  text: string,
) {
  context!.font = font_size + "px " + font_family;
  const m = context!.measureText(text);
  return {
    width: m.width,
    // height: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
    ascent: m.actualBoundingBoxAscent,
    height: font_size,
    // ascent: font_size
  };
}

export default calculateTextSize;
