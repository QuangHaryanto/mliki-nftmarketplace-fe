import { api } from "../helper/VVApi";
import moment from 'moment';
import { config } from "../helper/VVConfig";
export default {
    parseNotificationList(data) {
        var history = []
        data.forEach(element => {
            var thumb;
            var fullname;
            var user_id;
            if(element.type === "following") {
                if(element.sender_id.profile_image) {
                    if(element.sender_id.profile_image.length>0) {
                        let thumbArray = element.sender_id.profile_image.split(".")
                        thumb = api.media_path+"/images/user/"  + thumbArray[0] + "." + thumbArray[1]
                    } else {
                        thumb = "/images/avatars/avatar5.jpg"
                    }
                } else {
                    thumb = "/images/avatars/avatar5.jpg"
                }
                user_id = element.sender_id._id
                fullname = element.sender_id.first_name.length>0 ? element.sender_id.first_name + " " + element.sender_id.last_name : element.sender_id.username;
            } else {
                if(element.item_id.thumb) {
                    if(element.item_id.thumb.length>0) {
                        let thumbArray = element.item_id.thumb.split(".")
                        thumb = api.media_path+"/images/item/thumb/"  + thumbArray[0] + "." + thumbArray[1]
                    } else {
                        thumb = "/images/cover/cover-big.jpg"
                    }
                } else {
                    thumb = "/images/cover/cover-big.jpg"
                }
                fullname = element.sender_id.first_name.length>0 ? element.sender_id.first_name + " " + element.sender_id.last_name : element.sender_id.username;
                user_id = element.sender_id._id
            } 
            history.push({
                notification_id: element._id,
                type: element.type,
                fullname: fullname,
                user_id: user_id,
                item_id: element.item_id,
                image: thumb,
                timeago: moment(element.created_date).fromNow(),
            })
        });

        return history;
    }
};
