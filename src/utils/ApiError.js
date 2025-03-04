//* Node.js ki built-in Error class ko extend kar rahe hain, taaki custom API errors handle ho sakein.
class ApiError extends Error {
  constructor(
    statusCode, //* HTTP status code jaise 400 (Bad Request), 404 (Not Found), 500 (Server Error)
    message = "Something went wrong!", //* Default error message agar koi message pass na kiya jaye
    errors = [], //* Extra errors ka array, jo validation ya backend se aane wale errors store karega
    stack = "   " //* Stack trace debugging ke liye
  ) {
    super(message); //* Parent Error class ka constructor call kar rahe hain, jo error message set karega

    this.statusCode = statusCode; //*HTTP status code store ho raha hai
    this.data = null; //* Agar kabhi extra data bhejna ho, toh isme store ho sakta hai
    this.message = message; //* Error message store ho raha hai
    this.success = false; //* API error hai, is wajah se success hamesha false rahega
    this.errors = errors; //* Extra errors ko yahan store kar rahe hain

    //* Agar custom stack trace diya gaya hai toh use karenge, warna automatic stack trace generate hoga
    if (stack) {
      this.stack = stack;
    } else {
      //* Error ka proper stack trace generate karne ke liye
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

//? 🔹 Final Benefits of ApiError Class
//* ✔ Consistent error messages milenge.
//* ✔ HTTP status codes properly set honge.
//* ✔ Debugging aur logging easy ho jayegi.
//* ✔ Frontend developers ko proper error structure milega.
