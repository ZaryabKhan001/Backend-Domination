export const urlVersioning = (version) => (req, res, next) => {
  if (req.path.startsWith(`/api/${version}`)) {
    next();
  } else {
    return res.status(400).json({
      success: false,
      message: 'Api Version is not Supported',
    });
  }
};

export const headerVersioning = (version) => (req, res, next) => {
  if (req.get('Accept-Version') === version) {
    next();
  } else {
    return res.status(400).json({
      success: false,
      message: 'Api Version is not Supported',
    });
  }
};
export const contentTypeVersioning = (version) => (req, res, next) => {
  const contentType = req.get('Content-Type');
  if (contentType.includes(`application/vnd.api.${version}+json`)) {
    next();
  } else {
    return res.status(400).json({
      success: false,
      message: 'Api Version is not Supported',
    });
  }
};
