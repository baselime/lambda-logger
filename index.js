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
	const levels = ["DEBUG", "INFO", "WARN", "ERROR"];

	return levels.indexOf(level.toUpperCase()) >= levels.indexOf(LOG_LEVEL);
}

/**
 *
 * @param {Record<string, any> | null} data
 * @param {Error?} err
 * @returns
 */
function getErrorData(data, err) {
	if (!err) {
		return data;
	}

	return {
		...(data || {}),
		errorName: err.name,
		errorMessage: err.message,
		stackTrace: err.stack,
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
 * @param {Record<string, any>?} data
 */
function info(message, data) {
	log("info", message, data);
}

/**
 *
 * @param {string} message
 * @param {Record<string, any>?} data
 */
function debug(message, data) {
	log("debug", message, data);
}

/**
 * @param {string} message
 * @param {Record<string, any>| Error | null} dataOrError
 * @param {Error?} error
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
 * @param {Record<string, any>| Error | null} dataOrError
 * @param {Error?} error
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
	/**
	 *
	 * @param {*} event
	 * @param {import("aws-lambda").Context} context
	 */
	const instrumentedLambda = async (event, context) => {
		try {
			log("baselime", "baselime:trigger", {
				event,
				requestId: context.awsRequestId,
			});
			const response = await func(event, context);
			log("baselime", "baselime:return", {
				response,
				requestId: context.awsRequestId,
			});
			return response;
		} catch (err) {
			throw err;
		}
	};
	return instrumentedLambda;
}

module.exports = {
	wrap,
	logger,
};
