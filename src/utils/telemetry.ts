import { posthog } from 'posthog-js'
import * as os from 'os'

function getStableHostId(): string | undefined {
    return Object.values(os.networkInterfaces())
        .flat()
        .find(config => config && !config.internal && config.mac !== '00:00:00:00:00:00')
        ?.mac || undefined;
}

posthog.init('phc_ATkdmfJutLNoQvXMXCGLKDHXQYMXV00diQ8RUDdfe52',
    {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'always'
    }
)

posthog.identify(getStableHostId());

export { posthog }