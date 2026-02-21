"use client";

import { Editor } from "@/components/blocks/editor-00/editor";
import { SingleTeamPicker } from "@/components/single-team-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { iTeams } from "@/interfaces/teams.interface";
import { ProjectPicker } from "@/modules/issues/components/project-picker";
import { ProjectFormLabels } from "@/modules/projects/components/label-picker";
import { PriorityPicker } from "@/modules/projects/components/priority-picker";
import { SingleMemberPicker } from "@/modules/projects/components/single-member-picker";
import { Form, Formik } from "formik";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

export function TemplateForm() {
  const [templateName, setTemplateName] = useState("");
  const [showSubIssueForm, setShowSubIssueForm] = useState(true);

  const teams = useSelector((state: any) => state.teams);
  const workspaceMember = useSelector((state: any) => state.workspace);
  const members = Array.isArray(workspaceMember) ? workspaceMember : [];
  const projects = useSelector((state: any) => state.project.projects);
  const labels = useSelector((state: any) => state.issuesLabel);

  // States
  const [selectedTeams, setSelectedTeams] = useState<iTeams | null>();

  const navigate = useNavigate();
  const params = useParams();
  return (
    <div className="min-h-screen bg-background p-6 border rounded">
      <div className="max-w-4xl mx-auto pt-3 px-2">
        {/* <h1 className="text-2xl font-semibold text-foreground">
          {params?.id && params?.id !== "new" ? "Edit" : "New"} issue template
        </h1> */}

        <Formik initialValues={() => {}} onSubmit={() => {}}>
          {({ values, setFieldValue, errors, resetForm }) => (
            <Form>
              <div className="space-y-4">
                <div className="pt-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Input
                      placeholder="Template Name"
                      // value={values.name}
                      // onChange={(e) => setFieldValue("name", e.target.value)}
                      className={`sm:text-lg md:text-[35px] font-semibold border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent dark:placeholder:text-[#616265]`}
                    />
                  </div>
                  <Textarea
                    placeholder="Add description..."
                    className={`font-semibold border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent dark:placeholder:text-[#616265]`}
                  />
                </div>

                <Card className="rounded-sm dark:bg-[#17181b]">
                  <CardContent>
                    <div className="space-y-2 overflow-y-auto">
                      {/* Title Input */}
                      <Input
                        placeholder="New Issue"
                        // value={values.name}
                        // onChange={(e) => setFieldValue("name", e.target.value)}
                        className={`sm:text-lg md:text-[23px] font-semibold border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent dark:placeholder:text-[#616265]`}
                      />

                      {/* Description Editor */}

                      <Editor
                        className="`sm:text-lg md:text-[23px] font-semibold border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent dark:placeholder:text-[#616265]"
                        // editorHtmlState={values.description}
                        // onHtmlChange={(html) => setFieldValue("description", html)}
                      />

                      {/* Property Buttons */}
                      {/* <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-2 text-muted-foreground bg-transparent"
                  onClick={() => {
                  
                  }}
                >
                  <MoreHorizontal className="h-2 w-2" />
                  Priority
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-2 text-muted-foreground bg-transparent"
                  onClick={() => {
                 
                  }}
                >
                  <User className="h-2 w-2" />
                  Assignee
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-2 text-muted-foreground bg-transparent"
                  onClick={() => {
                   
                  }}
                >
                  <FolderOpen className="h-2 w-2" />
                  Project
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-2 text-muted-foreground bg-transparent"
                  onClick={() => {
                    setShowSubIssueForm(true);
                  }}
                >
                  <Copy className="h-2 w-2" />
                  Sub-issues
                </Button>
              </div> */}
                    </div>
                    {/* {showSubIssueForm && (
              <div className="border border-border rounded-lg py-4 bg-card mt-4">
                <div className="flex items-start gap-3 mb-4 border-b pb-4 px-4">
                  <h4 className="text-sm text-muted-foreground font-medium">
                    Create sub-issue
                  </h4>
                </div>
                <div className="flex items-start gap-3 mb-4 px-4">
                  <div className="w-4 h-4 flex items-center justify-center pt-5">
                    <div className="w-2 h-2 bg-yellow-500 rounded-sm rotate-45"></div>
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Issue title"
                      className="border-0 p-0 text-sm font-medium focus-visible:ring-0 mb-2 dark:bg-transparent"
                    />
                    <Textarea
                      placeholder="Add description..."
                      className="border-0 p-0 text-sm resize-none focus-visible:ring-0 min-h-[60px] dark:bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-3 px-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowSubIssueForm(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button size="sm">Add sub-issue</Button>
                  </div>
                </div>
              </div>
            )} */}
                  </CardContent>
                </Card>
                <div className="py-5 ">
                  <div className="font-semibold text-xl">
                    Default Properties
                  </div>
                  <div className="font-semibold text-md text-muted-foreground">
                    Automatically applied upon issue creation, and editable upon
                    using within Myra
                  </div>
                </div>

                <Card className="rounded-sm dark:bg-[#17181b] ">
                  <CardContent>
                    <div className="flex items-center gap-3 p-0">
                      {" "}
                      <SingleTeamPicker
                        teams={teams}
                        value={selectedTeams || null}
                        onChange={setSelectedTeams}
                      />
                      <PriorityPicker
                        isPriorityShow={true}
                        // value={values.priority_id}
                        // onChange={(priorityId) =>
                        // setFieldValue("priority_id", priorityId)
                        // }
                      />
                      <SingleMemberPicker
                        members={members}
                        // value={members.find(
                        //   (m: any) => m.id === values.assignee_id,
                        // )}
                        onChange={(member) =>
                          setFieldValue("assignee_id", member?.id)
                        }
                        buttonVarient="light"
                      />
                      <ProjectPicker
                        projects={projects}
                        // value={projects.find(
                        //   (p: any) => p.id === values.project_id,
                        // )}
                        onChange={(project) =>
                          setFieldValue("project_id", project?.id)
                        }
                      />
                      <ProjectFormLabels
                        labels={labels}
                        value={labels.filter(
                          (l: any) => console.log(),
                          // values.labels?.includes(l.id),
                        )}
                        onChange={(selectedLabels) =>
                          setFieldValue(
                            "labels",
                            selectedLabels.map((l) => l.id),
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6">
                  <Button
                    variant="outline"
                    className="bg-card border-border"
                    onClick={() => navigate("../")}
                  >
                    Cancel
                  </Button>
                  <Button variant="custom">
                    {params.id ? "Save" : "Create"}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
