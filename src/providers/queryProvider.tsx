"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const defaultOptions = {
    queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1,
    },
} as const;

let browserClient: QueryClient | undefined;

function getQueryClient() {
    if (typeof window === "undefined") {
        return new QueryClient({ defaultOptions });
    }
    if (!browserClient) {
        browserClient = new QueryClient({ defaultOptions });
    }
    return browserClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const client = getQueryClient();
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}