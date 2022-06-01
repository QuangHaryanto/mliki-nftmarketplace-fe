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

    parseCollectionList(data) {
        var collections = []
        data.forEach(element => {
            var banner;
            if(element.banner) {
                if(element.banner.length>0) {
                    let thumbArray = element.banner.split(".")
                    banner = api.base+"/images/collection/"  + thumbArray[0] + "." + thumbArray[1]
                } else {
                    banner = "/images/bg/bg.png"
                }
            } else {
                banner = "/images/bg/bg.png"
            }
            var profile_image;
            if(element.author_id.profile_image) {
                if(element.author_id.profile_image.length>0) {
                    let thumbArray = element.author_id.profile_image.split(".")
                    profile_image = api.base+"/images/user/"  + thumbArray[0] + "." + thumbArray[1]
                } else {
                    profile_image = "/images/avatars/avatar5.jpg"
                }
            } else {
                profile_image = "/images/avatars/avatar5.jpg"
            }

            var itemImage1, itemImage2 , itemImage3;
            if(element.item.length>0){
                element.item.forEach((itemElement,itemKey) => {
                    if(itemKey==0){
                        if(itemElement.thumb.length>0) {
                            let thumbArray = itemElement.thumb.split(".")
                            itemImage1 = api.base+"/images/item/thumb/"  + thumbArray[0] + "." + thumbArray[1]
                        } else {
                            itemImage1 = "/assets/img/items/item_13.png"
                        }
                        itemElement.image = itemImage1;
                    }else if(itemKey==1){
                        if(itemElement.thumb.length>0) {
                            let thumbArray = itemElement.thumb.split(".")
                            itemImage2 = api.base+"/images/item/thumb/"  + thumbArray[0] + "." + thumbArray[1]
                        } else {
                            itemImage2 = "/assets/img/items/item_14.png"
                        }
                        itemElement.image = itemImage2;
                    }else if(itemKey==2){
                        if(itemElement.thumb.length>0) {
                            let thumbArray = itemElement.thumb.split(".")
                            itemImage3 = api.base+"/images/item/thumb/"  + thumbArray[0] + "." + thumbArray[1]
                        } else {
                            itemImage3 = "/assets/img/items/item_15.png"
                        }
                        itemElement.image = itemImage3;
                    }
                });
             } 
  
            collections.push({
                collection_id: element._id,
                name: element.name,
                banner: banner,
                profile_image: profile_image,
                fullname: element.author_id.first_name.length>0 ? element.author_id.first_name + " " + element.author_id.last_name : element.author_id.username,
                user_id: element.author_id._id,
                item_count: element.item_count,
                is_verified: element.author_id.is_verified,
                item_count_str: this.getShortenNum(element.item_count),
                item_info: element.item
            })
        });

        return collections;
    }
};
