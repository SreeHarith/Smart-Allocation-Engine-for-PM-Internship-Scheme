import { Internship, Student } from "../types";

const API_URL = "http://localhost:8000/api";

export const api = {
  async getInternships(): Promise<Internship[]> {
    const response = await fetch(`${API_URL}/internships`);
    if (!response.ok) throw new Error('Failed to fetch internships');
    return response.json();
  },

  async createInternship(internship: Internship): Promise<Internship> {
    const response = await fetch(`${API_URL}/internships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(internship),
    });
    if (!response.ok) throw new Error('Failed to create internship');
    return response.json();
  },

  async applyToInternship(internshipId: number, studentId: number): Promise<void> {
    const response = await fetch(`${API_URL}/internships/${internshipId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId }),
    });
    if (!response.ok) throw new Error('Failed to apply to internship');
  },

  async getStudents(): Promise<Student[]> {
    const response = await fetch(`${API_URL}/students`);
    if (!response.ok) {
        throw new Error("Failed to fetch students");
    }
    return response.json();
  },

  async register(data: any): Promise<Student> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Registration failed');
    }
    return response.json();
  },

  async login(data: any): Promise<Student> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Login failed');
    }
    return response.json();
  },

  async loginCompany(data: any): Promise<any> {
    const response = await fetch(`${API_URL}/auth/company/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Login failed');
    }
    return response.json();
  },

    async registerCompany(data: any): Promise<any> {
    const response = await fetch(`${API_URL}/auth/company/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Registration failed');
    }
    return response.json();
  },

  async loginAdmin(data: any): Promise<any> {
    const response = await fetch(`${API_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Login failed');
    }
    return response.json();
  },

  async registerAdmin(data: any): Promise<any> {
    const response = await fetch(`${API_URL}/auth/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Registration failed');
    }
    return response.json();
  },

  async updateStudent(studentId: number, data: any): Promise<Student> {
      const response = await fetch(`${API_URL}/students/${studentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      });
      if (!response.ok) {
          throw new Error('Failed to update profile');
      }
      return response.json();
  },

  async chatWithMentor(message: string, history: any[], studentId: number): Promise<string> {
    const formattedHistory = history.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
    }));

    const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: formattedHistory, studentId }),
    });
    if (!response.ok) {
        throw new Error('Failed to get response');
    }
    const data = await response.json();
    return data.response;
  },

  async getRecommendations(student: Student): Promise<any[]> {
    const response = await fetch(`${API_URL}/matching/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
    });
    if (!response.ok) throw new Error('Failed to fetch recommendations');
    return response.json();
  },

  async getMatchScore(student: Student, internshipId: number): Promise<number> {
    const response = await fetch(`${API_URL}/matching/score/${internshipId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
    });
    if (!response.ok) throw new Error('Failed to calculate score');
    const data = await response.json();
    return data.score;
  }
};
