
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldSet,
  FieldLegend,
  FieldLabel,
  FieldGroup,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  createTicket: any
  categoryItems: any[]
  usersItems: any[]
}

export default function TicketForm({
  createTicket,
  categoryItems,
  usersItems,
}: Props) {
  const [titleError, setTitleError] = useState(false)
  const [descriptionError, setDescriptionError] = useState(false)
  const [categoryError, setCategoryError] = useState(false)
  const [userError, setUserError] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)

    const title = formData.get("title")?.toString().trim() ?? ""
    const description =
    formData.get("description")?.toString().trim() ?? ""
    const category = formData.get("category")
    const user = formData.get("user")

    const hasTitleError = title.length === 0
    const hasDescriptionError = description.length === 0
    const hasCategoryError = !category
    const hasUserError = !user

    setTitleError(hasTitleError)
    setDescriptionError(hasDescriptionError)
    setCategoryError(hasCategoryError)
    setUserError(hasUserError)

    if (hasTitleError || hasDescriptionError || hasCategoryError ||hasUserError) {
      event.preventDefault()
    }
  }

  return (
    <Card className="min-w-100">
      <CardContent>
        <form action={createTicket} onSubmit={handleSubmit}>
          <FieldSet>
            <FieldLegend>New ticket</FieldLegend>
            <FieldDescription>
              Create a new support ticket.
            </FieldDescription>

            <FieldGroup>
              <Field data-invalid={titleError}>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  name="title"
                  autoComplete="off"
                  placeholder="Enter a title"
                  aria-invalid={titleError}
                  onChange={(event) => {
                    if (event.target.value.trim()) {
                      setTitleError(false)
                    }
                  }}
                />
                {titleError && (
                  <FieldError>Title cannot be empty.</FieldError>
                )}
              </Field>

              <Field data-invalid={descriptionError}>
                <FieldLabel htmlFor="description">
                  Description
                </FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  autoComplete="off"
                  placeholder="Enter a description"
                  aria-invalid={descriptionError}
                  onChange={(event) => {
                    if (event.target.value.trim()) {
                      setDescriptionError(false)
                    }
                  }}
                />
                {descriptionError && (
                  <FieldError>
                    Description cannot be empty.
                  </FieldError>
                )}
              </Field>

              <Field>
                <Select name="category" items={categoryItems}>
                  <SelectTrigger className="w-[180px]" aria-invalid={categoryError}>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categoryItems.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                  {categoryError && (
                    <FieldError>Category cannot be empty.</FieldError>
                  )}
                </Select>

                <Select name="user" items={usersItems}>
                  <SelectTrigger className="w-[180px]" aria-invalid={userError}>
                    <SelectValue placeholder="User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {usersItems.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                  {userError && (
                    <FieldError>User cannot be empty.</FieldError>
                  )}
                </Select>
              </Field>
            </FieldGroup>

            <Button variant="default" size="lg" type="submit">
              Create Ticket
            </Button>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  )
}
