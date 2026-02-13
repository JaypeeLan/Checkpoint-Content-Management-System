export function getApiErrorMessage(error: unknown, fallback = 'Request failed'): string {
  const err = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  return err?.response?.data?.message || err?.message || fallback;
}
