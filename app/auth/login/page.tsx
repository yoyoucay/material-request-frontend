import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Sign in to your account to continue
        </p>
      </div>
      <LoginForm />
    </>
  );
}