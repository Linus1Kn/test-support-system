import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardDescription, CardContent, CardAction, CardFooter } from "@/components/ui/card";
import { db } from "@/db";
import { users } from "@/db/schema";

export default async function Home() {
  const allUsers = await db.select().from(users);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <div className="mb-10 flex flex-col items-center">
        <h1 className="text-3xl font-medium">IT Support System</h1>
        <p>Internal system for opening & closing support tickets</p>
      </div>

      <div className="gap-2 grid grid-cols-2">
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
