import { Suspense } from "react";
import TicketForm from "@/components/ticketform";
import { db } from "@/db"
import { users, categories, tickets } from "@/db/schema";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/loading-page";

export default async function NewTicket() {
  return (
    <Suspense fallback={<LoadingPage/>}>
      <NewTicketForm />
    </Suspense>
  );
}
async function NewTicketForm() {
  const allUsers = await db.select().from(users);
  const allCategories = await db.select().from(categories);

  const categoryItems = allCategories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));
  const usersItems = allUsers.map((user) => ({
    label: user.name,
    value: user.id,
  }));

  async function createTicket(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const user = formData.get("user");
    const category = formData.get("category");

    if (!title || !description || !user || !category) {
      return
    }

    await db.insert(tickets).values({
      id: Math.floor(Math.random()*10000),
      title: title,
      description: description,
      categoryId: Number(category),
      userId: Number(user),
    });

    redirect("/tickets");
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">

      <TicketForm
        createTicket={createTicket}
        categoryItems={categoryItems}
        usersItems={usersItems}
      />
      
    </div>
  )
}
