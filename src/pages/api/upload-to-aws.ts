import s3 from '@/utils/awsClient';
import deleteImageFromAws from '@/utils/deleteImageFromAws';
import getSignedUrlFromAws from '@/utils/getSignedUrlFromAws';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import { v4 as uuid } from 'uuid';

interface NextApiRequestWithFile extends NextApiRequest {
  file: Readable | ReadableStream | Blob;
}

const BUCKET = process.env.BUCKET;

const uploadToS3 = async (file: any) => {
  const key = uuid();
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    const data = await s3.send(command);
    console.log(data);
    return { key };
  } catch (err) {
    console.log(err);
    return err;
  }
};

function runMiddleware(
  req: NextApiRequestWithFile,
  res: NextApiResponse,
  fn: (...args: unknown[]) => void
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const upload: any = multer({
  storage: multer.memoryStorage(),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequestWithFile,
  res: NextApiResponse
) {
  await runMiddleware(req, res, upload.single('file'));

  const { file } = req;

  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const { error, key }: any = await uploadToS3(file);

  console.log(error, key);

  if (error) return res.status(500).json({ message: 'Error uploading file' });

  const signedUrl = await getSignedUrlFromAws(key);

  // If you want to delete the image from AWS S3
  // const deleteImage = await deleteImageFromAws(key);

  res.status(200).json({ success: true, data: signedUrl });
}
