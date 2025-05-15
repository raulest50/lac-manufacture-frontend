// .junie/update_endpoints_info.ts

const BACKEND_BASE_URL = 'http://localhost:8080/api/backend-info';

const JAVA_BUILTINS = new Set([
    "int", "long", "double", "float", "boolean", "char", "byte", "short",
    "Integer", "Long", "Double", "Float", "Boolean", "Character", "Byte", "Short",
    "String", "LocalDate", "LocalDateTime", "Date", "Object", "Authentication"
]);

function isCustomType(type: string): boolean {
    return !JAVA_BUILTINS.has(type);
}

async function fetchEndpoints(): Promise<any[]> {
    const res = await fetch(`${BACKEND_BASE_URL}/endpoints`);
    if (!res.ok) throw new Error("Failed to fetch endpoints");
    return await res.json();
}

async function fetchEndpointDetails(path: string, method: string): Promise<any | null> {
    const url = new URL(`${BACKEND_BASE_URL}/endpoints/details`);
    url.searchParams.append("path", path);
    url.searchParams.append("method", method);
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    return await res.json();
}


async function enrichEndpoint(endpoint: any): Promise<any[]> {
    const enriched = [];

    const paths: string[] = endpoint.paths || [];
    const methods: string[] = endpoint.httpMethods || [];

    for (const path of paths) {
        for (const method of methods) {
            const detail = await fetchEndpointDetails(path, method);
            if (!detail) continue;

            const modelMap: Record<string, any> = {};

            detail.models = modelMap;
            enriched.push(detail);
        }
    }

    return enriched;
}

async function updateEndpointsInfo() {
    console.log('📡 Fetching backend endpoint summaries...');
    const summaryEndpoints = await fetchEndpoints();
    const enrichedResults: any[] = [];

    for (const endpoint of summaryEndpoints) {
        const enriched = await enrichEndpoint(endpoint);
        enrichedResults.push(...enriched);
    }
    //@ts-ignore
    await Bun.write('.junie/backend_endpoints.json', JSON.stringify(enrichedResults, null, 2));
    console.log(`✅ Successfully wrote ${enrichedResults.length} enriched endpoints to .junie/backend_endpoints.json`);
}

//@ts-ignore
await updateEndpointsInfo();
