import Joi from 'joi';

export const validateUploadRequestFromFrontend = (data) => {
  const schema = Joi.object({
    original_filename: Joi.string().min(1).max(30).required(),
    public_id: Joi.string().min(1).required(),
    secure_url: Joi.string().min(1).required(),
    resource_type: Joi.string().min(1).required(),
    format: Joi.string().min(1).required(),
  });

  return schema.validate(data);
};
