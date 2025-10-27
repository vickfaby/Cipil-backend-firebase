//import { diskStorage } from 'multer';
import SharpMulter from 'sharp-multer';

// export const storage = diskStorage({
//   destination: `./public/uploads`,
//   filename: (req, file, cb) => {
//     const extension = file.originalname.split('.').pop(); //TODO png
//     const name = `${Date.now()}.${extension}`; //TODO 213131231.png
//     cb(null, name);
//   },
// });

const newFilenameFunction = () => {
  const name = `${Date.now()}.jpg`;
  return name;
};

export const storage = SharpMulter({
  destination: (req, file, callback) => callback(null, `./public/uploads`),
  imageOptions: {
    fileFormat: 'jpg',
    quality: 70,
    //resize: { width: 400, height: 800, resizeMode: 'contain' },
  },
  filename: newFilenameFunction,
});
