import { CardDescription } from "./ui/card"

type Props = {
  status: "open" | "in-progress" | "resolved" | null
}

const statusColors = {
  open: "bg-green-400",
  "in-progress": "bg-amber-300",
  resolved: "bg-gray-400",
}

export default function StatusLabel({ status }: Props) {
  return (
    <CardDescription className={`capitalize flex items-center justify-center rounded-sm font-semibold px-2 text-white ${statusColors[status ?? "open"]}`}>
      {status}
    </CardDescription>
  )
}
