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
/**
 * create collection
 */
export let createCollection = (query) => {
    return http.post('collection', query)
};
/**
 * get collection list
 */
export let getCollectionList = (query) => {
	return http.get('collection', {
	    params: query
	})
};
/**
 * delete collection
 */

export let deleteCollection = (query) => {

	return http.delete(`collection/${query}`)
	
};
/**
 * get  search file
 * 
 */

export let getSearch = (query) => {
 
	return http.get(`search`,{
		 params: query
	})
	
};
/**
 * join Collection
 */
export let joinCollection = (query) => {
    return http.post('collectionFile', query)
};
/**
 * like Collection
 */
export let likeCollection = (query) => {
    return http.post(`collectionLike?collectionId=${query}`)
	
};
/**
 * cancel collection
 */
export let deleteCollectionLike = (query) => {
 
	return http.delete(`collectionLike?collectionId=${query}`)
	
};
/**
 * get collection filelist
 */
export let getCollectionFilelist = (query) => {
 
	
	return http.get('collection/fileInfos', {
	    params: query
	})
};
/**
 * get recommended tags for collection
 */
export let collectionTag = (query)=>{
	return http.post('collection/recommendedTags',query)
};
/**
 * About Comment
 */

/**
 * get Comment
 */
export let getComment = (query) => {
	return http.get('comment/file', {
	    params: query
	})
}
/**
 * add file comment
 */
export let addFileComment = (query) => {
	return http.post('comment/file',query)
}
/**
 * delete file comment 
 */

export let deleteFileComment = (query) => {
	// return http.delete(`comment/file?collectionId=${query}`)
	return http.delete(`comment/file/${query}`)
};
/**
 * like file comment
 */
export let CommentLike = (query) => {
	// return http.post('comment/like',query)
	return http.post(`comment/like?commentId=${query}`)
}
/**
 * unlike file comment
 */
export let UnlikeComment = (query) => {
	return http.delete(`comment/like?commentId=${query}`)
	// return http.delete(`comment/like/${query}`)
};
/**
 * get liked collections
 */
export let getLikedCollection = (query) => {
	return http.get('collection/liked', {
	    params: query
	})
}
/**
 * get collection  Comment
 */
export let getCollComment = (query) => {
	return http.get('comment/collection', {
	    params: query
	})
}
/**
 * add collection  comment
 */
export let addCollComment = (query) => {
	return http.post('comment/collection',query)
}
/**
 * delete collection  comment 
 */

export let deleteCollComment = (query) => {
	// return http.delete(`comment/file?collectionId=${query}`)
	return http.delete(`comment/collection/${query}`)
};
/**
 * like collection  comment
 */
export let CollCommentLike = (query) => {
	// return http.post('comment/like',query)
	return http.post(`comment/collection/like?commentId=${query}`)
}
/**
 * unlike collection  comment
 */
export let UnlikeCollComment = (query) => {
	return http.delete(`comment/collection/like?commentId=${query}`)
	// return http.delete(`comment/like/${query}`)
};
/**
 * delete file
 */
export let deleteFile = (query) => {
	return http.delete(`file/${query}`)
	// return http.delete(`comment/like/${query}`)
};