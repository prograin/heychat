import { string, z } from "zod";
import { INTEREST_VALUES } from "../../../../../../shared/constants/interests";
import { CAREER_VALUES, CAREERS } from "../../../../../../shared/constants/careers";
import { allLabelCities, allLabelCountries, allLabelStates } from "./profile.helper";

export const profileSchema = z.object({
  first_name: z
    .preprocess((val) => (val === "" || val === undefined ? null : val), z.string().trim().nullable())
    .nullable()
    .optional(),
  last_name: z
    .preprocess((val) => (val === "" || val === undefined ? null : val), z.string().trim().nullable())
    .nullable()
    .optional(),
  age: z
    .string()
    .trim()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(110))
    .nullable()
    .optional(),
  country: z.enum(allLabelCountries).nullable().optional(),
  state: z.enum(allLabelStates).nullable().optional(),
  city: z.enum(allLabelCities).nullable().optional(),
  career: z.enum(CAREER_VALUES).nullable().optional(),
  interests: z.array(z.enum(INTEREST_VALUES)).nullable().optional(),
  description: z
    .preprocess((val) => (val === "" || val === undefined ? null : val), z.string().trim().max(600, "Description too long").nullable())
    .optional(),
});
