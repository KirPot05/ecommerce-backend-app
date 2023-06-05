export function failed_response(code, message, response = {}) {
  return {
    success: false,
    code: code,
    response: response,
    message: message,
  };
}

export function success_response(code, message, response) {
  return {
    success: true,
    code: code,
    response: response,
    message: message,
  };
}
