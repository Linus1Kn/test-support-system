import { Suspense } from "react";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { connection } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import LoadingPage from "@/components/loading-page";

export default function Home() {
  return (
    <Suspense fallback={<LoadingPage/>}>
      <UserList />
    </Suspense>
  );
}
async function UserList() {
  await connection()
  const allUsers = await db.select().from(users);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <div className="mb-10 flex flex-col items-center">
        <h1 className="text-3xl font-medium">IT Support System</h1>
        <p>Internal system for opening & closing support tickets</p>
      </div>

      <div className="gap-2 grid grid-cols-3">
        {allUsers.map((user) => (
          <Card key={user.id}>
            <CardContent>
              <CardTitle>
                {user.name}
              </CardTitle>
              <CardDescription>
                {user.email}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </div>
  );
}
