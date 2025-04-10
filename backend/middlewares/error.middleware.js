const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const errors = err.errors || [];
    const data = err.data || null;
    const success = err.success || false;
  
    res.status(statusCode).json({
      success,
      message,
      errors,
      data,
    });
  };
  
  export default errorMiddleware;
  