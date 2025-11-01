import type { Profile } from '../types/enhanced';
import type { User } from '../types';

export function profileToUser(profile: Profile): User {
  return {
    id: profile.id,
    email: profile.email,
    role: profile.role === 'learner' ? 'student' : profile.role === 'admin' ? 'admin' : 'instructor',
    status: profile.status === 'active' ? 'active' : 'suspended',
    firstName: profile.first_name,
    lastName: profile.last_name,
    avatar: profile.avatar_url || '',
    bio: profile.bio,
    dateJoined: profile.created_at,
    lastLogin: profile.last_login,
    socialLinks: (profile.social_links as any) || {},
    expertise: profile.expertise || [],
    preferences: (profile.preferences as any) || {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        browser: true,
        mobile: true,
      },
    },
    enrolledCourses: [],
    completedCourses: [],
    wishlist: [],
    achievements: [],
  };
}

export function getUserDisplayName(profile: Profile | null): string {
  if (!profile) return 'Guest';
  return `${profile.first_name} ${profile.last_name}`.trim() || profile.email;
}

export function getUserInitials(profile: Profile | null): string {
  if (!profile) return 'G';
  const first = profile.first_name?.charAt(0) || '';
  const last = profile.last_name?.charAt(0) || '';
  return (first + last).toUpperCase() || profile.email.charAt(0).toUpperCase();
}

export function getUserRole(profile: Profile | null): 'admin' | 'instructor' | 'student' | 'learner' | 'mentor' | 'employer' {
  if (!profile) return 'student';
  return profile.role;
}

export function hasRole(profile: Profile | null, roles: string | string[]): boolean {
  if (!profile) return false;
  const roleArray = Array.isArray(roles) ? roles : [roles];

  const normalizedRoles = roleArray.map(r => {
    if (r === 'student') return 'learner';
    return r;
  });

  return normalizedRoles.includes(profile.role);
}
