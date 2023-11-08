import multer from "multer";
import fs from 'fs';

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            let folder = req.body.uniqueId;
            let path = `./uploads/${folder}`;
            try {
                fs.mkdirSync(path);
            } catch (e) {
                console.log('folder already exists')
            }
            callback(null, path);
        },
        filename: (req, file, callback) => {
            callback(null, file.originalname);
        }
    })
});

export default upload