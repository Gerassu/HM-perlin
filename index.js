//using pre existing png output from perlin-to-img.js in ./perlin-img to assign numbers 1-8 where 1 is black and 8 is white

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

function map(value, min1, max1, min2, max2) {
    return ((value - min1) * (max2 - min2)) / (max1 - min1) + min2;
}

function rgbToGrayscale(r,g,b){
    return (r + g + b) / 3;

}

loadImage('./perlin-img.png').then((image) => {

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    console.log(imageData.data)

    for (let i = 0; i < pixels.length; i += 4) {

        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const grayScale = rgbToGrayscale(r,g,b);

        const value = Math.floor(map(grayScale, 0, 255, 0, 8));

        const color = `rgb(${value * 32}, 0, ${255 - (value * 32)})`;

        pixels[i] = 255 - (value * 32);
        pixels[i + 1] = 0;
        pixels[i + 2] = value * 32;
        pixels[i + 3] = 255;

       // console.log(mapped  + 1)

    }


    ctx.putImageData(imageData, 0, 0);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./perlin-img-grayscale.png', buffer);
}).catch((error) => {
    console.log(error);
});