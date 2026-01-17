import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { iTeamsRequest } from "@/interfaces/teams.interface";
import { addTeams } from "@/services/team.service";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import * as yup from "yup";
import { IconPicker } from "../projects/components/icon-picker";
import { set } from "lodash";
import { setTeams } from "@/store/slices/team.slice";
import { generateIdentifier } from "@/components/generate-identifier";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  identifier: yup.string().optional(),
  description: yup.string().optional(),
  icon: yup.mixed().nullable(),
});

export default function Create() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const currentWorkspace = useSelector(
    (state: any) => state.auth.currentWorkspace
  );
  const [projectIcon, setProjectIcon] = useState<{
    icon: string;
    color: string;
    type: "icon" | "emoji";
  }>();

  console.log(currentWorkspace);
  const formik = useFormik<iTeamsRequest>({
    initialValues: {
      name: "",
      description: "",
      workspace_id: currentWorkspace,
      icon: "",
      identifier: "",
    },
    validationSchema,
    onSubmit: (values): void => {
      setLoading(true);
      const payoad = {
        ...values,
        icon: projectIcon,
      };

      addTeams(payoad)
        .then((res) => {
          console.log("TEAM Response", res);
          dispatch(setTeams(res.data));
          toast.success("Team is Created Successfully");
          navigate("/teams", { replace: true });
          setTimeout(() => {
            window.location.reload();
          }, 100);
        })
        .catch((err) => {
          const errorMessage =
            err?.data?.identifier?.[0] ??
            err?.data?.message ??
            "Something went wrong";

          toast.error(errorMessage);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-8 space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-foreground">
            Create a new team
          </h1>
          <p className="text-muted-foreground text-base">
            Create a new team to manage separate cycles, workflows and
            notifications
          </p>
        </div>

        <div className="space-y-10">
          <form method="POST" onSubmit={formik.handleSubmit}>
            <div className="bg-card border border-border rounded divide-y divide-border">
              <div className="flex items-center justify-between p-4">
                <Label className="text-base font-medium text-foreground">
                  Team icon
                </Label>
                <IconPicker value={projectIcon} onChange={setProjectIcon} />
              </div>

              <div className="flex items-center justify-between p-4">
                <Label
                  htmlFor="team-name"
                  className="text-base font-medium text-foreground"
                >
                  Team name
                </Label>
                <Input
                  id="team-name"
                  type="text"
                  placeholder="e.g. Engineering"
                  {...formik.getFieldProps("name")}
                  onChange={(e) => {
                    const value = e.target.value;
                    formik.setFieldValue("name", value);

                    const identifier = generateIdentifier(value);
                    formik.setFieldValue("identifier", identifier);
                  }}
                  className="w-80 h-10 bg-background border-border text-base placeholder:text-muted-foreground"
                />
              </div>

              <div className="flex items-start justify-between p-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="identifier"
                    className="text-base font-medium text-foreground"
                  >
                    Identifier
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Used to identify issues from this team (e.g. ENG-123)
                  </p>
                </div>
                <Input
                  id="identifier"
                  type="text"
                  {...formik.getFieldProps("identifier")}
                  placeholder="e.g. ENG"
                  value={formik.values.identifier}
                  className="w-80 h-10 bg-background border-border text-base placeholder:text-muted-foreground"
                />
              </div>

              <div className="flex items-start justify-between p-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="identifier"
                    className="text-base font-medium text-foreground"
                  >
                    Description
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Write a description
                  </p>
                </div>
                <Input
                  id="description"
                  placeholder=". . ."
                  type="text"
                  {...formik.getFieldProps("description")}
                  className="w-80 h-10 bg-background border-border text-base placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3 pt-5">
                <h3 className="text-base font-medium text-foreground">
                  Team hierarchy
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Teams can be nested to reflect your team structure and to
                  share workflows and settings
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-card border border-border rounded">
                  <Label className="text-base text-muted-foreground">
                    Parent team
                  </Label>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-muted/50 text-muted-foreground border-0 "
                  >
                    Available on Business
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-base font-medium text-foreground pt-5">
                  Copy settings from existing team
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You can choose to copy the settings of an existing team for
                  your newly created team. All settings including workflow and
                  cycle settings are copied, but Slack notification settings and
                  team members won't be copied.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-card border border-border rounded">
                  <Label className="text-base text-muted-foreground">
                    Copy from team
                  </Label>
                  <Select defaultValue="dont-copy">
                    <SelectTrigger className="w-32 h-auto border-0 bg-transparent text-sm text-muted-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dont-copy">Don't copy</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-base font-medium text-foreground pt-5">
                  Timezone
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The timezone should be set as the location where most of your
                  team members reside. All other times referenced by the team
                  will be relative to this timezone setting. For example, if the
                  team uses cycles, each cycle will start at midnight in the
                  specified timezone.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-card border border-border rounded">
                  <Label className="text-base text-muted-foreground">
                    Timezone
                  </Label>
                  <Select defaultValue="gmt-plus-5">
                    <SelectTrigger className="w-64 h-auto border-0 bg-transparent text-sm text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gmt-plus-5">
                        GMT+5:00 – Pakistan Standard Time
                      </SelectItem>
                      {/* <SelectItem value="gmt">
                      GMT+0:00 – Greenwich Mean Time
                    </SelectItem>
                    <SelectItem value="gmt-plus-1">
                      GMT+1:00 – Central European Time
                    </SelectItem>
                    <SelectItem value="gmt-minus-5">
                      GMT-5:00 – Eastern Standard Time
                    </SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-base font-medium text-foreground pt-5">
                  Make team private
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Private teams and their issues are only visible to members of
                  the team and admins. Only admins and team owners can add new
                  users to a private team. Public teams and their issues are
                  visible to anyone in the workspace.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-card border border-border rounded">
                  <Label className="text-base text-muted-foreground">
                    Private team
                  </Label>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-muted/50 text-muted-foreground border-0"
                  >
                    Available on Business
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-8">
              <Button
                className="font-medium me-2 cursor-pointer"
                variant="secondary"
                onClick={() => navigate("../", { relative: "route" })}
              >
                Go back
              </Button>

              <Button
                className={`font-medium cursor-pointer ${
                  loading
                    ? "bg-muted text-muted-foreground"
                    : " hover:bg-gray-400 "
                }`}
                disabled={loading}
              >
                {loading ? "Loading..." : "Create Team"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
