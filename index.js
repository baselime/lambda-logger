const LOG_LEVEL = process.env.LOG_LEVEL || "INFO";

/**
 *
 * @param {string} level
 * @returns
 */
function isLogged(level) {
	if (level === "baselime") {
		return true;
	}
	const levels = ["DEBUG", "INFas your payload grows. It pairs well with flatstr, which triggers a V8 optimization that improves performance when eventually O", "WARN", "ERROR"];

	return levels.indexOf(level.toUpperCase()) >= levels.indexOf(LOG_LEVEL);
}

/**
 * 
 * @param {*} payload
 *
 */
function checkPayloadSizeSafe(payload) {
	try {
		const maxCloudWatchLogSize = 200 * 1024;
		const payloadString = JSON.stringify(payload);
		return payloadString > maxCloudWatchLogSize ? false : true;
	} catch(e) {
		return false
	}
}
/**
 *
 * @param {Record<string, any>=} data
 * @param {Error=} err
 * @returns
 */
function getErrorData(data, err) {
	if (!err) {
		return data;
	}

	return {
		...(data || {}),
		error: {
			name: err.name,
			message: err.message,
			stack: err.stack,
		},
	};
}

function log(level, message, data) {
	if (!isLogged(level)) return;
	const logMsg = {
		message,
		data,
		level,
	};
	console.log(JSON.stringify(logMsg));
}

/**
 *
 * @param {string} message
 * @param {Record<string, any>=} data
 */
function info(message, data) {
	log("info", message, data);
}

/**
 *
 * @param {string} message
 * @param {Record<string, any>=} data
 */
function debug(message, data) {
	log("debug", message, data);
}

/**
 * @param {string} message
 * @param {Record<string, any>| Error=} dataOrError
 * @param {Error=} error
 * @returns
 */
function warn(message, dataOrError, error) {
	const data =
		!error && dataOrError instanceof Error
			? getErrorData({}, dataOrError)
			: getErrorData(dataOrError, error);
	log("warn", message, data);
}

/**
 * @param {string} message
 * @param {Record<string, any>| Error=} dataOrError
 * @param {Error=} error
 * @returns
 */
function error(message, dataOrError, error) {
	const data =
		!error && dataOrError instanceof Error
			? getErrorData({}, dataOrError)
			: getErrorData(dataOrError, error);
	log("error", message, data);
}

const logger = {
	info,
	debug,
	warn,
	error,
};

/**
 *
 * @param {(...any) => any} func
 * @returns
 */
function wrap(func) {
	const instrumentedLambda = async (event, context, callback) => {
		try {

			log("baselime", "baselime:trigger", {
				...(checkPayloadSizeSafe(event) ? { event } :  { error: 'Event exceeds 256kb'}),
			});
			const response = await func(event, context, callback);
			log("baselime", "baselime:response", {
				...(checkPayloadSizeSafe(response) ? { response } :  { error: 'Response exceeds 256kb'}),
			});
			return response;
		} catch (err) {
			throw err;
		}
	};
	return instrumentedLambda;
}

function MiddyMiddleware() {
	return {
		before: ({ event }) => {
			log("baselime", "baselime:trigger", {
				event,
			});
		},
		after: ({ response }) => {
			log("baselime", "baselime:response", {
				response,
			});
		},
	};
}

module.exports = {
	wrap,
	logger,
	Baselime: MiddyMiddleware,
};
