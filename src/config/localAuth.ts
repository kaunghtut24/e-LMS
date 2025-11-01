// Local Development Authentication Bypass
// This allows testing without Supabase configuration

export const LOCAL_AUTH_ENABLED = true;

export const MOCK_USERS = {
  'admin@elms.com': {
    password: 'admin123',
    role: 'admin',
    profile: {
      id: 'admin-001',
      email: 'admin@elms.com',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      avatar_url: null,
      account_type: 'b2c' as const,
      status: 'active' as const,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
      last_login: '2024-01-01T00:00:00.000Z',
      bio: 'Platform Administrator',
      organization_id: null,
    },
  },
  'instructor1@elms.com': {
    password: 'instructor123',
    role: 'instructor',
    profile: {
      id: 'instructor-001',
      email: 'instructor1@elms.com',
      first_name: 'John',
      last_name: 'Instructor',
      role: 'instructor',
      avatar_url: null,
      account_type: 'b2c' as const,
      status: 'active' as const,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
      last_login: '2024-01-01T00:00:00.000Z',
      bio: 'Senior Instructor with 10+ years experience',
      organization_id: null,
    },
  },
  'student1@elms.com': {
    password: 'student123',
    role: 'learner',
    profile: {
      id: 'student-001',
      email: 'student1@elms.com',
      first_name: 'Jane',
      last_name: 'Student',
      role: 'learner',
      avatar_url: null,
      account_type: 'b2c' as const,
      status: 'active' as const,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
      last_login: '2024-01-01T00:00:00.000Z',
      bio: 'Aspiring Full-Stack Developer',
      organization_id: null,
    },
  },
};

export const getMockUser = (email: string) => {
  return MOCK_USERS[email as keyof typeof MOCK_USERS] || null;
};
