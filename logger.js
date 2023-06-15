const log_error = async (msg) => {
    date = new Date();
    console.log(`[Error ${date.toUTCString()}] ${msg}`)
};

const log_msg = async (msg) => {
    date = new Date();
    console.log(`[Debug ${date.toUTCString()}] ${msg}`);
}

module.exports = {
    log_error: log_error,
    log_msg: log_msg
};