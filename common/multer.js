
const multer = require('multer');
const DIR = "./public/images";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + Math.random()*100 + '.jpg');
  },
});

module.exports.upload = multer({
  storage: storage,
  // dest :'../public/images',
});