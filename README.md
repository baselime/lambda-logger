## AWS Lambda Logging Library for Node.js

This library provides an easy-to-use logging solution for AWS Lambda functions built with Node.js.

```javascript
const { logger } = require('@baselime/lambda-logger');
logger.info('This is an informational message', {
   operation: 'copy-paste-replace',
   count: 9000
});
```

It provides an object with four logging functions - `info`, `warn`, `debug`, and `error` - which can be used to log messages at different levels of severity. The visibility of the logs can be controlled by setting the `LOG_LEVEL` environment variable. It's an extremely simple library with 0 dependencies that just wraps console.log with some helpful defaults.

### Installation

To install the library, run the following command:

```bash
npm install @baselime/lambda-logger
```

### Usage

To use the library in your Lambda function, import it at the beginning of your code:

```javascript
const { logger } = require('@baselime/lambda-logger');
```

You can then use any of the logging functions like this:

```javascript
logger.info('This is an informational message');
logger.warn('This is a warning message');
logger.debug('This is a debug message');
logger.error('This is an error message');
```

By default, only logs with a severity level of `info` or higher will be displayed. This can be controlled by setting the `LOG_LEVEL` environment variable to one of the following values:

- `DEBUG`: All log messages will be displayed.
- `INFO` (default): Only messages with a severity level of `info`, `warn`, or `error` will be displayed.
- `WARN`: Only messages with a severity level of `warn` or `error` will be displayed.
- `ERROR`: Only messages with a severity level of `error` will be displayed.


To instrument your lambda function and gain visibility of the functions event and response to help debug issues use the `wrap` method to instrument them.
### Example

```javascript
const { wrap, logger } = require('@baselime/lambda-logger');

exports.handler = wrap(async (event, context) => {
  logger.info('Lambda function started');
  try {
    const result = await someAsyncFunction();
    logger.debug('Result:', result);
    return result;
  } catch (error) {
    logger.error('Error:', error);
    throw error;
  }
});
```

### Middy

We also support [Middy](https://middy.js.org) The lambda middleware framework.

```javascript
import { logger, Baselime } from "@baselime/lambda-logger";
import middy from "@middy/core";

exports.handler = middy()
	.use(Baselime())
	.handler(function (e, context) {
		const requests = e.Records.map((el) =>
			Buffer.from(el.kinesis.data, "base64").toString("utf-8"),
		);
		logger.info("The events to stream", requests);
	});
```


### Contributing

If you would like to contribute to the development of this library, please submit a pull request on GitHub. Before submitting a pull request, please ensure that you have run the tests and that they pass.

### License

This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
