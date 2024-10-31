const useQueryParams = () => {
  const getQueryParam = (param: string): string | null => {
    const searchParams = new URLSearchParams(window.location.search);

    return searchParams.get(param);
  };
  const code = getQueryParam("code");

  return {
    getQueryParam,
    code,
  };
};

export default useQueryParams;
