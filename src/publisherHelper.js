const amqp = require('amqp-connection-manager');
const Conf = require('./config');

module.exports = {
    // Create a connetion manager
    initRabbitMQ: () => {
        const urlConnectRabbit = Conf.Config.RABBIT.URI;
        const optionsConnectionManagerRabbit = {
            heartbeatIntervalInSeconds: Conf.Config.RABBIT.HEARTBEAT,
            locale:  Conf.Config.RABBIT.LOCALE,
            frameMax: Conf.Config.RABBIT.FRAME_MAX
        }
        const connection = amqp.connect([urlConnectRabbit], optionsConnectionManagerRabbit);
        connection.on('connect', () => console.log('RabbitMQ Connected!'));
        connection.on('disconnect', (err) => {            
            if (err) {
                console.log(`RabbitMQ Disconnected. `, err)
                return err;
            }
            return null;
        });
        connection.on( 'error', (err) => {
            if (err) {
                console.error(`ERROR Rabbit MQ ... `, err)
                return err;
            }
            return null;
        });
        
        global.connRabbit = connection
    },

    // Create a channel wrapper
    channelWrapper: () => {
        const connection = global.connRabbit;
        const channelWrap = connection.createChannel({
            json: true,
            setup: function(channel) {
                return Promise.all([
                    channel.assertExchange(Conf.Config.RABBIT.EXCHANGE, 'topic', {durable: true}),
                ]);
            }
        });
        global.channelWrapperRabbit = channelWrap;        
    },

    // publish Message
    sendMessage: (queue, data) => {
        const connection = global.connRabbit;
        const channelWrapper = global.channelWrapperRabbit;
        return new Promise(async (resolve, reject) => {
            try {
                // await publisherHelper.sleep(10000);
                await channelWrapper.publish(queue.EXCHANGE, queue.KEY, data, { contentType: 'application/json', persistent: true })
                console.log(`SENT:: ${JSON.stringify(data)}`);
                resolve(null);
            } catch (error) {
                console.error(`publisherHelper.sendMessage] Message was rejected with error: ${error}`);
                channelWrapper.close();
                connection.close();
                reject(error);
            } 
        });
        
    }, 

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }   
}