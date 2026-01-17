import StandaloneHeader from "@/components/standalone-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import { useUser } from "@/hooks/use-user";
import type { iResponse } from "@/interfaces/common.interface";
import type {
  iWorkspaceInviteDto,
  iWorkspaceRequest,
} from "@/interfaces/workspace.interface";
import { debounce } from "@/lib/debounce";
import {
  acceptInvite,
  addWorkspace,
  checkExistingSlug,
} from "@/services/workspace.service";
import { useAppDispatch } from "@/store/hook";
import {
  addWorkspace as addWorkspaceAction,
  removeInvite,
} from "@/store/slices/auth.slice";
import { useFormik } from "formik";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import * as yup from "yup";
const validationSchema = yup.object({
  name: yup.string().required("Required"),
  slug: yup
    .string()
    .required("Required")
    .matches(
      /^[a-z0-9-]+$/,
      "Invalid format, can only contain lowercase letters, numbers, and dashes"
    ),
});

export default function WorkspaceSetup() {
  const [creation, setCreation] = useState(false);
  const { currentUser } = useUser();
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [joining, setJoining] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik<iWorkspaceRequest>({
    initialValues: {
      name: "",
      slug: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (!verifying) {
        setSaving(true);
        addWorkspace(values)
          .then(
            (res) => {
              dispatch(
                addWorkspaceAction({
                  ...res.data,
                  logo: null,
                  is_owner: true,
                })
              );
              navigate(`/${res.data.slug}/`);
              setTimeout(() => window.location.reload(), 100);
            },
            (er) => {
              console.warn(er);
            }
          )
          .finally(() => setSaving(false));
      }
    },
  });

  const verifySlug = useCallback(
    debounce((slug: string, error: string | undefined) => {
      if (slug && !error) {
        setVerifying(true);
        checkExistingSlug(slug).then((res) => {
          setVerifying(false);
          formik.setFieldError(
            "slug",
            res.data == null
              ? undefined
              : "This workspace URL is already taken."
          );
        });
      }
    }, 300),
    []
  );

  const join = (invite: iWorkspaceInviteDto) => {
    setJoining(invite.token);
    acceptInvite(invite.token)
      .then(
        (res) => {
          dispatch(addWorkspaceAction(res.data));
          dispatch(removeInvite(invite));
          navigate("/", { replace: true });
          setTimeout(() => {
            window.location.reload();
          }, 100);
        },
        (er: iResponse<null>) => {
          console.warn(er);
          toast.error(er.message);
        }
      )
      .finally(() => setJoining(null));
  };

  useEffect(() => {
    verifySlug(formik.values.slug, formik.errors.slug);
  }, [formik.values.slug, formik.errors.slug, verifySlug]);

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <StandaloneHeader addAccount={true} />

      {/* Main Content */}
      <main className="flex flex-col items-center px-6 pt-32">
        {currentUser!.invites_workspaces.length > 0 && !creation ? (
          <>
            <h1 className="text-2xl font-semibold text-center mb-16 text-white">
              You have access to these workspaces
            </h1>

            <div className="w-full max-w-lg">
              <Card className="rounded-sm border-0">
                <CardContent className="px-5">
                  {currentUser?.invites_workspaces.map((x) => (
                    <div className="flex items-center justify-between mb-7">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-9 h-9 rounded-sm">
                          <AvatarFallback className="bg-[#8b5cf6] text-foreground font-medium text-sm rounded-sm">
                            {x.workspace_name
                              ?.split(" ")
                              ?.map((y) => y.split("")[0])
                              ?.slice(0, x.workspace_name?.split(" ")?.length)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-foreground text-sm">
                            {x.workspace_name}
                          </h3>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => join(x)}
                        disabled={Boolean(joining)}
                      >
                        {joining == x.token ? <Spinner size="sm" /> : null}
                        Join{joining == x.token ? "ing" : ""}
                      </Button>
                    </div>
                  ))}
                  <div className="border-t pt-6">
                    <Button variant="outline" onClick={() => setCreation(true)}>
                      <Plus className="w-4 h-4" />
                      Create new workspace
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Create new workspace</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit} id="add-workspace-form">
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label>Workspace Name</Label>
                    <Input
                      type="text"
                      autoComplete="off"
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name ? (
                      <span className="text-sm text-destructive">
                        {formik.errors.name}
                      </span>
                    ) : null}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Workspace URL</Label>
                    <div className="flex items-center border-input border rounded-md overflow-hidden dark:bg-input/30 bg-transparent py-0">
                      {/* Prefix */}
                      <div className="text-muted-foreground pl-3 py-2">
                        myra.cloud/
                      </div>
                      {/* Input */}
                      <Input
                        type="text"
                        placeholder="your-website"
                        autoComplete="off"
                        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-none pl-0 dark:bg-transparent shadow-none h-full"
                        name="slug"
                        value={formik.values.slug}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "slug",
                            e.target.value.toLowerCase().trim()
                          );
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    {formik.touched.slug ? (
                      <span className="text-sm text-destructive">
                        {formik.errors.slug}
                      </span>
                    ) : null}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full"
                disabled={saving}
                form="add-workspace-form"
              >
                {saving ? (
                  <Spinner size="sm" className="text-background" />
                ) : null}{" "}
                Creat{saving ? "ing" : "e"} workspace
              </Button>
              {currentUser!.invites_workspaces.length > 0 ? (
                <>
                  <div className="relative w-full mt-4">
                    <Separator />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-card px-2 text-xs text-gray-500 dark:text-gray-400">
                        OR
                      </span>
                    </div>
                  </div>
                  <Button variant="link" onClick={() => setCreation(false)}>
                    Join existing workspace
                  </Button>
                </>
              ) : null}
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  );
}
