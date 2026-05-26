/*
 docker run -d -p 8191:8191 --name flaresolverr --restart unless-stopped \
6 -//     ghcr.io/flaresolverr/flaresolverr:latest
*/

const FLARESOLVERR_URL = process.env.FLARESOLVERR_URL ?? "http://localhost:8191/v1";

const SESSION_ID = "cars-scraper";

let sessionCreated = false;

interface FlareSolverrResponse {
    status: "ok" | "error";
    message: string;
    solution?: {
        url: string;
        status: number;
        response: string;
        cookies: Array<{ name: string; value: string }>;
        userAgent: string;
    };
}

async function flareSolverrRequest(cmd: string, params: Record<string, unknown>): Promise<FlareSolverrResponse> {
    const res = await fetch(FLARESOLVERR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cmd, ...params }),
    });

    if (!res.ok) {
        throw new Error(`FlareSolverr HTTP ${res.status}`);
    }

    return res.json();
}

async function ensureSession(): Promise<void> {
    if (sessionCreated) return;

    console.log("[flaresolverr] Создаём сессию...");
    const result = await flareSolverrRequest("sessions.create", { session: SESSION_ID });

    if (result.status !== "ok") {
        if (!result.message?.includes("already exists")) {
            throw new Error(`Не удалось создать сессию: ${result.message}`);
        }
    }

    sessionCreated = true;
    console.log("[flaresolverr] Сессия готова");
}

export async function fetchHtml(url: string): Promise<string> {
    await ensureSession();

    const result = await flareSolverrRequest("request.get", {
        url,
        session: SESSION_ID,
        maxTimeout: 60_000,
    });

    if (result.status !== "ok" || !result.solution) {
        throw new Error(`FlareSolverr: ${result.message ?? "неизвестная ошибка"}`);
    }

    if (result.solution.status !== 200) {
        throw new Error(`cars.com вернул ${result.solution.status} для ${url}`);
    }

    return result.solution.response;
}

export async function closeBrowser(): Promise<void> {
    if (!sessionCreated) return;

    try {
        await flareSolverrRequest("sessions.destroy", { session: SESSION_ID });
        sessionCreated = false;
        console.log("[flaresolverr] Сессия закрыта");
    } catch (e) {
        console.warn("[flaresolverr] Не удалось закрыть сессию:", (e as Error).message);
    }
}