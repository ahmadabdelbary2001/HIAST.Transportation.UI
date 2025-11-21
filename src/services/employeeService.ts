// src/services/employeeService.ts
import type { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '@/types/index';
import { MockApiService } from './mockApi';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

// Seed data
const seedEmployees: Employee[] = [
  {
    id: 1,
    employeeNumber: 'EMP001',
    firstName: 'Ahmad',
    lastName: 'Al-Hassan',
    email: 'ahmad.hassan@hiast.edu.sy',
    phoneNumber: '+963 11 1234567',
    department: 'Computer Science',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    createdBy: 'system',
  },
  {
    id: 2,
    employeeNumber: 'EMP002',
    firstName: 'Fatima',
    lastName: 'Al-Sayed',
    email: 'fatima.sayed@hiast.edu.sy',
    phoneNumber: '+963 11 2345678',
    department: 'Engineering',
    isActive: true,
    createdAt: new Date('2024-01-20'),
    createdBy: 'system',
  },
  {
    id: 3,
    employeeNumber: 'EMP003',
    firstName: 'Mohammed',
    lastName: 'Al-Khatib',
    email: 'mohammed.khatib@hiast.edu.sy',
    phoneNumber: '+963 11 3456789',
    department: 'Administration',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    createdBy: 'system',
  },
  {
    id: 4,
    employeeNumber: 'EMP004',
    firstName: 'Layla',
    lastName: 'Al-Nouri',
    email: 'layla.nouri@hiast.edu.sy',
    phoneNumber: '+963 11 4567890',
    department: 'Mathematics',
    isActive: true,
    createdAt: new Date('2024-02-10'),
    createdBy: 'system',
  },
  {
    id: 5,
    employeeNumber: 'EMP005',
    firstName: 'Omar',
    lastName: 'Al-Shami',
    email: 'omar.shami@hiast.edu.sy',
    phoneNumber: '+963 11 5678901',
    department: 'Physics',
    isActive: false,
    createdAt: new Date('2024-02-15'),
    createdBy: 'system',
  },
];

class EmployeeService extends MockApiService<Employee> {
  constructor() {
    super(LOCAL_STORAGE_KEYS.EMPLOYEES, seedEmployees);
  }

  async createEmployee(dto: CreateEmployeeDto): Promise<Employee> {
    return this.create({
      ...dto,
      isActive: dto.isActive ?? true,
    });
  }

  async updateEmployee(id: number, dto: UpdateEmployeeDto): Promise<Employee | null> {
    return this.update(id, dto);
  }

  async getActiveEmployees(): Promise<Employee[]> {
    return this.search((emp) => emp.isActive);
  }

  async getByDepartment(department: string): Promise<Employee[]> {
    return this.search((emp) => emp.department === department);
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    const lowerQuery = query.toLowerCase();
    return this.search(
      (emp) =>
        emp.firstName.toLowerCase().includes(lowerQuery) ||
        emp.lastName.toLowerCase().includes(lowerQuery) ||
        emp.employeeNumber.toLowerCase().includes(lowerQuery) ||
        emp.email.toLowerCase().includes(lowerQuery)
    );
  }
} // Added missing closing brace

export const employeeService = new EmployeeService();