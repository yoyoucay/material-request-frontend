import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Create account</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Fill in your details to get started
        </p>
      </div>
      <RegisterForm />
    </>
  );
}