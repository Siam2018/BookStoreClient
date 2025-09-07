This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


1. Axios Data Fetching (6+ endpoints, all CRUD)
GET: Fetch products, customers, orders, etc.
POST: Add customer, create order, etc.
PUT: Update product/customer/order.
PATCH: Partially update product/customer/order.
DELETE: Remove product/customer/order.
UI: Each operation should have a corresponding form/button and display results.
2. Website Layout, Routes, Dynamic Routes, Rendering, Components
Layout: Navbar, Footer, Main content area.
Routes: /, /products, /about, /login, /register, /orders, /profile/:id (dynamic).
Rendering: SSR (getServerSideProps), CSR (useEffect), SSG (getStaticProps).
Components: Navbar, ProductSection, OrderList, CustomerProfile, etc.
3. Frontend Data Validation
Use form validation (e.g., required fields, email format, password strength) before Axios submission.
4. Git Merge
Use feature branches, commit changes, and merge (pull requests) for both backend and frontend.
5. TailwindCSS
Use Tailwind classes for styling all components and pages.
6. Authentication
Login/Logout, JWT token storage, protected routes (e.g., only logged-in users can order).
7. Bonus: PusherJS Notifications
Integrate Pusher Beams for real-time notifications (e.g., order status updates).
Next Steps
Implement Axios CRUD in frontend: Create UI for each operation.
Ensure layout and routing: Use Next.js pages and dynamic routes.
Add validation to forms: Use React state or libraries like Yup.
Style with TailwindCSS: Update all components.
Integrate authentication: Use JWT from backend.
Set up PusherJS (bonus): Add notification logic.