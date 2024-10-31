// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WPQTResponse<T = any> = {
  success: boolean;
  messages: string[];
  data: T;
};

export type { WPQTResponse };
