import { treaty } from '@elysiajs/eden'
import { ApiAppType } from '~/api'

const URL = import.meta.env.PUBLIC_BASE_URL
if (!URL) {
    throw new Error('BUN_PUBLIC_BASE_URL is not defined')
}

const apiContract = treaty<ApiAppType>(URL)

export default apiContract
