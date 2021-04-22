export class HTTPService {

    async get(url: string, init?: RequestInit) {
        return await fetch(url, {
            ...init,
            method: 'GET'
        })
    }

    async post(url: string, init?: RequestInit) {
        return await fetch(url, {
            ...init,
            method: 'POST'
        })
    }

    async patch(url: string, init?: RequestInit) {
        return await fetch(url, {
            ...init,
            method: 'PATCH'
        })
    }

    async put(url: string, init?: RequestInit) {
        return await fetch(url, {
            ...init,
            method: 'PUT'
        })
    }

    async delete(url: string, init?: RequestInit) {
        return await fetch(url, {
            ...init,
            method: 'DELETE'
        })
    }
}