const API_URL = "http://localhost:8000/api/admin";

export interface AdminStats {
    totalStudents: number;
    totalCompanies: number;
    activeInternships: number;
    placements: number;
}

export interface UserData {
    students: any[];
    companies: any[];
}

export interface AnalyticsData {
    skillsChart: { name: string; demand: number; supply: number }[];
}

export const adminService = {
    async getStats(): Promise<AdminStats> {
        const response = await fetch(`${API_URL}/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        return response.json();
    },

    async getUsers(): Promise<UserData> {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    async getAnalytics(): Promise<AnalyticsData> {
        const response = await fetch(`${API_URL}/analytics`);
        if (!response.ok) throw new Error('Failed to fetch analytics');
        return response.json();
    }
};
