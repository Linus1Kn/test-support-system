
import { notFound } from "next/navigation"
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { db } from "@/db"
import { tickets } from "@/db/schema"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{ id: string }>
}

export default async function TicketPage({ params }: Props) {
  const { id } = await params

  const ticket = await db.query.tickets.findFirst({
    where: eq(tickets.id, id),
    with: {
      user: true,
      categories: true,
    },
  })

  if (!ticket) {
    notFound()
  }

  const statusColors = {
    open: "bg-green-400",
    "in-progress": "bg-amber-300",
    resolved: "bg-gray-400",
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
          <CardHeader className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="h-8 w-8 bg-gray-100 rounded-full"></div>
              <CardTitle>
                {ticket.user.name}
              </CardTitle>
            </div>
            <CardTitle>
              {ticket.categories.name}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <CardTitle>
              {ticket.title}
            </CardTitle>
            <CardDescription>
              {ticket.createdAt.getDay()}-{ticket.createdAt.getMonth()}-{ticket.createdAt.getFullYear()}
            </CardDescription>
          </CardContent>

          <CardContent>
            <CardDescription className="truncate">
              {ticket.description}
            </CardDescription>
          </CardContent>

          <CardContent className="flex justify-between">
            <CardDescription className={`capitalize rounded-sm font-semibold px-2 text-white ${statusColors[ticket.status ?? "open"]}`}>
              {ticket.status}
            </CardDescription>
          </CardContent>
      </Card>
    </div>
  )
}
