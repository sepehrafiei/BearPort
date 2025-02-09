# React Login Template (Supabase + Vite)

A simple and scalable React login template powered by **Supabase** for authentication and **Vite** for fast development. This template provides a minimal yet extendable foundation for handling user authentication in a modern web app.

## 🚀 Features

- **Email/Password Authentication** (Sign Up & Sign In)
- **OAuth Login** (Google, GitHub, etc.)
- **Session Management** with Supabase
- **Protected Routes** (Redirect unauthorized users)
- **Fast Development** with Vite
- **TypeScript Support** (Optional)

## 🛠️ Tech Stack

- **React** (Vite for blazing-fast development)
- **Supabase** (PostgreSQL + Auth)
- **React Router** (For navigation)

## 📦 Installation

1. **Clone the repository**  
   ```sh
   git clone https://github.com/your-username/react-login-template.git
   cd react-login-template
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```
# or
  ```sh
  yarn install
  ```

3. **Set up Supabase**
Create an account at Supabase
Create a new project
Copy your Supabase URL and Anon Key from the dashboard

4. **Configure Environment Variables**
Create a .env file in the root directory:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```


## 🚀 Running the Project

Start the development server:
```
npm run dev
```
# or
```
yarn dev
```

## 🔐 Authentication Setup

This template includes authentication with Supabase Auth. Users can sign up, log in, and persist their sessions.

To enable OAuth providers (Google, GitHub, etc.), go to Supabase Dashboard → Authentication → Providers and configure the required settings.