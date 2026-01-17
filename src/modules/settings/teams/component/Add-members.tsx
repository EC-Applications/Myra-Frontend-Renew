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
import type { iResponse } from "@/interfaces/common.interface";
import { inviteMemberInTeamUri } from "@/services/team.service";
import { workspaceInvite } from "@/services/workspace.service";
import { useFormik } from "formik";
import { Plus } from "lucide-react";
import { useState, type FC } from "react";
import { toast } from "sonner";
import * as yup from "yup";


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

const Invite: FC<{ refresh: () => void }> = ({ refresh }) => {
    const { currentWorkspace } = useUser();
    const [open, setOpen] = useState(false); 
    const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

    const formik = useFormik({
        initialValues: {
            emails: "",
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsSubmitting(true);
            let emails = values.emails.split(",").map((email) => email.trim());
            emails = [...new Set(emails)];
            Promise.all(
                emails.map((e) =>
                    inviteMemberInTeamUri(currentWorkspace!.slug, currentWorkspace!.id, {
                        email: e,
                    })
                )
            )
                .then(
                    (res) => {
                        toast.success(res[0]?.message);
                        refresh();
                    },
                    (er: iResponse<null>) => {
                        toast.warning(er.message);
                    }
                )
                .finally(() => {
                    resetForm();
                    setOpen(false);
                    setIsSubmitting(false);
                });
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm">
                    <Plus /> Invite
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-lg"
                aria-describedby="Invite to your workspace"
            >
                <form onSubmit={formik.handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Invite to your workspace</DialogTitle>
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
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Invites"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
export default Invite;
