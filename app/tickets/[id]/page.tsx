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
import {
  Field,
  FieldSet,
  FieldLegend,
  FieldLabel,
  FieldGroup,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import { db } from "@/db"
import { tickets, comments } from "@/db/schema"
import { eq } from "drizzle-orm"
import SkeletonPage from "@/components/skeletonpage";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  params: Promise<{ id: string }>
}

export default async function TicketPage({ params }: Props) {
  return (
    <Suspense fallback={<SkeletonPage />}>
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

  const ticketComments = await db.query.comments.findMany({
    where: eq(comments.ticketId, Number(id)),
    orderBy: (comments, { desc }) => [desc(comments.createdAt)],
  });

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
    if (!ticket) { return }

    const status = form.get("status")
    if (!status) { return }

    await db
      .update(tickets)
      .set({ status: status })
      .where(eq(tickets.id, ticket.id));

    revalidatePath("/tickets");
    revalidatePath(`/tickets/${ticket.id}`);
  }

  async function sendcomentt(form: FormData) {
    "use server"
    if (!ticket) { return }

    const content = form.get("content")

    if (typeof content !== "string" || !content.trim()) {
      return
    }

    await db.insert(comments).values({
      content: content.trim(),
      ticketId: ticket.id,
    })

    revalidatePath(`/tickets/${ticket.id}`)
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
            {ticket.createdAt.toLocaleDateString()}
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

      <CardHeader>
        <CardTitle>
          Comments ({ticketComments.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-1">
        <form action={sendcomentt} className="flex gap-1">
          <FieldSet className="w-full">
            <FieldGroup className="flex-1">
              <Field>
                <Textarea
                  id="content"
                  name="content"
                  autoComplete="off"
                  placeholder="Enter a comment..."
                  required
                  maxLength={5000}
                />
              </Field>
            </FieldGroup>

            <Button variant="default" size="lg" type="submit">
              Send
            </Button>
          </FieldSet>
        </form>

        {ticketComments.length === 0 ? (
          <CardDescription>
            No comments.
          </CardDescription>
        ) : (
          <>
            {ticketComments.map((comment) => (
              <Card key={comment.id}>
                <CardContent>
                  <CardDescription>
                    {comment.content}
                  </CardDescription>
                  <CardDescription>
                    {comment.createdAt.toLocaleDateString()}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </CardContent>
    </div>
  )
}
