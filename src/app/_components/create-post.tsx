"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

export function CreateUser() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createUser = api.user.createUser.useMutation({
    onSuccess: () => {
      router.refresh();
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createUser.mutate({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="fName"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        placeholder="lName"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        placeholder="psw"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createUser.isPending}
      >
        {createUser.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
