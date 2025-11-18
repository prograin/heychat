export function safeRunFunction(fn: any) {
  try {
    fn();
  } catch {}
}
