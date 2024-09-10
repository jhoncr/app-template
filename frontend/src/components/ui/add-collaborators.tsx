import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, useFieldArray } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, UserPlus2, UserX } from "lucide-react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccessMap, User } from "@/lib/custom_types";

//schema for an array of emails
const schema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email." }),
    role: z.enum(["admin", "reporter", "viewer"]),
  })
  .strict();

type PersonType = z.infer<typeof schema>;

type AccessList = { email: string; role: string; is_pending?: boolean };

//TODO: handle scenario where 2 tries to share at the same time.
export function AddContributers({ item_id, access, pending_access }: 
  { item_id: string, 
    access: AccessMap
    pending_access: { [key: string]: string }
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [people, setPeople] = useState( [] as AccessList[] );
  const [pending, setPending] = useState(false);

  const form = useForm<PersonType>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", role: "viewer" },
  });

  const onSave = () => {
    console.log(`Sending addContributer request for ${people.length} people`);
    setPending(true);
    const addContributer = httpsCallable(getFunctions(), "addContributer", {
      limitedUseAppCheckTokens: true,
    });
    async function calladdContributer(data: any) {
      try {
        const result = await addContributer(data)
        // console.log("Mock call to addContributer");
        setIsOpen(false);
      } catch (error) {
        console.log("ops, something went wrong :/", error);
      }
      setPending(false);
    }
    let payload = { people, item_id };
    console.log("payload", payload);
    calladdContributer(payload);
  };

  const onClose = () => {
    console.log("onClose", form.getValues());
    form.reset();
    setIsOpen(false);
  };

  const onOpenHandler = (open:boolean) => {
    if (open) {
      console.log("onOpenHandler", form.getValues());
      console.log("access", access);
      const a = Object.values(access).map( (x:User) => ({email: x.email, role: x.role}) );
      const p =Object.entries(pending_access).map( ([k,v]) => ({email: k, role: v, is_pending: true}) );
      setPeople(
        a.concat(p)
      );
      form.reset();
    }
    setIsOpen(open)
  }

  const onAddClick = () => {
    console.log("onAddClick", form.getValues());
    console.log("people", people)
    form.trigger().then((isValid) => {
      if (isValid) {
          const email = form.getValues().email
          if (people.find( (person) => person.email === email)) {
            console.log("email already in the list")
            form.setError("email", { message: "Email already in the list" })
          }

          else {
          setPeople([...people, {...form.getValues(), is_pending: true}]);
          form.reset();
          }
          document.getElementById("email")?.focus();
      }
    });
  };

  const onClickRemove = (idx:Number) => {
    console.log("onClickRemove")
    setPeople(people.filter((person, index) => index !== idx));
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenHandler}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <UserPlus2 className="h-7 w-7 m-2" />
        </Button> 
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onCloseAutoFocus={onClose}>
        <DialogHeader>
          <DialogTitle>Add Contributors</DialogTitle>
          <DialogDescription>
            Add contributors to your Item
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="grid grid-cols-6 gap-2 -mb-5 -mt-2">
            <div className="col-span-3">
              <Label htmlFor="email">Email</Label>
            </div>
            <div className="col-span-2">
              <Label htmlFor="role">Role</Label>
            </div>
          </div>
          <form className="space-y-6">
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name={"email"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                          value={field.value}
                          id={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name={"role"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          key={field.name}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="reporter">Reporter</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onAddClick}
              >
                <Plus />
              </Button>
            </div>
          </form>
          {/* List the emails and roles in people, with a button to remove  */}
          {people.length > 0 && (
            <div className="space-y-2">
              {people.map((person, idx) => (
                <div className="flex items-center justify-between border-b" key={`p-${idx}`}>
                  <div> 
                    <p>{person.email}</p>
                    <p className="text-xs text-ellipsis">
                      {`${
                        person.is_pending
                          ? "Pending:"
                          : ""
                      } ${person.role}`
                      }
                    </p>
                  </div>

                    <Button
                      key={`rm-${idx}`}
                      variant="outline"
                      size="icon"
                      type="button"
                      className={(person.role === "admin" && !person.is_pending) ? "hidden" 
                      : "flex items-center justify-center bg-accent mb-1 "}
                      onClick={() => onClickRemove(idx)}
                    >
                      <UserX />
                      <span className="sr-only">Remove</span>
                    </Button>
                  
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant={"outline"} onClick={onSave} disabled={pending}>
              Save
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
