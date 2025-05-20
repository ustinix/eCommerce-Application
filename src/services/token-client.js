import { ClientBuilder } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
const projectKey = import.meta.env.VITE_CTP_CLIENT_PROJECT_KEY;
const AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
const API_URL = import.meta.env.VITE_CTP_API_URL;
export function createExistingTokenClient(existingToken) {
    const client = new ClientBuilder()
        .withProjectKey(projectKey)
        .withRefreshTokenFlow({
        host: AUTH_URL,
        projectKey,
        credentials: {
            clientId: import.meta.env.VITE_CTP_CLIENT_ID,
            clientSecret: import.meta.env.VITE_CTP_CLIENT_SECRET,
        },
        refreshToken: existingToken.refreshToken,
        fetch,
    })
        .withHttpMiddleware({
        host: API_URL,
        fetch,
    })
        .build();
    return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
}
