import { api } from "../helper/VVApi";
import moment from 'moment';
import { config } from "../helper/VVConfig";
export default {
    getShortenNum(n) {
        if (n < 1e3) return n;
        if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
        if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
        if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
        if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    },

    changepriceformat(price){
        let decimallength = 0
        let numStr = String(price)
        let formattedprice = price
        if (numStr.includes('.')) {
            decimallength = numStr.split('.')[1].length
            if (decimallength > 6) {
                formattedprice = parseFloat(formattedprice).toFixed(6)
            }
        }
        return formattedprice
    },

    parseHistoryList(data) {
        var history = []


        data.forEach(element => {
            var thumb;
            var fullname;
            var user_id;
            var object_id;
            var object_title;
            if(element.history_type === "follow") {
                if(element.to_id.profile_image) {
                    if(element.to_id.profile_image.length>0) {
                        let thumbArray = element.to_id.profile_image
                        thumb =thumbArray
                    } else {
                        thumb = "/images/avatars/avatar5.jpg"
                    }
                } else {
                    thumb = "/images/avatars/avatar5.jpg"
                }
                object_id = element.to_id?._id;
                object_title = element.to_id?.first_name.length>0 ? element.to_id?.first_name + " " + element.to_id?.last_name : element.to_id?.username;
                user_id = element.from_id?._id
                fullname = element.from_id?.first_name.length>0 ? element.from_id?.first_name + " " + element.from_id?.last_name : element.from_id?.username;
            } else if(element.history_type === "minted" || element.history_type === "transfer" || element.history_type === "comission" || element.history_type === "admin_comission" ) {
                if(element.item_id?.thumb) {
                    if(element.item_id?.thumb.length>0) {
                        let thumbArray = element.item_id?.thumb
                        thumb = thumbArray
                    } else {
                        thumb = "/images/cover/cover-big.jpg"
                    }
                } else {
                    thumb = "/images/cover/cover-big.jpg"
                }
                object_title = element.item_id?.name;
                fullname = element.to_id?.first_name.length>0 ? element.to_id?.first_name + " " + element.to_id?.last_name : element.to_id?.username;
                user_id = element.to_id?._id
                object_id = element.item_id?._id
            } else if(element.history_type === "bids") {
                if(element.item_id?.thumb) {
                    if(element.item_id?.thumb.length>0) {
                        let thumbArray = element.item_id?.thumb
                        thumb = thumbArray
                    } else {
                        thumb = "/images/cover/cover-big.jpg"
                    }
                } else {
                    thumb = "/images/cover/cover-big.jpg"
                }
                object_title = element.item_id?.name;
                fullname = element.from_id?.first_name.length>0 ? element.from_id?.first_name + " " + element.from_id?.last_name : element.from_id?.username;
                user_id = element.from_id?._id
                object_id = element.item_id?._id
            }else if(element.history_type=='deposit' || element.history_type=='withdraw'){
                fullname = element.from_id?.first_name.length>0 ? element.from_id?.first_name + " " + element.from_id?.last_name : element.from_id?.username;
                if(element.from_id.profile_image!='') {
                    if(element.from_id.profile_image.length>0) {
                        let thumbArray = element.from_id.profile_image
                        thumb = thumbArray
                        thumb = "/images/avatars/avatar5.jpg"
                    }
                }else{
                    thumb = "/images/avatars/avatar5.jpg"
                }
                user_id = element.from_id._id
            }
            history.push({
                history_id: element._id,
                history_type: element.history_type,
                object_id: object_id,
                object_title: object_title,
                fullname: fullname,
                image: thumb,
                price: this.changepriceformat(element.price),
                timeago: moment(element.created_date).fromNow(),
                user_id: user_id,
                transaction_hash: element.transaction_hash,
                blockchain: element.item_id.blockchain,
                currency: element.item_id.currency
            })
        });

        return history;
    },
    parseTradeHistoryList(data) {
        var history = []
        data.forEach(element => {
            var sender;
            var sender_id;
            var receiver;
            var receiver_id;
            var profile_image;
            if(element.from_id) {
                sender_id = element.from_id._id
                sender = element.from_id.first_name.length>0 ? element.from_id.first_name + " " + element.from_id.last_name : element.from_id.username;
                if(element.from_id.profile_image!='') {
                    if(element.from_id.profile_image.length>0) {
                        let thumbArray = element.from_id.profile_image
                        profile_image = thumbArray
                    } else {
                        profile_image = "/images/avatars/avatar5.jpg"
                    }
                }else{
                    profile_image = "/images/avatars/avatar5.jpg"
                }
            } else {
                profile_image = "/images/avatars/avatar5.jpg"
            } 


            if(element.to_id) {
                receiver_id = element.to_id._id
                receiver = element.to_id.first_name.length>0 ? element.to_id.first_name + " " + element.to_id.last_name : element.to_id.username;
            }
            history.push({
                history_id: element._id,
                history_type: element.history_type,
                event: element.history_type.replace("_"," "),
                sender: sender,
                sender_id: sender_id,
                receiver: receiver,
                receiver_id: receiver_id,
                price: this.changepriceformat(element.price),
                timeago: moment(element.created_date).fromNow(),
                transaction_hash: element.transaction_hash,
                image:profile_image
            })
        });
        return history;
    },

    parseOfferList(data) {
        var prices = []
        data.forEach(element => {
            var user_id = element.sender._id
            var username = element.sender.first_name.length>0 ? element.sender.first_name + " " + element.sender.last_name : element.sender.username;
            prices.push({
                offer_id: element._id,
                username: username,
                user_id: user_id,
                receiver_id: element.receiver._id,
                price: this.changepriceformat(element.price),
                status: element.status,
                timeago: moment(element.created_date).fromNow(),
            })
        });
        return prices;
    },

    parsePriceList(data) {
        var offers = []
        data.forEach(element => {
            var user_id = element.user_id._id
            var username = element.user_id.first_name.length>0 ? element.user_id.first_name + " " + element.user_id.last_name : element.user_id.username;
            offers.push({
                price_id: element._id,
                username: username,
                user_id: user_id,
                price: this.changepriceformat(element.price),
                timeago: moment(element.created_date).fromNow(),
            })
        });
        return offers;
    }
};
