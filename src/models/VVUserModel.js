import { api } from "../helper/VVApi";
import { config } from "../helper/VVConfig";

export default {
    getShortenNum(n) {
        if (n < 1e3) return n;
        if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
        if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
        if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
        if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    },

    parseSellerList(data) {
        var sellers = []
        data.forEach(element => {
            var profile_cover;
            if(element.profile_cover) {
                if(element.profile_cover.length>0) {
                    let thumbArray = element.profile_cover.split(".")
                    profile_cover = api.media_path+"/images/cover/"  + thumbArray[0] + "." + thumbArray[1]
                } else {
                    profile_cover = "/images/bg/bg.png"
                }
            } else {
                profile_cover = "/images/bg/bg.png"
            }
            var profile_image;
            if(element.profile_image) {
                if(element.profile_image.length>0) {
                    let thumbArray = element.profile_image.split(".")
                    profile_image = api.media_path+"/images/user/"  + thumbArray[0] + "." + thumbArray[1]
                } else {
                    profile_image = "/images/avatars/avatar5.jpg"
                }
            } else {
                profile_image = "/images/avatars/avatar5.jpg"
            }
            var is_follow;
            if(element.is_follow) {
                is_follow = element.is_follow
            } else {
                is_follow = 0
            }
            sellers.push({
                user_id: element._id,
                username: element.username,
                fullname: element.first_name.length>0 ? element.first_name + " " + element.last_name : element.username,
                profile_cover: profile_cover,
                profile_image: profile_image,
                follower_count: element.follower_count,
                is_verified: element.is_verified,
                is_follow: is_follow,
                follower_count_str: this.getShortenNum(element.follower_count)
            })
        });

        return sellers;
    }
};
