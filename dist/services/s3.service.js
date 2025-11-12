"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCharacterImages = exports.uploadToS3 = void 0;
const s3_1 = require("../config/s3");
const uploadToS3 = async (file, key, contentType) => {
    const params = {
        Bucket: s3_1.S3_BUCKET,
        Key: key,
        Body: file,
        ContentType: contentType,
        ACL: 'public-read'
    };
    const result = await s3_1.s3.upload(params).promise();
    return result.Location;
};
exports.uploadToS3 = uploadToS3;
const uploadCharacterImages = async (images, requestId, prefix) => {
    const uploadPromises = images.map((image, index) => {
        const ext = image.mimetype.split('/')[1];
        const key = `characters/${requestId}/${prefix}-${index}.${ext}`;
        return (0, exports.uploadToS3)(image.buffer, key, image.mimetype);
    });
    return Promise.all(uploadPromises);
};
exports.uploadCharacterImages = uploadCharacterImages;
