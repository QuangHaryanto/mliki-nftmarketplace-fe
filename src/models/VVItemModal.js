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

    parseItemList(data) {
        var items = []
        data.forEach(element => {
            var thumb;
            if(element.thumb) {
                if(element.thumb.length>0) {
                    let thumbArray = element.thumb.split(".")
                    thumb = api.base+"/images/item/thumb/"  + thumbArray[0] + "." + thumbArray[1]
                } else {
                    thumb = "/images/cover/cover-big.jpg"
                }
            } else {
                thumb = "/images/cover/cover-big.jpg"
            }
            var profile_image;
            if(element.current_owner.profile_image) {
                if(element.current_owner.profile_image.length>0) {
                    let thumbArray = element.current_owner.profile_image.split(".")
                    profile_image = api.base+"/images/user/"  + thumbArray[0] + "." + thumbArray[1]
                } else {
                    profile_image = "/images/avatars/avatar5.jpg"
                }
            } else {
                profile_image = "/images/avatars/avatar5.jpg"
            }

            let offerTime = Date.parse(element.offer_end_date);
            //  + (parseInt(element.offer_days) * 24 * 60 * 60 * 1000)
            let currentTime = Date.now()
            let has_offer = element.has_offer
            if(offerTime<currentTime) {
                has_offer = false
            }

            var start = Date.parse(element.offer_date),
            end = offerTime, 
            today = Date.now(),
            p = Math.round(((today - start) / (end - start)) * 100);
            // console.log(p);
            if((element.collection_id?.is_hide == undefined || element.collection_id?.is_hide == 0)){            
                items.push({
                    item_id: element._id,
                    name: element.name,
                    thumb: thumb,
                    profile_image: profile_image,
                    user_id: element.current_owner._id,
                    fullname: element.current_owner.first_name.length>0 ? element.current_owner.first_name + " " + element.current_owner.last_name : element.current_owner.username,
                    like_count: element.like_count,
                    like_count_str: this.getShortenNum(element.like_count),
                    is_verified: element.current_owner.is_verified,
                    price: element.price,
                    has_offer: has_offer,
                    offer_duration: parseInt(element.offer_duration),
                    offer_start_time: Date.parse(element.offer_start_time),
                    offer_time: offerTime,
                    percentage:p,
                    status: element.status
                })
            }
        });

        return items;
    }
};
