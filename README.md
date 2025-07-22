# Accountability App

A simple web application for tracking personal goals and accountability. Built with Next.js, Supabase, and TailwindCSS.

## Features

- User authentication (Supabase Auth)
- Create, edit, and delete goals
- Mark goals as complete or pending
- Real-time updates for goal changes
- Filter goals by status (pending/completed)
- Responsive and clean UI

## Tech Stack

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/) (Database & Auth)
- [TailwindCSS](https://tailwindcss.com/)
- React

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/accountability.git
   cd accountability
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Usage

- Log in using Supabase Auth.
- Add new goals with a title, description, and target date.
- Edit or delete existing goals.
- Mark goals as complete or pending.
- View real-time updates as goals are added or changed.

## Roadmap
- Implement user regsitration

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.
