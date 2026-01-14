export type Role = 'admin' | 'staff' | 'student';

export const ROLE = {
  Admin: 'admin',
  Staff: 'staff',
  Student: 'student',
} as const;

export const isStudent = (role?: Role | null) => role === ROLE.Student;
export const isStaff = (role?: Role | null) => role === ROLE.Staff;
export const isAdmin = (role?: Role | null) => role === ROLE.Admin;