import { formatDateToMonthDay } from "@/components/date-converter";
import { DateRangePickerDialog } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";
import type { iCycleListResponse } from "@/interfaces/cycle.interface";
import {
  cycleRangeUpdateUri,
  cycleUpdateUri,
  fetchCycleListUri,
} from "@/services/cycle.service";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Form, Formik } from "formik";
import {
  Bell,
  Calendar,
  CalendarPlus,
  CheckCircle,
  ChevronUpIcon,
  MoreHorizontal,
  Pencil,
  Play,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { LinearStyleChart } from "./chart";

const CyclesScreen = () => {
  const [data, setData] = useState<iCycleListResponse[]>();
  const { currentWorkspace } = useUser();
  const { "team-id": id } = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<iCycleListResponse | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchCycleListUri(
          currentWorkspace?.slug ?? "",
          Number(id)
        );
        setData(res.data);
        console.log("All cycle", res.data);
      } catch (e: any) {
        console.log(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, currentWorkspace?.slug]);

  const handleApply = async (endDate: string, cycleId: number) => {
    try {
      const body = {
        end_date: endDate,
      };
      await cycleRangeUpdateUri(
        currentWorkspace?.slug ?? "",
        Number(id),
        Number(cycleId),
        body
      );
      const res = await fetchCycleListUri(
        currentWorkspace?.slug ?? "",
        Number(id)
      );
      setData(res.data);

      toast.success("Cycle dates updated successfully");
      setDialogOpen(false);
      setSelectedCycle(null);
    } catch (e: any) {
      console.log(e.message);
      toast.error("Failed to update cycle dates");
    }
  };

  const initialValues = {
    name: "",
    description: "",
  };

  const handleUpdate = async (
    formValues: typeof initialValues,
    cycleId: number
  ) => {
    try {
      const body = {
        name: formValues.name,
        description: formValues.description,
      };

      await cycleUpdateUri(
        currentWorkspace?.slug ?? "",
        Number(id),
        cycleId,
        body
      );

      fetchCycleListUri(currentWorkspace?.slug ?? "", Number(id)).then(
        (res) => {
          setData(res.data);
          console.log("All cycle", res.data);
        }
      );
      toast.success("Cycle updated successfully");
    } catch (e) {
      toast.error((e as any)?.message || "Failed to update cycle");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/60 z-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  // Sort cycles: Upcoming -> Current -> Completed
  const sortedData = data?.slice().sort((a, b) => {
    const statusOrder: Record<string, number> = {
      upcoming: 1,
      current: 2,
      completed: 3,
      Completed: 3, // Handle both cases
    };

    const orderA = statusOrder[a.status?.toLowerCase()] || 999;
    const orderB = statusOrder[b.status?.toLowerCase()] || 999;

    return orderA - orderB;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-foreground text-sm">All Cycles</h1>
        </div>
      </header>
      {/* Timeline and Cycles List */}
      <div className="p-4">
        <div className="relative">
          <div className="absolute left-14 top-8 bottom-0 w-px bg-border" />
          <div className="space-y-8">
            {sortedData?.map((cycle) => (
              <div key={cycle?.id} className="relative">
                <div className="flex items-start gap-6">
                  {/* Timeline */}
                  <div className="flex flex-col items-center w-16 relative z-10">
                    {cycle?.start_date && (
                      <div className="text-sm text-muted-foreground mb-3 whitespace-nowrap font-medium">
                        {formatDateToMonthDay(cycle?.start_date.split(" ")[0])}
                        <div className="text-xs">
                          {formatDateToMonthDay(
                            cycle?.start_date.split(" ")[1] || ""
                          )}
                        </div>
                      </div>
                    )}
                    <div
                      className={`w-4 h-4 rounded-full border-2 bg-background relative z-10 ${
                        cycle?.status == "current"
                          ? "border-blue-500 bg-blue-500"
                          : cycle?.status === "Completed"
                          ? "border-gray-400 bg-gray-400"
                          : "border-border bg-background"
                      }`}
                    />
                  </div>

                  {/* Cycle Info */}
                  <div className="flex-1 flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      {cycle?.status == "current" ? (
                        <Play className="h-5 w-5 " />
                      ) : cycle?.status== "upcoming" ?
                      (
                         <ChevronUpIcon />
                      ) :
                      (
                        <CheckCircle />
                      )}
                      <Link to={"./" + cycle.id} className="font-medium">
                        {cycle?.name}
                      </Link>
                    </div>

                    <div className="flex items-center gap-8">
                      {/* <div className="text-sm text-muted-foreground">
                          {cycle?.status}
                        </div> */}

                      {cycle.status == "current" && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="text-sm">{cycle?.status}</span>
                        </div>
                      )}

                      <div
                        className={`text-sm 
                         
                             "text-red-500
                            text-muted-foreground"
                        }`}
                      >
                        0% of capacity{" "}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        1 Scope
                      </div>

                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-6 w-6 p-0 text-muted-foreground hover:bg-muted/20"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          className="w-64 bg-[#1e1e1e] border border-neutral-700 shadow-xl rounded-md"
                          align="end"
                        >
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedCycle(cycle);
                              setTimeout(() => setEditOpen(true), 100);
                            }}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-700 hover:text-white cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit cycle name and description
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedCycle(cycle);
                              setTimeout(() => setDialogOpen(true), 100);
                            }}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-700 hover:text-white cursor-pointer"
                          >
                            <Calendar className="h-4 w-4" />
                            Change cycle dates
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-neutral-700" />

                          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-700 hover:text-white cursor-pointer">
                            <Bell className="h-4 w-4" />
                            Subscribe to cycle notifications
                          </DropdownMenuItem>

                          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-700 hover:text-white cursor-pointer">
                            <Star className="h-4 w-4" />
                            Favorite
                            <span className="ml-auto text-xs text-neutral-400">
                              Alt + F
                            </span>
                          </DropdownMenuItem>

                          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-700 hover:text-white cursor-pointer">
                            <Link className="h-4 w-4" to={""} />
                            Copy link
                          </DropdownMenuItem>

                          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-700 hover:text-white cursor-pointer">
                            <CalendarPlus className="h-4 w-4" />
                            Subscribe to cycle calendar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC CHART */}
                {cycle?.status == "current" && (
                  <div className="ml-22 mt-6 mb-8">
                    <div className="flex gap-8">
                      {/* Chart Area */}
                      <div className="flex-1 max-w-5xl">
                        <LinearStyleChart chartData={cycle.chart} />
                      </div>

                      {/* Legend - Replace lines 241-276 with this */}
                      <div className="space-y-3 p-4  rounded-lg ">
                        {/* Header with capacity */}
                        {/* <div className="flex items-center gap-2 text-sm">
                          <div
                            className={`w-2 h-2 rounded-full 
                              bg-red-500"
                            }`}
                          />
                          <span
                            className="
                           
                              text-red-500 "
                          >
                            14400% of capacity
                          </span>
                          <span className="text-muted-foreground">
                            6 weekdays left
                          </span>
                        </div> */}

                        {/* Stats rows */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-gray-400" />
                              <span className="text-sm text-muted-foreground">
                                Scope
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">{cycle.scope}</span>
                              {/* <span className="text-green-500">-21%</span> */}
                            </div>
                          </div>

                          {/* Started */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500" />
                              <span className="text-sm text-muted-foreground">
                                Started
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">
                                {cycle.started}
                              </span>
                              {/* <span className="text-green-500">+82%</span> */}
                            </div>
                          </div>

                          {/* Completed */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="text-sm text-muted-foreground">
                                Completed
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">
                                {cycle.completed}
                              </span>
                              {/* <span className="text-gray-500">+1%</span> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Cycle Dialog - Outside of map */}
      {selectedCycle && (
        <Formik
          key={selectedCycle.id}
          initialValues={{
            name: selectedCycle.name || "",
            description: selectedCycle.description || "",
          }}
          onSubmit={(values) => {
            handleUpdate(values, selectedCycle.id);
            setEditOpen(false);
            setSelectedCycle(null);
          }}
        >
          {({ values, setFieldValue, handleSubmit }) => (
            <Dialog
              open={editOpen}
              onOpenChange={(open) => {
                setEditOpen(open);
                if (!open) {
                  setSelectedCycle(null);
                }
              }}
            >
              <DialogContent
                className="!max-w-4xl bg-neutral-900 border-neutral-800 text-neutral-300"
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <DialogHeader>
                  <DialogTitle className="">
                    <div className="p-1 border border-zinc-800 w-fit rounded ">
                      Edit cycle
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <Form onSubmit={handleSubmit}>
                  <div className="space-y-4 mt-2">
                    <Input
                      name="name"
                      placeholder="Cycle name"
                      value={values.name}
                      className="sm:text-lg md:text-2xl font-semibold border-0 px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
                      onChange={(e) => {
                        setFieldValue("name", e.target.value);
                      }}
                    />

                    <textarea
                      name="description"
                      placeholder="Add description..."
                      value={values.description}
                      className="w-full h-28  rounded-md p-3 text-neutral-200 resize-none focus:outline-none"
                      onChange={(e) => {
                        setFieldValue("description", e.target.value);
                      }}
                    />
                  </div>

                  <hr className="pb-2 " />

                  <div className="flex justify-end gap-3 ">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setEditOpen(false);
                        setSelectedCycle(null);
                      }}
                      className="text-neutral-500 hover:text-white bg-neutral-800"
                    >
                      Cancel
                    </Button>

                    <Button type="submit" variant="default">
                      Save
                    </Button>
                  </div>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </Formik>
      )}

      {/* Date Range Picker Dialog - Outside of map */}
      {selectedCycle && (
        <DateRangePickerDialog
          start_date={selectedCycle.start_date}
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setSelectedCycle(null);
          }}
          onApply={handleApply}
          end_date={selectedCycle.end_date}
          cycleId={selectedCycle.id}
        />
      )}
    </div>
  );
};

export default CyclesScreen;
