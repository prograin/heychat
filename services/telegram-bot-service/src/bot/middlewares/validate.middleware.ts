export function validateWithZod(schema: any, data: any) {
  const result = schema.safeParse(data);
  if (!result.success) {
    // Take the first issue's message
    const message = result.error.issues[0]?.message || "Invalid input";
    return { valid: false, errors: message };
  }
  return { valid: true, data: result.data };
}
