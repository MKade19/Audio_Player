const Router = require('express');
const multer = require("multer");
const path = require("path");

const router = new Router();

const allowedMimeTypes = ['audio/wav', 'audio/mp3', 'audio/aif', 'audio/ogg', 'audio/mpeg'];

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, path.join('./resources/audio'));
  },
  filename: (req, file, cb) =>{
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if(allowedMimeTypes.includes(file.mimetype.toLowerCase())){
    cb(null, true);
  }
  else{
    cb(null, false);
  }
}

const upload = multer({
  storage: storageConfig,
  fileFilter: fileFilter
});

router.post('/uploadAudio', upload.single("audioFile"), (req, res, next) => {
  let fileData = req.file;
  if(!fileData)
    res.status(500).send("File is not uploaded!");
  else
    res.json(fileData);
});

module.exports = router;