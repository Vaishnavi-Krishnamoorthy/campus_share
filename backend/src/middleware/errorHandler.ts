import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Unhandled Server Error:', err);

  // MySQL specific error handling
  if (err.code === 'ER_DUP_ENTRY') {
    res.status(409).json({
      success: false,
      message: 'A duplicate record already exists with the provided unique field.'
    });
    return;
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
    res.status(400).json({
      success: false,
      message: 'Foreign key constraint failed. The referenced entity does not exist.'
    });
    return;
  }

  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    res.status(400).json({
      success: false,
      message: 'Cannot delete or update entity because it is referenced by other records.'
    });
    return;
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
