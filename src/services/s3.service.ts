import { s3, S3_BUCKET } from '../config/s3';

export const uploadToS3 = async (
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> => {
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read' as const
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};

export const uploadCharacterImages = async (
  images: Express.Multer.File[],
  requestId: string,
  prefix: string
): Promise<string[]> => {
  const uploadPromises = images.map((image, index) => {
    const ext = image.mimetype.split('/')[1];
    const key = `characters/${requestId}/${prefix}-${index}.${ext}`;
    return uploadToS3(image.buffer, key, image.mimetype);
  });

  return Promise.all(uploadPromises);
};