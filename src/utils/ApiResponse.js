//!  API ka response structured format me dene ke liye ek class bana rahe hain

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode; //* API ka HTTP status code store karega (e.g., 200, 404, 500)
    this.data = data; //* API se jo data return hoga, usko store karega
    this.message = message; //* Response ke sath ek message add karega (default: "Success")
    this.success = statusCode < 400; //* Agar status code 400 se chhota hai toh success true, warna false
  }
}

//* Is class ka use API ke response ko structured aur clean banane ke liye hota hai
//* Har API response consistent format me aayega, jo frontend ke liye easy hoga

export { ApiResponse }; //* Is class ko export kar rahe
