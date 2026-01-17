import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import type { iLoginRequest } from "@/interfaces/auth.interface";
import { login } from "@/services/auth.service";
import { useAppDispatch } from "@/store/hook";
import { addAccount } from "@/store/slices/auth.slice";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "sonner";
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email.")
    .required("Please enter a valid email."),
});

const SignIn = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleGoogleLogin = () => {
    // Google OAuth endpoint pe redirect
    window.location.href = "http://api.myracloud.io/auth/google";
  };

  const handleMicrosoftLogin = () => {
    window.location.href = "https://api.myracloud.io/auth/microsoft" ;
  }

  const handleGithubLogin = () => {
    window.location.href = "https://api.myracloud.io/auth/github"
  }

  const formik = useFormik<iLoginRequest>({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      loginCallback(values);
    },
  });

  const loginCallback = (payload: iLoginRequest) => {
    login(payload)
      .then(
        (res) => {
          dispatch(addAccount(res.data));
        },
        (er) => {
          console.warn(er);
          toast.error("Something went wrong");
        }
      )
      .finally(() => {
        setLoading(false);
      });
  }; 

  return (
    <div className="min-h-screen flex flex-col align-center justify-center">
      {/* Header */}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardContent className="space-y-6">
            <h1 className="text-2xl font-semibold text-center text-foreground">
              Sign in
            </h1>

            {/* Social Login Buttons */}

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 justify-center gap-3"
                onClick={handleGoogleLogin}
              >
                <img className="w-5 h-5" src="/icon/social/google.svg" />
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 justify-center gap-3"
                onClick={handleMicrosoftLogin}
              >
                <img className="w-5 h-5" src="/icon/social/microsoft_logo.png" />
                Continue with Microsoft
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 justify-center gap-3"
                onClick={handleGithubLogin}
              >
                <img className="w-5 h-5" src="/icon/social/github.svg" />
                Continue with Github
              </Button>
            </div>
            <div className="relative">
              <Separator className="bg-muted-foreground" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background text-foreground px-2 text-xs">
                  OR
                </span>
              </div>
            </div>
            {/* Email Form */}
            <form className="space-y-4" onSubmit={formik.handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email address..."
                  className="h-12"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email ? (
                  <span className="text-sm text-red-600 dark:text-red-400">
                    {formik.errors.email}
                  </span>
                ) : null}
                <p className="text-sm text-muted-foreground">
                  Use an organization email to easily collaborate with teammates
                </p>
              </div>

              <Button className="w-full h-12" type="submit" disabled={loading}>
                {loading ? (
                  <Spinner className="text-background" size="sm" />
                ) : null}
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      {/* <footer className="pb-8 pt-16">
        <div className="flex justify-center">
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span>© Defcon systems</span>
            <a
              href="#"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Support
            </a>
            <a
              href="#"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Log out
            </a>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default SignIn;
