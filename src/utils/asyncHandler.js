//! I approach: using try-catch...
//& NOTE: read about it from notes

//~it is a higher order fn as it returns another function is similar as
//~ ()=>{async ()=>{}}

const asyncHandler = (fn) => async (re, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

//! II approach: using Promises...
/*
const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise
    .resolve(requestHandler(req, res, next))
    .catch((error)=>next(error));
    //* next(error) ka use karke error ko Express ke error-handling middleware tak bhej diya jata hai.Matlab hume har function me manually try-catch likhne ki zaroorat nahi hai 
  };
};*/
//& NOTE: must read about this method properly on chatgpt

export { asyncHandler };
