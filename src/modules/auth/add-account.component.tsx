import StandaloneHeader from "@/components/standalone-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import type { iLoginRequest,} from "@/interfaces/auth.interface";
import { login } from "@/services/auth.service";
import { useAppDispatch, } from "@/store/hook";
import { addAccount } from "@/store/slices/auth.slice";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email.")
    .required("Please enter a valid email."),
});

export default function AddAccount() {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik<iLoginRequest>({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      loginCallback(values);
    },
  });

  const loginCallback = (payload: iLoginRequest) => {
    setLoading(true);
    login(payload)
      .then(
        (res) => {
          dispatch(addAccount(res.data));
          navigate("/", { replace: true });
          setTimeout(() => {
            window.location.reload();
          }, 100);
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
    <div className="min-h-screen">
      {/* Header */}
      <StandaloneHeader addAccount={false} />

      {/* Main Content */}
      <main className="flex flex-col items-center">
        <Card className="w-full max-w-sm border-0 shadow-none bg-transparent dark:bg-transparent">
          <CardContent className="space-y-6 p-0">
            <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
              Sign in
            </h1>

            {/* Social Login Buttons */}

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 justify-center gap-3"
              >
                <img className="w-5 h-5" src="/icon/social/google.svg" />
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 justify-center gap-3"
              >
                <img className="w-5 h-5" src="/icon/social/github.svg" />
                Continue with GitHub
              </Button>
            </div>
            <div className="relative">
              <Separator className="bg-gray-300 dark:bg-gray-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white dark:bg-gray-900 px-2 text-xs text-gray-500 dark:text-gray-400">
                  OR
                </span>
              </div>
            </div>
            {/* Email Form */}
            <form className="space-y-4" onSubmit={formik.handleSubmit}>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </Label>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Use an organization email to easily collaborate with teammates
                </p>
              </div>

              <Button
                className="w-full h-12 bg-blue-500 dark:bg-blue-600 text-white dark:text-gray-100 hover:bg-blue-600 dark:hover:bg-blue-700"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Spinner
                    className="text-white dark:text-gray-100"
                    size="sm"
                  />
                ) : null}
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
