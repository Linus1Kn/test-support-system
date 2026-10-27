import { Suspense } from "react";
import { Card, CardTitle, CardHeader, CardDescription, CardContent, CardAction, CardFooter } from "@/components/ui/card";
import { db } from "@/db";
import { tickets } from "@/db/schema";
import SkeletonPage from "@/components/skeletonpage";

export default function Tickets() {
  return (
    <Suspense fallback={<SkeletonPage/>}>
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

  const statusColors = {
    open: "bg-green-400",
    "in-progress": "bg-amber-300",
    resolved: "bg-gray-400",
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <div className="mb-4 flex flex-col items-center">
        <h1 className="text-3xl font-medium">Tickets</h1>
      </div>

      <div className="gap-2 flex flex-col w-120">
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
              <CardDescription className={`capitalize rounded-sm font-semibold px-2 text-white ${statusColors[ticket.status ?? "open"]}`}>
                {ticket.status}
              </CardDescription>
              <CardDescription>
                {ticket.createdAt.getDay()}-{ticket.createdAt.getMonth()}-{ticket.createdAt.getFullYear()}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </div>
  );
}
