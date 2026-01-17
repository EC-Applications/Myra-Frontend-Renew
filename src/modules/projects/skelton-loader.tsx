const ProjectSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      
      {/* Title */}
      <div className="h-6 w-1/3 rounded bg-muted" />

      {/* Description */}
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-4/5 rounded bg-muted" />
      </div>

      {/* Status / Priority Row */}
      <div className="flex gap-3 mt-4">
        <div className="h-8 w-32 rounded bg-muted" />
        <div className="h-8 w-32 rounded bg-muted" />
      </div>

      {/* Meta Info */}
      <div className="flex gap-4 mt-4">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
};

export default ProjectSkeleton;
