import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useCycleHook } from "@/hooks/use-cycle-config";
import { useUser } from "@/hooks/use-user";
import type {
  CycleConfigResponse,
  iCycleResponse,
} from "@/interfaces/cycle.interface";
import {
  cycleConfigUri,
  cycleSaveUri,
  fetchCycleUri,
  type iCycleSave,
} from "@/services/cycle.service";
import { addDays, format } from "date-fns";
import { Formik, Form } from "formik";
import { values } from "lodash";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

const Cycles = () => {
  const { currentWorkspace } = useUser();
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 0, 12));
  const [data, setData] = useState<CycleConfigResponse>();
  const [initData, setInitData] = useState<iCycleResponse>();
  const [loading, setLoading] = useState(false);

  const calculateEnabledDays = () => {
    if (!initData?.cycle_period_id || !initData?.cycle_upcoming_id) {
      return 0;
    }
    const step1 = initData.cycle_period_id * 7;
    const totalDays = step1 * initData.cycle_upcoming_id;
    return totalDays;
  };

  useEffect(() => {
    const loadApis = async () => {
      setLoading(true);
      try {
        const res1 = await fetchCycleUri(
          currentWorkspace?.slug ?? "",
          Number(id)
        );
        setInitData(res1.data);

        const res2 = await cycleConfigUri(
          currentWorkspace?.slug ?? "",
          Number(id)
        );
        setData(res2.data);
      } catch (e: any) {
        console.log(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadApis();
  }, [id, currentWorkspace?.slug]);

  const initialValues = {
    cycle_enable: false,
    cycle_last: "",
    cooldown: "",
    cycle_starts: "",
    upcomming_cycle: "",
    active_issue: false,
    started_issue: false,
    completed_issue: false,
  };

  const handleCycleSave = async (
    cycleEnabled: boolean,
    formValues: typeof initialValues
  ) => {
    try {
      const body: iCycleSave = {
        enable_cycle: cycleEnabled,
      };

      await cycleSaveUri(currentWorkspace?.slug ?? "", Number(id), body);

      setInitData((prev) =>
        prev ? { ...prev, enable_cycle: cycleEnabled } : prev
      );
      toast.success("Cycle configuration saved successfully!");
    } catch (error) {
      console.error("Error saving cycle config:", error);
      toast.error("Failed to save cycle configuration");
    }
  };

  const handlePeriodSave = async (periodId: number) => {
    try {
      const body: iCycleSave = {
        cycle_period_id: periodId,
      };

      await cycleSaveUri(currentWorkspace?.slug ?? "", Number(id), body);
      console.log("PERIOD BODY", body);

      fetchCycleUri(currentWorkspace?.slug ?? "", Number(id)).then((res) => {
        setInitData(res.data);
        console.log("CYCLE DATA", res.data);
      });
      toast.success("Cycle configuration saved successfully!");
    } catch (error) {
      console.error("Error saving cycle config:", error);
      toast.error("Failed to save cycle configuration");
    }
  };

  const handleCoolDownSave = async (cooldownId: number) => {
    try {
      const body: iCycleSave = {
        cycle_cooldown_id: cooldownId,
      };
      await cycleSaveUri(currentWorkspace?.slug ?? "", Number(id), body);
      console.log("COOLDOWN BODY", body);
      fetchCycleUri(currentWorkspace?.slug ?? "", Number(id)).then((res) => {
        setInitData(res.data);
        console.log("CYCLE DATA", res.data);
      });
      toast.success("Cycle configuration saved successfully!");
    } catch (error) {
      console.error("Error saving cycle config:", error);
      toast.error("Failed to save cycle configuration");
    }
  };

  const handleUpcommingSave = async (upcomingId: number) => {
    try {
      const body: iCycleSave = {
        cycle_upcoming_id: upcomingId,
      };
      await cycleSaveUri(currentWorkspace?.slug ?? "", Number(id), body);
      console.log("UPCOMMING BODY", body);

      fetchCycleUri(currentWorkspace?.slug ?? "", Number(id)).then((res) => {
        setInitData(res.data);
        console.log("CYCLE DATA", res.data);
      });

      toast.success("Cycle configuration saved successfully!");
    } catch (error) {
      console.error("Error saving cycle config:", error);
      toast.error("Failed to save cycle configuration");
    }
  };

  const handleStartOnSave = async (date: Date) => {
    try {
      // Format date as YYYY-MM-DD
      const formattedDate = format(date, "yyyy-MM-dd");
      const body: iCycleSave = {
        cycle_start_on: formattedDate,
      };
      await cycleSaveUri(currentWorkspace?.slug ?? "", Number(id), body);

      fetchCycleUri(currentWorkspace?.slug ?? "", Number(id)).then((res) => {
        setInitData(res.data);
        console.log("CYCLE DATA", res.data);
      });
      toast.success("Cycle configuration saved successfully!");
    } catch (error) {
      console.error("Error saving cycle config:", error);
      toast.error("Failed to save cycle configuration");
    }
  };

  const handleActiveIssuesSave = async (checked: boolean) => {
    try {
      const body: iCycleSave = {
        active_issues: checked,
      };
      await cycleSaveUri(currentWorkspace?.slug ?? "", Number(id), body);

      setInitData((prev) =>
        prev ? { ...prev, active_issues: checked } : prev
      );
      toast.success("Cycle configuration saved successfully!");
    } catch (error) {
      console.error("Error saving cycle config:", error);
      toast.error("Failed to save cycle configuration");
    }
  };

  const handleStartedIssuesSave = async (checked: boolean) => {
    try {
      const body: iCycleSave = {
        started_issues: checked,
      };
      await cycleSaveUri(currentWorkspace?.slug ?? "", Number(id), body);
      setInitData((prev) =>
        prev ? { ...prev, started_issues: checked } : prev
      );
      toast.success("Cycle configuration saved successfully!");
    } catch (error) {
      console.error("Error saving cycle config:", error);
      toast.error("Failed to save cycle configuration");
    }
  };

  const handleCompletedIssuesSave = async (checked: boolean) => {
    try {
      const body: iCycleSave = {
        completed_issues: checked,
      };
      await cycleSaveUri(currentWorkspace?.slug ?? "", Number(id), body);
      setInitData((prev) =>
        prev ? { ...prev, completed_issues: checked } : prev
      );
      toast.success("Cycle configuration saved successfully!");
    } catch (error) {
      console.error("Error saving cycle config:", error);
      toast.error("Failed to save cycle configuration");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/60 z-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log(" all values", values);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Cycles</h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                Cycles help create rhythm and focus for your team over short,
                time-boxed windows. Automations handle creating upcoming cycles,
                rolling over unfinished work, and optionally moving issues in
                and out of cycles based on status changes.{" "}
                <a
                  href="#"
                  className="text-blue-500 hover:text-blue-600 underline"
                >
                  Docs
                </a>
              </p>
            </div>

            {/* Enable Cycles */}
            <div className="border border-border rounded-lg bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">
                    Enable cycles
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    For more meaningful cycle velocity metrics, enable estimates
                    in <span className="font-medium">team settings</span>
                  </p>
                </div>
                <Switch
                  checked={initData?.enable_cycle}
                  onCheckedChange={(checked) => {
                    setFieldValue("cycle_enable", checked);
                    handleCycleSave(checked, values);
                  }}
                />
              </div>
            </div>
            {initData?.enable_cycle ? (
              <div className="border border-border rounded-lg bg-card p-6 space-y-6 transition ">
                {/* Each cycle lasts */}
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-foreground">
                    Each cycle lasts
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-40 justify-between bg-transparent"
                      >
                        {initData.cycle_period_label}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {data?.cycle_periods?.map((period) => (
                        <DropdownMenuItem
                          key={period.id}
                          onClick={() => {
                            setFieldValue("cycle_last", period.id);
                            handlePeriodSave(period.id);
                          }}
                        >
                          {period.period}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="border-t border-border" />

                {/* Cooldown after each cycle */}
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-foreground">
                    Cooldown after each cycle
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-40 justify-between bg-transparent"
                      >
                        {initData.cycle_cooldown_label}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {data?.cycle_cooldowns?.map((cooldownPeriod) => (
                        <DropdownMenuItem
                          key={cooldownPeriod.id}
                          onClick={() => {
                            setFieldValue("cooldown", cooldownPeriod.id);
                            handleCoolDownSave(cooldownPeriod.id);
                          }}
                        >
                          {cooldownPeriod.period}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="border-t border-border" />

                {/* Cycles start on */}
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-foreground">
                    Cycles start on
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-40 justify-between bg-transparent"
                      >
                        {format(initData.cycle_start_on, "EEEE (MMM dd)")}
                        <CalendarIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date) {
                            setSelectedDate(date);
                            setFieldValue("cycle_starts", date.toString());
                            handleStartOnSave(date);
                          }
                        }}
                        disabled={(date) => {
                          const today = new Date();
                          const enabledDays = calculateEnabledDays();
                          const maxDate = addDays(today, enabledDays);

                          // Disable dates before today or after calculated max date
                          return date < today || date > maxDate;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="border-t border-border" />

                {/* Number of upcoming cycles */}
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-foreground">
                    Number of upcoming cycles to create
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-40 justify-between bg-transparent"
                      >
                        {initData.cycle_upcoming_label}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {data?.cycle_upcomings?.map((upcoming) => (
                        <DropdownMenuItem
                          key={upcoming.id}
                          onClick={() => {
                            setFieldValue("upcomming_cycle", upcoming.id);
                            handleUpcommingSave(upcoming.id);
                          }}
                        >
                          {upcoming.period}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <div className=""></div>
            )}

            {/* Auto-add issues */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Auto-add issues to current cycle
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Capture all work in cycles by auto-adding issues to cycles
                  based on their status type
                </p>
              </div>

              {/* Active Issues */}
              <div className="border border-border rounded-lg bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">
                      Active issues
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Auto-add active (unstarted or started) issues to the
                      current cycle, or the next if in a cooldown
                    </p>
                  </div>
                  <Switch
                    checked={initData?.active_issues}
                    onCheckedChange={(checked) => {
                      setFieldValue("active_issue", checked);
                      handleActiveIssuesSave(checked);
                    }}
                  />
                </div>
              </div>

              {/* Started Issues */}
              <div className="border border-border rounded-lg bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">
                      Started issues
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Auto-add started issues to the current cycle, or the next
                      if in a cooldown
                    </p>
                  </div>
                  <Switch
                    checked={initData?.started_issues}
                    onCheckedChange={(checked) => {
                      setFieldValue("started_issue", checked);
                      handleStartedIssuesSave(checked);
                    }}
                  />
                </div>
              </div>

              {/* Completed Issues */}
              <div className="border border-border rounded-lg bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">
                      Completed issues
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Auto-add completed issues to the current cycle, or the
                      next if in a cooldown
                    </p>
                  </div>
                  <Switch
                    checked={initData?.completed_issues}
                    onCheckedChange={(checked) => {
                      setFieldValue("completed_issue", checked);
                      handleCompletedIssuesSave(checked);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Cycles;
