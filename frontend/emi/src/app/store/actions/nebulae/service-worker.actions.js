export const SW_UPDATE = '[SERVICE_WORKER] UPDATE';
export const SW_HIDE_UPDATE = '[SERVICE_WORKER] HIDE UPDATE';
export const SW_INIT = '[SERVICE_WORKER] INIT';


export function setServiceWorkerInit()
{
    return {
        type: SW_INIT
    }
}

export function setServiceWorkerUpdate(payload)
{
    return {
        type: SW_UPDATE,
        payload
    }
}

export function setServiceWorkerHideUpdate()
{
    return {
        type: SW_HIDE_UPDATE
    }
}

