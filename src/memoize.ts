export default <T>(fn: () => T): () => T => (() => {
  let memoizedFn = () => {
    const value = fn();
    memoizedFn = () => value;
    return value;
  };
  return () => memoizedFn();
})();
