type Props = {
  value: number // 0–100
}

export const ProgressLine = ({ value }: Props) => {
  return (
    <div className="w-full px-3">
      <div className="h-1 w-full rounded bg-muted">
        <div
          className="h-1 rounded bg-blue-500 transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

