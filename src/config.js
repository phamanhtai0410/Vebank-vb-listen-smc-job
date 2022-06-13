require('dotenv').config();


let Config = {
    POOL_CONTRACT: process.env.POOL_CONTRACT,
    ABI_POOL_CONTRACT: process.env.ABI_POOL_CONTRACT,
    RPC_VECHAIN: process.env.RPC_VECHAIN,
    REDIS_CLUSTER: process.env.RPC_VECHAIN,
    MONGO_URI: process.env.MONGO_URI,
    DBNAME: process.env.DBNAME,
    CELERY_BROKER_URL: process.env.CELERY_BROKER_URL,
    REDLOCK_REDIS: process.env.REDLOCK_REDIS,
    SENTRY_DSN: process.env.SENTRY_DSN,
    MONGO_URI_SYNC: process.env.MONGO_URI_SYNC,
    REDIS_SYNC_STARTUP_NODES: process.env.REDIS_SYNC_STARTUP_NODES,
    RABBIT: {
        URI: process.env.RABBIT_URI,
        
        HEARTBEAT: process.env.RABBIT_HEARTBEAT,
        LOCALE: process.env.RABBIT_LOCALE,
        FRAME_MAX: process.env.RABBIT_FRAME_MAX,
        EXCHANGE: process.env.RABBIT_EXCHANGE,
        QUEUE_SUPPLY: {
            EXCHANGE: process.env.RABBIT_EXCHANGE,
            KEY: process.env.RABBIT_ROUTING_KEY_SUPPLY
        },
        QUEUE_REPAY: {
            EXCHANGE: process.env.RABBIT_EXCHANGE,
            KEY: process.env.RABBIT_ROUTING_KEY_REPAY
        },
        QUEUE_BORROW: {
            EXCHANGE: process.env.RABBIT_EXCHANGE,
            KEY: process.env.RABBIT_ROUTING_KEY_BORROW
        },
        QUEUE_WITHDRAW: {
            EXCHANGE: process.env.RABBIT_EXCHANGE,
            KEY: process.env.RABBIT_ROUTING_KEY_WITHDRAW
        }
    }
};

module.exports.Config = Config;