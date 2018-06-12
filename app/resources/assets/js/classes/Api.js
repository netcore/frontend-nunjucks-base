const server = ''

export default class API {
	/**
	 * Determine if current env is HTML repo.
	 *
	 * @return {boolean}
	 */
	static isHTMLEnv() {
		return window.environment && window.environment === 'html'
	}

	/**
	 * Make request to the given endpoint.
	 *
	 * @param endpoint
	 * @param method
	 * @param data
	 * @return {Promise<any>}
	 */
	static request(json, endpoint, method, data) {
		return new Promise((resolve, reject) => {
			let settings = {
				method: json && this.isHTMLEnv() ? 'GET' : method,
				url: json && this.isHTMLEnv() ? json : server + endpoint
			}

			if (settings.method === 'GET') {
				settings['params'] = data || {}
			} else {
				settings['data'] = data || {}
			}

			axios(settings).then(res => {
				resolve(res.data)
			}).catch(err => {
				if (err.response.status >= 500) {
					alert(err.response.statusText)
				}

				reject(err)
			})
		})
	}

	// exmaple request
	static example() {
		return API.request('assets/json/example.json', '/api/endpoint', 'GET')
	}
}
