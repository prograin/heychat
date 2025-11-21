export function validateWithZod(schema: any, data: any) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { valid: false, errors: result.error.errors };
  }
  return { valid: true, data: result.data };
}
