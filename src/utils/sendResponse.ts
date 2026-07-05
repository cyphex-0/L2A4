import { Response } from 'express';

type IApiReponse<T> = {
  success: boolean;
  statusCode: number;
  message?: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T | null;
};

const sendResponse = <T>(res: Response, data: IApiReponse<T>) => {
  const responseData: any = {
    success: data.success,
    statusCode: data.statusCode,
    message: data.message || null,
    meta: data.meta || null,
    data: data.data || null,
  };

  // Do not include meta if it's null/undefined
  if (!responseData.meta) {
    delete responseData.meta;
  }

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
