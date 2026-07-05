import { ZodError, ZodIssue } from 'zod';

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorDetails: any;
};

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const issues = error.issues.map((issue: ZodIssue) => {
    return {
      field: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  return {
    statusCode: 400,
    message: 'Validation error',
    errorDetails: { issues },
  };
};

export default handleZodError;
