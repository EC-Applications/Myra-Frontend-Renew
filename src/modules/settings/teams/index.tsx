"use client";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { IconPicker } from "@/modules/projects/components/icon-picker";
import { removeTeamUri } from "@/services/team.service";
import { removeTeam } from "@/store/slices/team.slice";
import {
  Clock,
  Earth,
  FileText,
  Hash,
  Info,
  MoveRight,
  RotateCcw,
  Settings,
  Tag,
  Target,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function Teams() {
  const teamsData = useSelector((state: any) => state.teams) || [];
  const { currentWorkspace } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [teamName, setTeamName] = useState("");
  const [teamIdentifier, setTeamIdentifier] = useState("");
  const team = teamsData.find((t: any) => t.id == id);
  console.log("Team Data", teamsData);
  console.log("filtered team", team);

  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleTeamDelete = async () => {
    if (confirmText !== team.name) return;

    toast.loading("Deleting team...", { id: "delete-team" });

    try {
      const res = await removeTeamUri(currentWorkspace!.name, team.id);

      // Dispatch Redux update AFTER API confirms deletion
      dispatch(removeTeam(team.id));

      toast.success(res.message, { id: "delete-team" });

      navigate("/settings/administration/teams");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete team", {
        id: "delete-team",
      });
    }
  };

  // useState(() => {}, [

  // ]);

  return (
    <div className="min-h-screen text-foreground p-8">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold mb-2">{team.name}</h1>
        </div>

        {/* Icon & Name Section */}
        <div className="bg-card border rounded-lg p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Icon & Name
              </label>
              <div className="flex items-center gap-3">
                <IconPicker
                  value={team.icon}
                  variant="inline"
                  size={25}
                  className="mb-1"
                />

                {/* <div className="w-10 h-10 px-2 bg-pink-500 rounded-full flex items-center justify-center text-foreground font-medium">
                  <Earth className="w-6 h-6" />
                </div> */}
                <Input
                  value={team.name}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Identifier{" "}
                <span className="text-muted-foreground">
                  - Used in issue IDs
                </span>
              </label>
              <Input
                value={team.identifier}
                onChange={(e) => setTeamIdentifier(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Configuration Sections */}
        <div className="bg-card border rounded-lg divide-y divide-card-foreground/30">
          {/* General */}
          <Link
            to={"./general"}
            className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">General</div>
                <div className="text-sm text-muted-foreground">
                  Timezone, estimates, and broader settings
                </div>
              </div>
            </div>
            <div className="text-muted-foreground">
              <MoveRight className="size-4" />
            </div>
          </Link>

          {/* Members */}
          <Link
            to={"./members"}
            className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Members</div>
                <div className="text-sm text-muted-foreground">
                  Manage team members
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {team?.members?.length ?? 0} member
                {team?.members?.length === 1 ? "" : "s"}
              </span>

              <div className="text-muted-foreground">
                <MoveRight className="size-4" />
              </div>
            </div>
          </Link>

          {/* Issue labels */}
          <Link
            to={"./issue-labels"}
            className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Issue labels</div>
                <div className="text-sm text-muted-foreground">
                  Labels available to this team's issues
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">None</span>
              <div className="text-muted-foreground">
                <MoveRight className="size-4" />
              </div>
            </div>
          </Link>

          {/* Templates */}
          <Link
            to="./templates"
            className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Templates</div>
                <div className="text-sm text-muted-foreground">
                  Pre-filled templates for issues, documents, and projects
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">None</span>
              <div className="text-muted-foreground">
                <MoveRight className="size-4" />
              </div>
            </div>
          </Link>

          {/* Recurring issues */}
          <Link
            to="./recurring-issues"
            className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Recurring issues</div>
                <div className="text-sm text-muted-foreground">
                  Automatically create issues on a schedule
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">None</span>
              <div className="text-muted-foreground">
                <MoveRight className="size-4" />
              </div>
            </div>
          </Link>

          {/* Slack notifications */}
          <Link
            to={"./slack-notifications"}
            className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Slack notifications</div>
                <div className="text-sm text-muted-foreground">
                  Broadcast notifications to Slack
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Off</span>
              <div className="text-muted-foreground">
                <MoveRight className="size-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* Workflow Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Workflow</h2>
          <div className="bg-card border rounded-lg divide-y divide-card-foreground/30">
            {/* Issue statuses & automations */}
            <Link
              to="./workflow"
              className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    Issue statuses & automations
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Customize issue statuses and git automations
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  6 statuses
                </span>
                <div className="text-muted-foreground">
                  <MoveRight className="size-4" />
                </div>
              </div>
            </Link>

            {/* Triage */}
            <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Triage</div>
                  <div className="text-sm text-muted-foreground">
                    Streamline how you handle requests from outside your team
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Off</span>
                <div className="text-muted-foreground">
                  <MoveRight className="size-4" />
                </div>
              </div>
            </div>

            {/* Cycles */}
            <Link
              to="./cycles"
              className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Cycles</div>
                  <div className="text-sm text-muted-foreground">
                    Focus your team over short, time-boxed windows
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* <span className="text-sm text-muted-foreground">Off</span> */}
                <div className="text-muted-foreground">
                  <MoveRight className="size-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Team hierarchy */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Team hierarchy</h2>
          <p className="text-muted-foreground mb-4">
            Teams can be nested to reflect your team structure and to share
            workflows and settings.{" "}
            <a href="#" className="text-foreground underline">
              Docs
            </a>
          </p>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">No parent team</span>
              <span className="text-sm text-gray-500">
                Available on Business
              </span>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Danger zone</h2>
          <div className="bg-card border rounded-lg divide-y divide-card-foreground/30">
            {/* Change team visibility */}
            <div className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">Change team visibility</div>
              </div>
              <span className="text-sm text-gray-500">
                Available on Business
              </span>
            </div>

            {/* Delete team */}
            <div className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">Delete team</div>
              </div>

              <button
                className="rounded p-2 hover:bg-gray-600 transition cursor-pointer  text-sm"
                onClick={() => setIsOpen(true)}
              >
                Delete
              </button>

              {/* Modal Overlay */}
              {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  {/* Modal Content */}
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] p-8 relative">
                    {/* Close Button */}
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setConfirmText("");
                      }}
                      className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Title */}
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                      Delete the {team.name} team?
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      This team will be permanently deleted. For the next 30
                      days you'll be able to restore it from{" "}
                      <span className="font-medium">Settings › Teams</span>.
                    </p>

                    {/* Confirmation Input */}
                    <div className="mb-8">
                      <p className="text-gray-700 mb-3">
                        To confirm, type{" "}
                        <span className="font-semibold">{team.name}</span>{" "}
                        below:
                      </p>
                      <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-black"
                        placeholder=""
                        autoFocus
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setConfirmText("");
                        }}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium cursor-pointer "
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleTeamDelete}
                        disabled={confirmText !== team.name}
                        className={`px-6 py-2.5 rounded-lg font-medium transition ${
                          confirmText == team.name
                            ? "bg-red-500  hover:bg-red-600 cursor-pointer"
                            : "bg-red-300  cursor-not-allowed"
                        }`}
                      >
                        Delete team
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
