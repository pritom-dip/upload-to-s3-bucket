import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3 from './awsClient';

const deleteImageFromAws = async (id: string | undefined) => {
  if (!id) return;

  const BUCKET = process.env.BUCKET;

  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: id,
  });

  try {
    const response = await s3.send(command);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export default deleteImageFromAws;
