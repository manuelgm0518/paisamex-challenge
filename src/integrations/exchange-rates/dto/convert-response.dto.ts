export interface ConvertResponseDto {
  date: Date;
  info: ConvertResponseInfo;
  query: ConvertResponseQuery;
  result: number;
  success: boolean;
}

export interface ConvertResponseInfo {
  rate: number;
  timestamp: number;
}

export interface ConvertResponseQuery {
  amount: number;
  from: string;
  to: string;
}
