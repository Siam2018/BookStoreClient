import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { CustomerDto, UpdateCustomerStatusDto } from './customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  // Find customer by email (for authentication)
  async findByEmail(email: string): Promise<CustomerEntity | null> {
    try {
      return await this.customerRepository.findOne({ where: { email } });
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to find customer by email',
        error.status || 500
      );
    }
  }

  // Get customer image path by ID
  async getCustomerImagePath(id: number): Promise<string | null> {
    try {
      const customer = await this.getCustomerById(id);
      return customer.imageURL || null;
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to get customer image path',
        error.status || 500
      );
    }
  }

  // Create a customer (includes User Category 1 Operation 1: Create a user)
  async addCustomer(customerDto: CustomerDto): Promise<CustomerEntity> {
    try {
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(customerDto.password, saltRounds);
      const customer = this.customerRepository.create({ ...customerDto, password: hashedPassword });
      return await this.customerRepository.save(customer);
    } catch (error) {
      // Duplicate email (Postgres, MySQL, SQLite, etc.)
      if (error.code === '23505' && error.detail?.includes('email')) {
        throw new (require('@nestjs/common').BadRequestException)('Email already exists');
      }
      if (error.code === 'ER_DUP_ENTRY' && error.message?.includes('email')) {
        throw new (require('@nestjs/common').BadRequestException)('Email already exists');
      }
      if (error.message?.toLowerCase().includes('duplicate') && error.message?.toLowerCase().includes('email')) {
        throw new (require('@nestjs/common').BadRequestException)('Email already exists');
      }
      // Validation errors
      if (error.message?.toLowerCase().includes('not null') && error.message?.toLowerCase().includes('full name')) {
        throw new (require('@nestjs/common').BadRequestException)('Full name is required');
      }
      if (error.message?.toLowerCase().includes('not null') && error.message?.toLowerCase().includes('email')) {
        throw new (require('@nestjs/common').BadRequestException)('Email is required');
      }
      if (error.message?.toLowerCase().includes('not null') && error.message?.toLowerCase().includes('password')) {
        throw new (require('@nestjs/common').BadRequestException)('Password is required');
      }
      if (error.message?.toLowerCase().includes('invalid input syntax for type date')) {
        throw new (require('@nestjs/common').BadRequestException)('Date of birth must be a valid date (YYYY-MM-DD)');
      }
      // General fallback
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to add customer',
        error.status || 500
      );
    }
  }

  // Get all customers
  async getAllCustomers(): Promise<CustomerEntity[]> {
    try {
      return await this.customerRepository.find();
    } catch (error) {
      if (error.message?.toLowerCase().includes('not found')) {
        throw new (require('@nestjs/common').NotFoundException)('No customers found');
      }
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to get all customers',
        error.status || 500
      );
    }
  }

  // Get customer by ID
  async getCustomerById(id: number): Promise<CustomerEntity> {
    try {
      const customer = await this.customerRepository.findOneBy({ id: id });
      if (!customer) {
        throw new (require('@nestjs/common').NotFoundException)(`Customer with ID ${id} not found`);
      }
      return customer;
    } catch (error) {
      if (error.message?.toLowerCase().includes('not found')) {
        throw new (require('@nestjs/common').NotFoundException)(`Customer with ID ${id} not found`);
      }
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to get customer by ID',
        error.status || 500
      );
    }
  }

  // User Category 1 Operation 2: Change the status of a user to either 'active' or 'inactive'
  async updateCustomerStatus(id: number, statusDto: UpdateCustomerStatusDto): Promise<CustomerEntity> {
    try {
      const customer = await this.getCustomerById(id);
      customer.status = statusDto.status;
      return await this.customerRepository.save(customer);
    } catch (error) {
      if (error.message?.toLowerCase().includes('not found')) {
        throw new (require('@nestjs/common').NotFoundException)(`Customer with ID ${id} not found`);
      }
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to update customer status',
        error.status || 500
      );
    }
  }

  // User Category 1 Operation 3: Retrieve a list of users based on their 'inactive' status
  async getInactiveCustomers(): Promise<CustomerEntity[]> {
    try {
      return await this.customerRepository.find({ 
        where: { status: 'inactive' } 
      });
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to get inactive customers',
        error.status || 500
      );
    }
  }

  // User Category 1 Operation 4: Get a list of users older than specified age
  async getCustomersOlderThan(minAge: number): Promise<CustomerEntity[]> {
    try {
      const currentDate = new Date();
      const cutoffDate = new Date(currentDate.getFullYear() - minAge, currentDate.getMonth(), currentDate.getDate());
      return await this.customerRepository.createQueryBuilder('customer')
        .where('customer.dateOfBirth < :date', { date: cutoffDate })
        .andWhere('customer.dateOfBirth IS NOT NULL')
        .getMany();
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to get customers older than specified age',
        error.status || 500
      );
    }
  }

  // Keep the original method for backward compatibility
  async getCustomersOlderThan40(): Promise<CustomerEntity[]> {
    return this.getCustomersOlderThan(40);
  }

  // Additional useful methods for comprehensive functionality
  async getActiveCustomers(): Promise<CustomerEntity[]> {
    return await this.customerRepository.find({ 
      where: { status: 'active' } 
    });
  }

  async getCustomersByAge(minAge: number, maxAge?: number): Promise<CustomerEntity[]> {
    const currentDate = new Date();
    const minBirthDate = new Date(currentDate.getFullYear() - (maxAge || 150), currentDate.getMonth(), currentDate.getDate());
    const maxBirthDate = new Date(currentDate.getFullYear() - minAge, currentDate.getMonth(), currentDate.getDate());
    
    const query = this.customerRepository.createQueryBuilder('customer')
      .where('customer.dateOfBirth IS NOT NULL')
      .andWhere('customer.dateOfBirth <= :maxBirthDate', { maxBirthDate })
      .andWhere('customer.dateOfBirth >= :minBirthDate', { minBirthDate });
    
    return await query.getMany();
  }

  async getCustomersByCity(city: string): Promise<CustomerEntity[]> {
    try {
      return await this.customerRepository.find({ 
        where: { city } 
      });
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || `Failed to get customers from city: ${city}`,
        error.status || 500
      );
    }
  }

  async getCustomersByGender(gender: string): Promise<CustomerEntity[]> {
    try {
      return await this.customerRepository.find({ 
        where: { gender } 
      });
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || `Failed to get customers by gender: ${gender}`,
        error.status || 500
      );
    }
  }

  async searchCustomersByName(searchTerm: string): Promise<CustomerEntity[]> {
    try {
      return await this.customerRepository.createQueryBuilder('customer')
        .where('customer.fullName ILIKE :searchTerm', 
          { searchTerm: `%${searchTerm}%` })
        .getMany();
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || `Failed to search customers by name: ${searchTerm}`,
        error.status || 500
      );
    }
  }

  // Update customer (general)
  async updateCustomer(id: number, updateData: Partial<CustomerDto>): Promise<CustomerEntity> {
    try {
      // Hash password if present
      if (updateData.password) {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
      }
      await this.customerRepository.update(id, updateData);
      const updatedCustomer = await this.customerRepository.findOneBy({ id: id });
      if (!updatedCustomer) {
        throw new (require('@nestjs/common').NotFoundException)(`Customer with ID ${id} not found after update`);
      }
      // Do not return password
      if (updatedCustomer) {
        updatedCustomer.password = '';
      }
      return updatedCustomer;
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || `Failed to update customer with ID ${id}`,
        error.status || 500
      );
    }
  }

  // Update customer image
  async updateCustomerImage(id: number, imageURL: string): Promise<CustomerEntity> {
    try {
      const customer = await this.getCustomerById(id);
      customer.imageURL = imageURL;
      return await this.customerRepository.save(customer);
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || `Failed to update image for customer with ID ${id}`,
        error.status || 500
      );
    }
  }

  // Delete customer
  async deleteCustomer(id: number): Promise<void> {
    try {
      await this.customerRepository.delete(id);
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || `Failed to delete customer with ID ${id}`,
        error.status || 500
      );
    }
  }

  // Toggle customer status between active/inactive (User Category 1 convenience method)
  async toggleCustomerStatus(id: number): Promise<CustomerEntity> {
    try {
      const customer = await this.getCustomerById(id);
      customer.status = customer.status === 'active' ? 'inactive' : 'active';
      return await this.customerRepository.save(customer);
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || `Failed to toggle status for customer with ID ${id}`,
        error.status || 500
      );
    }
  }

  // Helper method to calculate age from date of birth
  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}