import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardDescription, CardContent, CardAction, CardFooter } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <div className="mb-10 flex flex-col items-center">
        <h1 className="text-3xl font-medium">IT Support System</h1>
        <p>Internal system for opening & closing support tickets</p>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Hello World!</CardTitle>
          <CardDescription>This is a test card</CardDescription>
        </CardHeader>

        <CardContent>
          <CardAction>
            <Button variant="default" size="lg">Get Started</Button>
            <Button variant="outline" size="lg">Other Button</Button>
          </CardAction>
        </CardContent>
      </Card>
      
    </div>
  );
}
