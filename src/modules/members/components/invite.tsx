import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/use-user";
import { inviteMemberInTeamUri } from "@/services/team.service";
import { workspaceInvite } from "@/services/workspace.service";
import { useFormik } from "formik";
import { Plus } from "lucide-react";
import { useState, type FC } from "react";
import { toast } from "sonner";
import * as yup from "yup";

interface InviteProps {
  refresh: () => void;
  teamId?: number;
  teamName?: string;
}
// Validation schema for multiple comma-separated emails
const validationSchema = yup.object({
  emails: yup
    .string()
    .required("At least one email is required")
    .test("valid-emails", function (value) {
      if (!value) return false;
      const emails = value.split(",").map((email) => email.trim());
      const invalidEmails = emails.filter(
        (email) => !yup.string().email().isValidSync(email)
      );
      if (invalidEmails.length > 0) {
        return this.createError({
          message: invalidEmails
            .map((email) => `"${email}" is not a valid email`)
            .join(", "),
        });
      }
      return true;
    }),
});

const Invite: FC<InviteProps> = ({ refresh, teamId, teamName }) => {
  const { currentWorkspace } = useUser();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("team name", teamName)
  console.log("team id", teamId)

  const formik = useFormik({
    initialValues: {
      emails: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      let emails = values.emails.split(",").map((email) => email.trim());
      emails = [...new Set(emails)];

      try {
        if (teamId) {
          // Team invite - multiple calls (assuming team API still expects single email)
          const invitePromises = emails.map((e) =>
            inviteMemberInTeamUri(teamName || '', teamId, {
              email: e,
            })
          );
          const res = await Promise.all(invitePromises);
          toast.success(res[0]?.message);
        } else {
          // Workspace invite - single call with array
          const res = await workspaceInvite(currentWorkspace!.slug, currentWorkspace!.id, {
            emails,
            role: "member",
          });
          toast.success(res.message);
        }
        refresh();
      } catch (er: any) {
        toast.warning(er.message || "Failed to send invites");
      } finally {
        resetForm();
        setOpen(false);
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          formik.resetForm(); // Reset form when dialog closes
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="cursor-pointer">
          <Plus /> Invite
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-lg"
        aria-describedby={`Invite to ${teamId ? `team ${teamName || ''}` : 'workspace'}`}
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {teamId
                ? `Invite to ${teamName || 'team'}`
                : "Invite to your workspace"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="emails">Email</Label>
              <Input
                type="email"
                id="emails"
                {...formik.getFieldProps("emails")}
                placeholder="email@example.com"
              />
              {formik.touched.emails && formik.errors.emails ? (
                <span className="text-red-500 text-sm">
                  {formik.errors.emails}
                </span>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <Button className="cursor-pointer hover:bg-gray-600" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Invites"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Invite;