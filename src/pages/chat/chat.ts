import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, Content,NavController, Platform,ModalController,NavParams,LoadingController } from 'ionic-angular';
import { Chatting } from '../../components/models/chatting';
import { AngularFireDatabase } from 'angularfire2/database';
import { storage } from 'firebase';
import firebase from 'firebase';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { BigpicturePage } from '../bigpicture/bigpicture'
import { CameraselectPage} from '../cameraselect/cameraselect';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Http, RequestOptions, Headers} from '@angular/http';

// import undefined from 'firebase/empty-import';
/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  firedata = firebase.database().ref('message');
  mypicref=firebase.storage().ref('message');
  id:any;
  chatMsg=[];
  chatDate=[];
  chatUser=[];
  chatImage=[];
  image='';
  imageUrl='';
  text:any;
  now='';
  log_cnt:any;
  admin_id="01079998598";
  room_user="01023393927";
  deviceId='';
  lloading:any;

  pre_diffHeight = 0;
  bottom_flag = true;
  chat_on_scroll = function(){
  };

  constructor(public loading:LoadingController, public http:Http, private photoViewer: PhotoViewer, public platform:Platform,public modal:ModalController,private camera: Camera,public afDatabase : AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    // localStorage.setItem('id','01023393927');
    this.id=localStorage.getItem("id");
    // this.id="01079998598";
    
    console.log(this.id)
    this.chatMsg=[];
    this.chatDate=[];
    this.chatUser=[];
    this.chatImage=[];
    this.log_cnt=0;

    if(this.id===this.admin_id) this.room_user="01023393927";
    else this.room_user=this.id;
    console.log(this.room_user);

    var firetemp:any;
    if(this.id===this.admin_id) firetemp=firebase.database().ref('users').child(this.room_user);
    else firetemp=firebase.database().ref('users').child(this.admin_id)
    //080 262 0100

    firetemp.once('value').then((snap)=>{
      console.log(snap.val());
      this.deviceId=snap.val().deviceId;
    })

    this.firedata.child(this.room_user).once('value',(snapshots) =>{
      this.read_log(snapshots)
    })

    this.firedata.child(this.room_user).on('value',(snapshots) =>{
      this.read_log(snapshots)
    })
  }

  read_log(snapshots){
    console.log(snapshots.val())
    var cnt=0;
    snapshots.forEach(element => {
      if(this.log_cnt>cnt){}
      else{
        this.chatUser.push(element.val().user);
        this.chatMsg.push(element.val().text);
        this.chatDate.push(element.val().date);
        this.chatImage.push(element.val().image);
        console.log(element.val())
      }
      cnt++;
    })
    console.log(this.chatUser);
    console.log(this.chatMsg);
    console.log(this.chatDate);
    console.log(this.chatImage);
    this.log_cnt=cnt;
    // var objDiv = document.getElementById("chat-area");
    // objDiv.scrollTop = objDiv.scrollHeight;
  }

  pad(n, width):String{
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
  }

  now_time(){
    var time=new Date();
    this.now=
    this.pad(time.getFullYear(),4)+'-'+this.pad((time.getMonth()+1),2)+'-'+this.pad(time.getDate(),2)
    +'|'+
    this.pad(time.getHours(),2)+':'+this.pad(time.getMinutes(),2)+':'+this.pad(time.getSeconds(),2)+':'+this.pad(time.getMilliseconds(),3);
    console.log(this.now)
  }

  clicked(image){
    this.photoViewer.show(image);
  }
  
  async takeFoto(){
    let modal = this.modal.create(CameraselectPage);
    modal.onDidDismiss(data => {
      if(data!=undefined){
        console.log(data);
        this.image=data;

        this.uploadImageToFirebase(data);
      }
    });
    modal.present();
  }
  
  upload(mode){
    if(mode===0){
      this.now_time();
      this.upload(2);
    }
    else if(mode===1){
      this.imageUrl='';
      if(this.image!=''){
        this.uploadImage(this.image)
        console.log(this.imageUrl)
        console.log('up ok')
        this.image='';
      }
      else this.upload(0);
    }
    else if(mode===2){
      this.firedata.child(this.room_user).child(this.now).update(
        {
          user:this.id,
          text:this.text,
          date: this.now,
          image:this.imageUrl,
        }
      ).then(()=>{
        this.text='';
        console.log('upload ok')
      });
      this.upload(3);
    }
    else if(mode===3){
      this.send_push(this.text,this.imageUrl);
    }
  }

  loading_on(){
    this.lloading = this.loading.create({
      spinner: 'hide',
      content: 'Loading Please Wait...'
    });
    this.lloading.present();
  }

  loading_off(){
    this.lloading.dismiss()
  }

  uploadImageToFirebase(image){
    console.log("upload iamge to firebase");
    console.log(image);
  }

  uploadImage(imageURI){
    let storageRef = firebase.storage().ref('message');
    // var result="design"+'1';
    // this.now_time();
    console.log(imageURI);
    imageURI=  "data:image/png;base64," + imageURI;
    console.log("sssssssssss : "+this.now);
    console.log(imageURI);
    console.log("donE!!!!!!!!!!")

    this.mypicref=firebase.storage().ref('message');
    // this.key=this.firemain.child("list").push().key;
    var a = this.mypicref.child(this.id).child(this.now);

    this.loading_on();
    this.encodeImageUri(imageURI, (image64)=>{
      a.putString(image64, 'data_url')
      .then(snapshot => {
        this.mypicref.child(this.id).child(this.now).getDownloadURL().then((url)=>{
          console.log("download url is : "+url);
          this.imageUrl=url;
          // this.image
          this.loading_off();
          this.upload(0)

          // window.alert("사진업로드 완료!")

        }).catch((e)=>{
          console.log('eeeee');
          console.log(e);
        })
       
      }).catch((e)=>{
        console.log("error is....")
        window.alert(e);
        console.log(e);
      })
    })
  }
  
  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/png");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  send_push(text,url){
    console.log('ready');

    console.log("sendpushnotification")
    console.log(this.deviceId)
    let data={
      "app_id": "6505b348-1705-4d73-abe4-55ab40758266",
      "include_player_ids": [this.deviceId],
      "headings":{"en":this.id},
      "ios_badgeType":"Increase",
      "ios_badgeCount":1,
      "data": {"welcome": "pdJung", "store":'this.store'},
      "contents": {"en": text},
      "big_picture":url,
    }
    console.log(data);
    let headers = new Headers({ 'Content-Type': 'application/json','Authorization':'Basic MDMzN2UxYjUtYzNiOS00YmY5LThjNDUtYzAyYmMwOTkwMTMw' });
    let options = new RequestOptions({headers:headers});
    this.http.post('https://onesignal.com/api/v1/notifications', JSON.stringify(data), options).toPromise().then((e)=>{
      console.log("then come")
      console.log(e);
    }).catch((e)=>{
      console.log('error');
      console.log(e);
    })
  }
}