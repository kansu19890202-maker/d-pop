import { Gallery } from "@/components/Gallery";
import { dummyPops } from "@/lib/dummy-pops";

export default function Home() {
  return <Gallery pops={dummyPops} />;
}
