import http from '../libs/http'

/**
 * user api
 */

/**
 * get user profile
 */
export let getUserProfile = (query) => {
    return http.get('user', {
        params: query,
		
    })
};

/**
 * update user profile, including username and avatar
 */
export let update = (query) => {
    return http.post('user', query)
};

/**
 * get user`s dashboard
 */
export let getUserDashboard = (query) => {
    return http.get('user/dashboard', {
        params: query
    })
};
/**
 * get user's summary
 */

export let getUserSummary = (query) => {
    return http.get('user/summary', {
        params: query
    })
};
/**
 * get user's purchases
 */

export let getUserPurchases = (query) => {
    return http.get('user/purchases', {
        params: query
    })
};
