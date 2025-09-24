export default () => ({
  port: parseInt(process.env.PORT ?? '4000', 10),
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://build:build@localhost:5432/build',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  jwt: {
    accessSecret: process.env.JWT_SECRET ?? 'jwt-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret',
    expiresIn: '15m',
    refreshExpiresIn: '7d'
  },
  storage: {
    endpoint: process.env.MINIO_ENDPOINT ?? 'http://localhost:9000',
    accessKey: process.env.MINIO_ACCESS_KEY ?? 'build',
    secretKey: process.env.MINIO_SECRET_KEY ?? 'buildsecret'
  },
  smtp: {
    host: process.env.SMTP_HOST ?? 'localhost',
    port: parseInt(process.env.SMTP_PORT ?? '1025', 10)
  },
  erp: {
    businessCentral: {
      baseUrl: process.env.BUSINESS_CENTRAL_BASE_URL ?? '',
      tenantId: process.env.BUSINESS_CENTRAL_TENANT_ID ?? '',
      clientId: process.env.BUSINESS_CENTRAL_CLIENT_ID ?? '',
      clientSecret: process.env.BUSINESS_CENTRAL_CLIENT_SECRET ?? '',
      company: process.env.BUSINESS_CENTRAL_COMPANY ?? '',
      scope: process.env.BUSINESS_CENTRAL_SCOPE ?? ''
    }
  }
});
