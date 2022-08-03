import { Header } from 'element-ui';
import http from '../libs/http'

/**
 * file api
 */

/**
 * list and search files
 */
export let fileInfos = (query) => {
    return http.get('fileInfos', {
        params: query
    })
};

/**
 * download purchased single file
 */
export let download = (query) => {
    return http.get(`file/order/download/${query}`, {
		responseType: 'blob'
	})
};

/**
 * cancel a previous upload
 */
export let cancelUpload = (query) => {
    return http.delete(`file/upload/${query}`)
};

/**
 * add single file with preview information
 */
export let addFileWithPreview = (query) => {
    return http.post('file/addFileWithPreview', query)
};
/**
 * get file details
 */
export let fileDetails = (query) => {
    return http.get(`file/${query}`)
};

