export const baseUrl = "http://localhost:8080/api"

export const endPoint = {
    // auth
    signup: () => `${baseUrl}/auth/signup`,
    login: () => `${baseUrl}/auth/login`,

    //card
    createNewCard: (set_id) => `${baseUrl}/card/${set_id}/create-card`,
    createNewListCards: (set_id) => `${baseUrl}/card/${set_id}/create-cards`,
    deleteCardById: (id) => `${baseUrl}/card/${id}`,
    editCardById: (id) => `${baseUrl}/card/edit/${id}`,
    getCardById: (id) => `${baseUrl}/card/${id}`,
    getAllCardsInSet: (set_id) => `${baseUrl}/card/${set_id}/cards`,
    getAllCards: () => `${baseUrl}/card/cards`,

    //folder
    createNewFolder: () => `${baseUrl}/folder/create-folder`,
    deleteFolderById: (folder_id) => `${baseUrl}/folder/${folder_id}`,
    editFolderById: (folder_id) => `${baseUrl}/folder/edit/${folder_id}`,
    getAllSetsByFolderId: (folder_id) => `${baseUrl}/folder/${folder_id}/sets`,
    getAllFoldersByUserID: (user_id) => `${baseUrl}/folder/${user_id}/folders`,
    getAllFolders: () => `${baseUrl}/folder/get-all-folders`,
    getAllPublicFolders: () => `${baseUrl}/folder/get-public-folders`,
    getAllFoldersByTitle: (title) => `${baseUrl}/folder/title/${title}`,

    //folderset
    createNewFolderSet: () => `${baseUrl}/folder-set/create-folder-set`,
    deleteFolderSetById: (folderSet_id) => `${baseUrl}/folder-set/delete/${folderSet_id}`,
    editForderSetById: (folderSet_id) => `${baseUrl}/folder-set/edit/${folderSet_id}`,
    getAllFolderSetsByFolderId: (folder_id) => `${baseUrl}/folder-set/folder/${folder_id}`,
    getAllFolderSetsByFolderSetId: (folderSet_id) => `${baseUrl}/folder-set/${folderSet_id}`,
    getAllFolderSets: () => `${baseUrl}/folder-set/get-all-folder-sets`,
    getAllFolderSetsBySetId: (set_Id) => `${baseUrl}/folder-set/set/${set_Id}`,

    //review
    createNewReview: (set_id) => `${baseUrl}/review/sets/${set_id}/review`,
    deleteReviewById: (review_id) => `${baseUrl}/review/delete/${review_id}`,
    editReviewById: (review_id) => `${baseUrl}/review/edit/${review_id}`,
    getAllReviewBySetId: (set_id) => `${baseUrl}/review/sets/${set_id}/reviews`,
    getAllReview: () => `${baseUrl}/review/get-all-reviews`,
    getAllReviewByUserId: (user_id) => `${baseUrl}/review/user/${user_id}`,
    getReviewByUserIdAndSetId: (set_id, user_id) => `${baseUrl}/review/set/${set_id}/user/${user_id}`,

    //set
    createNewSet: () => `${baseUrl}/set/create-set`,
    deleteSetBySetId: (set_id) => `${baseUrl}/set/${set_id}`,
    editSetBySetId: (set_id) => `${baseUrl}/set/edit/${set_id}`,
    getAllSets: () => `${baseUrl}/set/get-all-sets`,
    getAllSetsByUserId: (user_id) => `${baseUrl}/set/${user_id}/sets`,
    getAllPublicSets: () => `${baseUrl}/set/get-public-sets`,
    getAllSetsByTitle: (title) => `${baseUrl}/set/title/${title}`,

    //settag
    createNewSetTag: () => `${baseUrl}/set-tag/create-set-tag`,
    deleteSetTagById: (set_tag_id) => `${baseUrl}/set-tag/${set_tag_id}`,
    getAllSetTag: () => `${baseUrl}/set-tag/get-all-set-tags`,
    getSetTagbySetId: (set_id) => `${baseUrl}/set-tag/${set_id}`,
    getTagNameBySetId: (set_id) => `${baseUrl}/set/${set_id}/tagname`,

    //tag
    createNewTag: () => `${baseUrl}/tag/create_tag`,
    deleteTagByTagId: (tag_id) => `${baseUrl}/tag/${tag_id}`,
    editTagByTagId: (tag_id) => `${baseUrl}/tag/${tag_id}`,
    getAllTag: () => `${baseUrl}/tag/get-all-tags`,
    getTagByTagId: (tag_id) => `${baseUrl}/tag/${tag_id}`,

    //user
    editPasswordByUserId: (user_id) => `${baseUrl}/user/change-password/${user_id}`,
    deleteUserByUserId: (user_id) => `${baseUrl}/user/delete-user/${user_id}`,
    getAllUsers: () => `${baseUrl}/user/get-all-users`,
    getUserByUserId: (user_id) => `${baseUrl}/user/${user_id}`,
    getUserByUsername: (username) => `${baseUrl}/user/username/${username}`,
    getUserByEmail: (email) => `${baseUrl}/user/email/${email}`,
    updateUsernameByUserId: (user_id) => `${baseUrl}/user/change-username/${user_id}`
    // resetPassword:
}

// const getMethods = async () => {
//     const response = await Request.Server.get(endPoint.getExamById(id));

//     console.log(response);

//     // response lầ dữ liệu trả ve từ api
//   }
//   // put post delete nó giống nhau về cách gọi chỉ khác phương thức thôi
//   // sửa post thành put hoac delete là đc

//   const postMethods = async () => {
//     // vd cái api create new exam là dùng pt post
//     const response = await Request.Server.put(endPoint.createNewExam(), {
//       examName: examName,
//       description: description,
//       examType: examType,
//       startTime: startTime,
//       endTime: endTime
//     });

//     console.log(response);
//   }

//   const putMethods = async () => {
//     const response = await Request.Server.put(endPoint.editExamById(id), {
//       examName: examName,
//       description: description,
//       examType: examType,
//       startTime: startTime,
//       endTime: endTime
//     });

//     console.log(response);
//   }

//   const deleteMethods = async () => {
//     const response = await Request.Server.delete(endPoint.deleteExamById(id));

//     console.log(response);
//   }