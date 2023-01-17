import nextConnect from 'next-connect';
import multer from 'multer';
import type { NextApiRequest, NextApiResponse } from 'next';

const upload = multer({
  storage: multer.diskStorage({
    destination: 'public',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array('file'));

apiRoute.post((req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ data: 'success' });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
