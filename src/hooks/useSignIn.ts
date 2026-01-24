"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useSignInModal() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isOpen = searchParams.get("signin") === "1";

    const open = () => {
        const sp = new URLSearchParams(searchParams.toString());
        sp.set("signin", "1");
        router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    const close = () => {
        const sp = new URLSearchParams(searchParams.toString());
        sp.delete("signin");
        const qs = sp.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    return { isOpen, open, close };
}
