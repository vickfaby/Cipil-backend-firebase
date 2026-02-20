import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
// Compat CJS/ESM: sharp-multer puede exportar default o función CJS
import * as SharpMulterNS from 'sharp-multer';
const SharpMulter: any = (SharpMulterNS as any)?.default ?? (SharpMulterNS as any);

// export const storage = diskStorage({
//   destination: `./public/uploads`,
//   filename: (req, file, cb) => {
//     const extension = file.originalname.split('.').pop(); //TODO png
//     const name = `${Date.now()}.${extension}`; //TODO 213131231.png
//     cb(null, name);
//   },
// });

const uploadDir = join(process.cwd(), 'public', 'uploads');

const ensureUploadDirExists = () => {
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
};

const newFilenameFunction = () => `${Date.now()}.jpg`;

export const storage = SharpMulter({
  destination: (_req, _file, callback) => {
    ensureUploadDirExists();
    callback(null, uploadDir);
  },
  imageOptions: {
    fileFormat: 'jpg',
    quality: 70,
    //resize: { width: 400, height: 800, resizeMode: 'contain' },
  },
  filename: newFilenameFunction,
});

export const storageFile = diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadDirExists();
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const name = `${Date.now()}${extname(file.originalname)}`;
    cb(null, name);
  },
});
