import { GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from './awsClient';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const getSignedUrlFromAws = async (id: string) => {
  const BUCKET = process.env.BUCKET;

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: id,
  });

  try {
    const response = await getSignedUrl(s3, command, {
      expiresIn: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};

export default getSignedUrlFromAws;
