import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/routes/common/routePath";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useAppDispatch } from "@/app/hook";
import { setCredentials } from "@/features/auth/authSlice";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import axios from "axios";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

const SignInForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const token = await userCredential.user.getIdToken();
      
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/sync-user`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      dispatch(setCredentials({ ...data, accessToken: token }));
      toast.success("Login successful");
      setTimeout(() => navigate(PROTECTED_ROUTES.HOME), 1000);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/sync-user`, { name: userCredential.user.displayName }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      dispatch(setCredentials({ ...data, accessToken: token }));
      toast.success("Google Login successful");
      setTimeout(() => navigate(PROTECTED_ROUTES.HOME), 1000);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Failed to login with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Login with Google
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to={AUTH_ROUTES.SIGN_UP}
            className="underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
