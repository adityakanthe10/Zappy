import { z } from "zod";

// Define the schema for validating email
export const emailValidator = z
  .string()
  .email("Invalid email format")  // Zod's built-in email validation
  .min(5, "Email must be at least 5 characters long")  // Optional additional constraint

// Define the schema for validating password
export const passwordValidator = z
  .string()
  .min(8, "Password must be at least 8 characters long") // Minimum length
  .regex(/[a-zA-Z]/, "Password must contain at least one letter") // Must contain at least one letter
  .regex(/\d/, "Password must contain at least one number") // Must contain at least one number
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"); // Must contain at least one special character
