/**
 * Utility to extract student index / student ID numbers from student email addresses.
 * E.g., "0420261234@htu.edu.gh" => "0420261234"
 *       "student0420265678@student.htu.edu.gh" => "0420265678"
 */
export function extractStudentIdFromEmail(email: string): string {
  if (!email) return "";
  const prefix = email.split("@")[0] || email;
  const matches = prefix.match(/\d+/g);
  return matches ? matches.join("") : "";
}
