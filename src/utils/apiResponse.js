class ApiResponse {
  constructor(success, message, data = null, errors = null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }

  static success(message, data = null) {
    return new ApiResponse(true, message, data, null);
  }

  static error(message, errors = null) {
    return new ApiResponse(false, message, null, errors);
  }
}

export default ApiResponse;
