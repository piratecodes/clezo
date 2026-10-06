const cloudinary = require('cloudinary').v2;
const paramsToSign = {
  folder: "clezo/dev/service pages",
  source: "uw",
  timestamp: 1791238056
};

const signature = cloudinary.utils.api_sign_request(paramsToSign, '');
console.log(signature);
