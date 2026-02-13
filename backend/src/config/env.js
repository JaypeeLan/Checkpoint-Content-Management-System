const Joi = require('joi');

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().default(5000),
  DATABASE_URL: Joi.string().uri().required(),
  DB_SSL: Joi.boolean().truthy('true').falsy('false').default(false),
  DB_SSL_REJECT_UNAUTHORIZED: Joi.boolean().truthy('true').falsy('false').default(false),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),
  CORS_ORIGIN: Joi.string().required(),
  REDIS_ENABLED: Joi.boolean().truthy('true').falsy('false').default(false),
  REDIS_URL: Joi.string().uri().allow(''),
  ELASTICSEARCH_ENABLED: Joi.boolean().truthy('true').falsy('false').default(false),
  ELASTICSEARCH_NODE: Joi.string().uri().allow(''),
  ELASTICSEARCH_API_KEY: Joi.string().allow(''),
  ELASTICSEARCH_INDEX: Joi.string().default('educms_posts'),
  CLOUDINARY_CLOUD_NAME: Joi.string().allow(''),
  CLOUDINARY_API_KEY: Joi.string().allow(''),
  CLOUDINARY_API_SECRET: Joi.string().allow(''),
  CLOUDINARY_FOLDER: Joi.string().default('educms'),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000),
  RATE_LIMIT_MAX: Joi.number().default(200)
}).unknown(true);

function validateEnvVars(rawEnv = process.env) {
  const { value, error } = schema.validate(rawEnv, { abortEarly: false, convert: true });
  if (error) {
    const details = error.details.map((d) => d.message);
    const message = `Environment validation failed:\n${details.join('\n')}`;
    throw new Error(message);
  }
  return value;
}

const env = validateEnvVars(process.env);

module.exports = { env, validateEnvVars };
