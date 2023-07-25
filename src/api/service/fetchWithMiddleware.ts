export async function fetchWithMiddleware(url: string, options?: RequestInit): Promise<Response> {
    // Check if the request is a POST or PUT request and has JSON body
    if (
        options &&
        (options.method === "POST" || options.method === "PUT") &&
        options.headers &&
        typeof options.headers === "object" // Check for HeadersInit type
    ) {
        const headers = options.headers as HeadersInit;
        const contentType = "Content-Type";
        if (contentType in headers && headers[contentType] === "application/json" && options.body) {
            const requestBody = JSON.parse(options.body as string);
            const operatorName = "operatorName";
            console.log(`requestBody ${JSON.stringify(requestBody)}`)
            if (requestBody.hasOwnProperty(operatorName)) {
                requestBody[operatorName] =
                    requestBody[operatorName].toLowerCase();
            }

            if (requestBody.hasOwnProperty("username")) {
                const _username = requestBody["username"];
                requestBody["username"] = _username.toLowerCase()// charAt(0).toUpperCase() + _username.slice(1).toLowerCase();
                console.log(`requestBody ${JSON.stringify(requestBody)}`)
            }

            options.body = JSON.stringify(requestBody);
        }
    }

    return fetch(url, options);
}
