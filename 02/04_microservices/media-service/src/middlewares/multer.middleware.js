import multer from 'multer';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    const error = new multer.MulterError(
      'LIMIT_UNEXPECTED_FILE',
      file.fieldname
    );
    error.message = 'Invalid file type. Only images/videos allowed.';
    return cb(error, false);
  }
  cb(null, true);
};

const multerInstance = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export const uploadSingleFile = (fieldName) => {
  return (req, res, next) => {
    multerInstance.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }
      next();
    });
  };
};
