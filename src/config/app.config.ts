
export const EnvConfiguration = ()=>({
    environment: process.env.NODE_ENV || 'env',
    port: process.env.PORT || 3002,
    mongoDb: process.env.MONGODB,
    defaultLimit: process.env.DEFAULT_LIMIT || 7,
});