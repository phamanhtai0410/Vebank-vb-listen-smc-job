const Conf = require('../config');

const calculateFilterBlocks = () => {
    const currentTimestamp = Number(Math.floor(new Date().getTime() / 1000).toString().split(".")[0]);
    const initBlock = parseInt(Conf.Config.INIT_BLOCK);
    const initTimestamp = parseInt(Conf.Config.INIT_TIMESTAMP);

    const lastTimestamp = currentTimestamp - 60 * 60;

    const fromBlock = initBlock + Math.floor((lastTimestamp - initTimestamp) / 10);
    const toBlock = initBlock + Math.floor((currentTimestamp - initTimestamp) / 10);

    return {
        fromBlock,
        toBlock
    }
}

module.exports = calculateFilterBlocks;