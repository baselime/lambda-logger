const DEFAULT_CONTEXT = {
	awsRegion: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
	functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
	functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
	functionMemorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
};

function getLambdaTraceId() {
	const XRAY_ENV_NAME = "_X_AMZN_TRACE_ID";
	const TRACE_ID_REGEX = /^Root=(.+);Parent=(.+);/;
	const tracingInfo = process.env[XRAY_ENV_NAME] || "";
	const matches = tracingInfo.match(TRACE_ID_REGEX) || ["", "", ""];

	return {
		traceId: matches[1],
		parentTraceId: matches[2],
	};
}

const LOG_LEVEL = process.env.LOG_LEVEL || "INFO";

/**
 *
 * @param {string} level
 * @returns
 */
function isLogged(level) {
	const levels = ["DEBUG", "INFO", "WARN", "ERROR"];

	return levels.indexOf(level.toUpperCase()) >= levels.indexOf(LOG_LEVEL);
}

const { traceId, parentTraceId } = getLambdaTraceId();

/**
 *
 * @param {string} message
 * @param {Record<string, any>?} data
 */
function info(message, data) {
	const level = "info";
	if (!isLogged(level)) return;
	const logMsg = {
		message,
		...DEFAULT_CONTEXT,
		traceId,
		parentTraceId,
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
function debug(message, data) {
	const level = "debug";
	if (!isLogged(level)) return;
	const logMsg = {
		message,
		...DEFAULT_CONTEXT,
		traceId,
		parentTraceId,
		data,
		level,
	};
	console.log(JSON.stringify(logMsg));
}

/**
 *
 * @param {Record<string, any> | undefined} data
 * @param {Error | undefined} err
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

/**
 * @param {string} message
 * @param {Record<string, any>| Error | undefined} dataOrError
 * @param {Error | undefined} error
 * @returns
 */
function warn(message, dataOrError, error) {
	const level = "warn";
	const data =
		!error && dataOrError instanceof Error
			? getErrorData({}, dataOrError)
			: getErrorData(dataOrError, error);
	const logMsg = {
		message,
		...DEFAULT_CONTEXT,
		traceId,
		parentTraceId,
		data,
		level,
	};
	console.warn(JSON.stringify(logMsg));
}

/**
 * @param {string} message
 * @param {Record<string, any>| Error | undefined} dataOrError
 * @param {Error | undefined} error
 * @returns
 */
function error(message, dataOrError, error) {
	const level = "error";
	const data =
		!error && dataOrError instanceof Error
			? getErrorData({}, dataOrError)
			: getErrorData(dataOrError, error);
	const logMsg = {
		message,
		...DEFAULT_CONTEXT,
		traceId,
		parentTraceId,
		data,
		level,
	};
	console.error(JSON.stringify(logMsg));
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
			info("Lambda Invoke Event", { event, requestId: context.awsRequestId });
			const response = await func(event, context);
			info("Lambda Response Event", {
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
