export enum RemittanceStatus {
  SENT = 'sent',
  REJECTED = 'rejected',
  CANCELED = 'canceled',
  WITHDRAWN = 'withdrawn',
}
export const REMITTANCE_STATUS_VALUES = Object.values(RemittanceStatus);
export const ALL_REMITTANCE_STATUS_EXCEPT = (...status: RemittanceStatus[]) =>
  REMITTANCE_STATUS_VALUES.filter((e) => !status.includes(e));
