import { Suspense } from "react";
import { Card, CardTitle, CardHeader, CardDescription, CardContent, CardAction, CardFooter } from "@/components/ui/card";
import { db } from "@/db";
import { tickets } from "@/db/schema";
import StatusLabel from "@/components/status-label";
import LoadingPage from "@/components/loading-page";

export default function Tickets() {
  return (
    <Suspense fallback={<LoadingPage/>}>
      <TicketsList />
    </Suspense>
  );
}
async function TicketsList() {
  const allTickets = await db.query.tickets.findMany({
    with: {
      user: true,
      categories: true,
    }
  })

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <div className="mb-4 flex flex-col items-center">
        <h1 className="text-3xl font-medium">Tickets</h1>
      </div>

      <div className="gap-2 flex flex-col w-2xl">
        {allTickets.map((ticket) => (
          <Card key={ticket.id}>
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
                <a href={`tickets/${ticket.id}`} className="hover:underline cursor-pointer">{ticket.title}</a>
              </CardTitle>
              <CardDescription className="truncate">
                {ticket.description}
              </CardDescription>
            </CardContent>

            <CardContent className="flex justify-between">
              <StatusLabel status={ticket.status} />
              <CardDescription>
                {ticket.createdAt.toLocaleDateString()}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </div>
  );
}
