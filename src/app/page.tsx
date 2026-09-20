import { S00Index } from "@/components/sections/S00Index";
import { S01Capabilities } from "@/components/sections/S01Capabilities";
import { S02Work } from "@/components/sections/S02Work";
import { S03Interlude } from "@/components/sections/S03Interlude";
import { S04Process } from "@/components/sections/S04Process";
import { S05Stack } from "@/components/sections/S05Stack";
import { S06Pricing } from "@/components/sections/S06Pricing";
import { S07Studio } from "@/components/sections/S07Studio";
import { S08Ship, SiteFooter } from "@/components/sections/S08Ship";

export default function Page() {
  return (
    <>
      <main id="main" className="relative">
        <S00Index />
        <S01Capabilities />
        <S02Work />
        <S03Interlude />
        <S04Process />
        <S05Stack />
        <S06Pricing />
        <S07Studio />
        <S08Ship />
      </main>
      <SiteFooter />
    </>
  );
}
