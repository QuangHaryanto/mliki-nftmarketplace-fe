import { api } from "../helper/VVApi";

export default {

	parseBannerList(data) {
        var banners = []
        data.forEach(element => { 
        	var thumb;
            if(element.slider_image) {
                if(element.slider_image.length>0) {
                    thumb = api.base+"/images/slider/"  + element.slider_image
                } 
            }

            banners.push({
                slider_id: element._id,
                slider_title: element.title,
                slider_description: element.desc,
                slider_image: thumb,
                slider_link: element.slider_link
            })
        });

        return banners;
    },

    parseFaqList(data) {
        var faqs = []
        data.forEach(element => { 
            faqs.push({
                title: element.question,
                content: element.answer
            })
        });
        return faqs;
    }

}
