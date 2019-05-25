var Users = require("./../models/Users");

module.exports = {

    add_user : async function(userData, user_id) {
        return await Users.add_user(userData, user_id);
    },
    get_list : async function() {
        return await Users.get_list();
    },
    user_by_id : async function(userId) {
        return await Users.user_by_id(userId);
    },
    update_user : async function(userId,userData) {
        return await Users.update_user(userId,userData);
    },
    delete_user : async function(userId) {
        return await Users.delete_user(userId);
    },
    register : async function(userData) {
        try {
            var getUser = await Users.getUserByEmail(userData.email);

            if (getUser.status && getUser.data) {
                return { status: false, message: 'This email is already taken.', data: null };
            }

            var isSuccess = await Users.register(userData);
            if (!isSuccess.status) {
                return { status: false, message: 'Can not register user.', data: isSuccess.message };
            }

            return { status: true, message: 'Successfully.', data: isSuccess.data };
        } catch (e) {
            throw Error(e.message);
        }
    },

    login : async function(loginData) {
        try {
            var getUser = await Users.getUserByEmail(loginData.email);
            if (getUser.status && getUser.data) {
                var UserData = getUser.data;
                var user = await Users.login(loginData, UserData);
                if (user.status) {
                return {status : true, message : user.message, user : user.user};
                }
                return {status : false, message : user.message};
            }
            return {status : false, message : 'Email not exist'};
        }catch(e) {
            throw Error(e.message);
        }
    },

    logout: async function(uuid) {
        try {
            return await Users.logout(uuid);
        } catch (e) {
            throw Error(e.message);
        }
    },

    generateUUIDByUserId : async function (user_id) {
        try {
            return await Users.generateUUIDByUserId(user_id);
        } catch (e) {
            throw Error(e.message);
        }
    },
    checkUUID : async function(uuid) {
        try {
            var getUser =  await Users.getUserByUUID(uuid);
            console.log(getUser.status);
            if (!getUser.status && !getUser.data) {
                return { status: false, message: 'Uuid not exist.' };
            }

            var userData = getUser.data;
            var userContent = userData[Object.keys(userData)[0]];
            var latestTime = Math.floor(Date.now()/1000) - parseInt(userContent.latest);

            if (latestTime > (2 * 60 * 60)) {
                return { status: false, message: 'Uuid has expired. Please login again!' };
            }

            return { status: true, message: 'Successfully.' };

        } catch (e) {
            throw Error(e.message);
        }
    },
}
