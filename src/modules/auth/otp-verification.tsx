import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import type { iLoginRequest, iOtpRequest } from "@/interfaces/auth.interface";
import { login, verifyCode } from "@/services/auth.service";
import { tempStorage } from "@/services/storage.service";
import { useAppDispatch } from "@/store/hook";
import { addAccount } from "@/store/slices/auth.slice";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as yup from "yup";

const validationSchema = yup.object({
  code: yup.string().required("Code is required."),
});

const OtpVerification = ({
  email,
  otp,
}: {
  email: string;
  otp: string | null;
}) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const formik = useFormik<iOtpRequest>({
    initialValues: {
      code: otp || "",
      email,
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      loginCallback(values);
    },
    enableReinitialize: true,
  });

  const loginCallback = async (payload: iOtpRequest) => {
    try {
      await verifyCode(payload);
      const res = tempStorage.getItem("temp");
      dispatch(addAccount(res));
    } catch (error:any) {
      console.warn(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otp) formik.submitForm();
  }, [otp]);

  return (
    <form className="space-y-4" onSubmit={formik.handleSubmit}>
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Enter code"
          className="h-12 text-center placeholder:text-base"
          {...formik.getFieldProps("code")}
        />
        {formik.touched.code ? (
          <span className="text-sm text-red-600 dark:text-red-400">
            {formik.errors.code}
          </span>
        ) : null}
      </div>

      <Button className="w-full h-12" type="submit" disabled={loading}>
        {loading ? <Spinner className="text-background" size="sm" /> : null}
        Continue
      </Button>
    </form>
  );
};

export default OtpVerification;
