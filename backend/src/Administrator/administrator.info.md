# Administrator Role - Full Power (Sudo)

## Description
The `administrator` role is a superuser with full access to all backend features, including:
- User and admin management (CRUD)
- Inventory and product management
- Invoice and order management
- Commission/discount configuration
- File and image uploads
- System settings and environment variables
- Access to all logs and audit trails
- Ability to assign/revoke admin roles

## Permissions
- Can perform any action available in the system
- Can create, update, and delete any resource
- Can manage other admins and assign/revoke roles
- Can view and modify all system settings
- Can access all data, including sensitive information

## Implementation Notes
- All endpoints requiring full power should check for `role === 'administrator'`
- Use role-based guards in controllers/services
- Log all critical actions performed by administrators for audit

## Example Usage
- Creating a new admin or administrator
- Resetting another admin's password
- Changing commission rates for all libraries
- Deleting any product, order, or user

---

> **Note:** Only trusted users should be assigned the `administrator` role. Treat this role as you would a root or sudo user on a server.
