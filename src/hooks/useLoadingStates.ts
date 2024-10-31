import { useState } from "@wordpress/element";

function useLoadingStates() {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  return {
    loading1,
    loading2,
    setLoading1,
    setLoading2,
    loading3,
    setLoading3,
  };
}

export { useLoadingStates };
