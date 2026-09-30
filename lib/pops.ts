import { type Pop } from "@/lib/dummy-pops";
import { listAllPops } from "@/lib/user-pops";

export function findPopById(id: string): Pop | undefined {
  return listAllPops().find((pop) => pop.id === id);
}

export function findPopsByAuthor(author: string): Pop[] {
  return listAllPops().filter((pop) => pop.author === author);
}
