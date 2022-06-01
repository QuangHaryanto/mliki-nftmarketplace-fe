import {useItemStartListener, useItemFinishListener, useItemProgressListener} from "@rpldy/uploady";
import { toast } from 'react-toastify';
export const UploadHook = (props) => {
    let toastObj;
    useItemStartListener(item=> {
      toastObj =  toast("uploading...",{
        closeButton: false,
        autoClose: false,
        progress: 0,
        isLoading: true
       })
    })
    useItemProgressListener(item => {
      toast.update(toastObj,{
        progress: item.completed
      });
    });
  
    useItemFinishListener((item)=> {
      toast.dismiss(toastObj);
      if(item.uploadResponse.data.status == true) {
        props.onDone(item.uploadResponse.data.result);
      } else {
        props.onError(item.uploadResponse.data.message);
      }
      
    })
    return null
  }