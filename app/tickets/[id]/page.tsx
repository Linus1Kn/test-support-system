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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import StatusLabel from "@/components/status-label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db"
import { tickets, comments } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache";
import LoadingPage from "@/components/loading-page";

type Props = {
  params: Promise<{ id: string }>
}

export default async function TicketPage({ params }: Props) {
  return (
    <Suspense fallback={<LoadingPage />}>
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

  async function UpdateStatus(form: any) {
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

  async function SendComment(form: FormData) {
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
    <div className="container mx-auto max-w-2xl p-6 flex flex-col gap-2">
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
          <p>
            {ticket.description}
          </p>
        </CardContent>

        <CardContent className="flex gap-2">
          <StatusLabel status={ticket.status} />

          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline">Edit status</Button>} />
            <AlertDialogContent>
              <form action={UpdateStatus} className="flex flex-col gap-4">
                <AlertDialogHeader>
                  <AlertDialogTitle>Update ticket status.</AlertDialogTitle>
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
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction type="submit">Save</AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>

        </CardContent>
      </Card>

      <CardHeader>
        <CardTitle>
          Comments ({ticketComments.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-1">
        <form action={SendComment} className="flex gap-1 mb-2">
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
                  <p>
                    {comment.content}
                  </p>
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
