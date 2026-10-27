import { Suspense } from "react";
import { notFound } from "next/navigation"
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { db } from "@/db"
import { tickets } from "@/db/schema"
import { eq } from "drizzle-orm"
import SkeletonPage from "@/components/skeletonpage";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

type Props = {
  params: Promise<{ id: string }>
}

export default async function TicketPage({ params }: Props) {
  return (
    <Suspense fallback={<SkeletonPage/>}>
      <Ticket params={params} />
    </Suspense>
  );
}
async function Ticket({ params }: Props) {
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

  const statusItems = [
    {
      label: "Open",
      value: "open",
    },
    {
      label: "In-Progress",
      value: "in-progress",
    },
    {
      label: "Resolved",
      value: "resolved",
    },
  ]

  async function changeroo(form: any) {
    "use server"
    if (!ticket) {return}

    const status = form.get("status")
    if (!status) {return}

    await db
      .update(tickets)
      .set({ status: status })
      .where(eq(tickets.id, ticket.id));

    revalidatePath("/tickets");
    revalidatePath(`/tickets/${ticket.id}`);
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
            <CardDescription>
              {ticket.description}
            </CardDescription>
          </CardContent>

          <CardContent className="flex gap-2">
            <CardDescription className={`capitalize rounded-sm font-semibold px-2 text-white ${statusColors[ticket.status ?? "open"]}`}>
              {ticket.status}
            </CardDescription>

            <form action={changeroo} className="flex gap-1">
              <Select
                name="status"
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {statusItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button type="submit">Save</Button>
            </form>

          </CardContent>
      </Card>
    </div>
  )
}
