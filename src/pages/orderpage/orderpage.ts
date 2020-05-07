import { Component } from '@angular/core';
import { IonicPage,Platform,AlertController,ViewController,NavController, NavParams, ModalController } from 'ionic-angular';
import firebase from 'firebase';
import * as $ from 'jquery'
import { IamportCordova ,PaymentObject} from '@ionic-native/iamport-cordova';
import { DeliveryAreaPage } from '../delivery-area/delivery-area';
import {HomePage } from '../home/home'
import { PaymentPage } from '../payment/payment';
import { DatePicker } from '@ionic-native/date-picker/ngx';

/**
 * Generated class for the OrderpagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orderpage',
  templateUrl: 'orderpage.html',
})
export class OrderpagePage {
  arraylist=[]
  src:any;

  sale_data:any;

  newcount:any=0;
  selected:any;
  count:any=0;
  coins:any;
  firemain = firebase.database().ref();
  lastchecked:any;
  gamearray=[];
  user:any;
  hardware:any;
  postcode:any;
  pricetopay=0;
  discount=0;
  address:any;
  diff:any;
  totalprice:any;
  point:any;
  startDate:any;
  endDate:any;
  startDate_text:any;
  endDate_text:any;
  tomorrowflag:any;

  Delivery:any;
  Delivery_check=false;

  resultAddress : any;
  peripheral:any;
  periArr=[];
  peripheralname:any;
  choiceperi=[];

  datecheck(mode,date):boolean{
    
    var t=new Date();
    var t2=new Date(date);
    var a=t.getTime()-t2.getTime();
    console.log(a);

    if(mode===1&&t.getHours()>14&&t.getDate()===t2.getDate()){
      this.confirmAlert2('오후 2시 이전 주문시만 당일 주문 가능합니다.')
      return false;
    }

    if(a/(1000*3600*24)>0){
      console.log(a/(1000*3600*24))
      
      if(mode===1) this.confirmAlert2('대여일이 오늘보다 빠를수는 없습니다.')
      else this.confirmAlert2('반납일이 오늘보다 빠를수는 없습니다.')

      return false
    }
    else return true;
  }

  datechange(mode){
    console.log(this.startDate);
    console.log(this.startDate_text)

    console.log(this.endDate)
    var a = new Date(this.startDate);
    var b = new Date(this.endDate);
    console.log(a);
    console.log(b);
    var diff=a.getTime()-b.getTime();
    var Difference_In_Days = diff / (1000 * 3600 * 24);
    diff=Difference_In_Days
    console.log(diff)
    diff=Math.floor(diff);
    diff=Math.abs(diff);
    this.diff=diff+1;
    console.log(this.diff)

    if(Difference_In_Days>0){
      if(mode===1){
        this.confirmAlert2("대여 시작일이 반납일보다 늦을 수는 없습니다.")
        var a=new Date();
        if(this.tomorrowflag===true) a.setDate(a.getDate()+1);
        this.startDate=a.toISOString();
        this.startDate_text=(a.getFullYear())+'-'+(a.getMonth()+1)+'-'+(a.getDate());
      }
      else {
        this.confirmAlert2("반납일이 대여 시작일보다 빠를 수는 없습니다.")
        var a=new Date(this.startDate);
        a.setDate(a.getDate()+2);
        this.endDate=a.toISOString();
        this.endDate_text=(a.getFullYear())+'-'+(a.getMonth()+1)+'-'+(a.getDate());
      }
      this.datechange(mode)
    }
    else{
      if(Difference_In_Days>-2){
        this.confirmAlert2("최소 대여기간은 3일 입니다.")
        if(mode===1){
          var a=new Date();
          if(this.tomorrowflag===true) a.setDate(a.getDate()+1);
          // a.setDate(a.getDate()+2);
          this.startDate=a.toISOString();
          this.startDate_text=(a.getFullYear())+'-'+(a.getMonth()+1)+'-'+(a.getDate());
        }
        else{
          var a=new Date(this.startDate);
          // if(this.tomorrowflag===true) a.setDate(a.getDate()+1);
          a.setDate(a.getDate()+2);
          this.endDate=a.toISOString();
          this.endDate_text=(a.getFullYear())+'-'+(a.getMonth()+1)+'-'+(a.getDate());
        }
        this.datechange(mode);
      }
      else if(Difference_In_Days<-179){
        this.confirmAlert2("최대 대여기간은 180일 입니다.")
        var a=new Date(this.startDate);
        a.setDate(a.getDate()+179);
        this.endDate=a.toISOString();
        this.endDate_text=(a.getFullYear())+'-'+(a.getMonth()+1)+'-'+(a.getDate());
        this.datechange(mode);
      }
      else{
        if(mode===1){
          this.startDate=a.toISOString();
          this.startDate_text=(a.getFullYear())+'-'+(a.getMonth()+1)+'-'+(a.getDate());
        }
        else{
          this.endDate=b.toISOString();
          this.endDate_text=(b.getFullYear())+'-'+(b.getMonth()+1)+'-'+(b.getDate());
        }
      }
    }
  }

  pick_date(mode){
    var temp:any;
    if(mode===1) temp=new Date(this.startDate);
    else if(mode===2) temp=new Date(this.endDate);
    this.datePicker.show({
      date: temp,
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
    }).then(
      date =>{
        console.log('Got date: ', date);
        if(this.datecheck(mode,date)===true){
          if(mode===1) this.startDate=date;
          else if(mode===2) this.endDate=date;
          this.datechange(mode);
        }
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  constructor(public platform:Platform,public alertCtrl:AlertController,public v:ViewController,public navCtrl: NavController, public navParams: NavParams,public modal:ModalController,public datePicker:DatePicker) {

    let backAction =  platform.registerBackButtonAction(() => {
      console.log("second");
      this.navCtrl.pop();
      backAction();
    },2)
    this.sale_data=this.navParams.get("sale");
    this.startDate=this.navParams.get("startDate");
    this.endDate=this.navParams.get("endDate");
    this.tomorrowflag=this.navParams.get("tomorrowflag");
    this.user=this.navParams.get("user");
    console.log(this.user);
    this.point=this.user.point
    this.diff=this.navParams.get("diff");
    this.hardware=this.navParams.get("hardware");
    this.gamearray=this.navParams.get("gamearray")
    this.peripheral=this.navParams.get("peripheral");
    this.peripheralname=this.navParams.get("peripheralname");
    console.log(this.peripheral); // 주변기기
    console.log(this.sale_data)
    console.log(this.user); //대여인
    console.log(this.point);
    console.log(this.diff); //대여일
    console.log(this.hardware); //기계
    console.log(this.gamearray); //게임에 대해
    console.log(this.peripheralname);

    
    var date=new Date(this.startDate);
    this.startDate_text=((date.getFullYear())+'-'+(date.getMonth()+1)+'-'+date.getDate());

    date=new Date(this.endDate);
    this.endDate_text=((date.getFullYear())+'-'+(date.getMonth()+1)+'-'+date.getDate());

    for(var name in this.peripheral){
      console.log(this.peripheral[name]);
      console.log(this.peripheralname[name]);
      for(var periname in this.peripheralname){
        if(this.peripheralname[periname]==this.peripheral[name].name){
          console.log(this.peripheral[name]);
          if(this.peripheral[name].stock != "0"){
            console.log(this.peripheral[name].stock);
            this.choiceperi.push(this.peripheral[name]);
          }
          else if(this.peripheral[name].stock == "0"){
            console.log(this.peripheral[name].stock);
            this.confirmAlert2(this.peripheral[name].name+"의 재고가 없습니다.")
          }
        }
      }
    
    }
    console.log(this.choiceperi);
    
    
    for(var k in this.user){
      console.log(k);
      if(k=='adress'){
        console.log(this.user[k].adress);
        this.resultAddress = this.user[k].adress;
        this.Delivery=this.user[k];
        if(this.resultAddress===undefined) this.Delivery_check=false;
        else this.Delivery_check=true;
      }
    }
    console.log(this.resultAddress);
    console.log(this.Delivery)
    var a = 0;
    for(var i=0; i<this.gamearray.length; i++){
      a+=this.gamearray[i].price*this.diff;
    }
    var b = 0;
    if(this.hardware!=undefined){
      b=this.hardware.pricedaily*this.diff;

      console.log(b+"game price total is : "+a);
    }

    console.log(this.startDate);
    console.log(this.endDate);
    console.log(this.diff);
    console.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ')
    
    console.log(this.user);
    this.coins=this.user.points;

    console.log(this.hardware);
    console.log(this.gamearray)
    console.log("total price is : "+(Number(a)+Number(b)));
    this.totalprice=(Number(a)+Number(b));
    this.pricetopay=this.totalprice;
  }
  goback(){
    this.v.dismiss();
  }

  godown(){
    console.log("ccccclicked")
    console.log(this.coins);
  }
  
  clickcoin(){
    console.log("clicked")
    console.log(this.coins);
    if(this.coins==0){
      this.confirmAlert2("모든 코인을 사용하였습니다.")
    }
    else{
      this.coins=this.coins+1;
      this.discount+=1000
      this.pricetopay=this.totalprice-this.discount;
      setTimeout(() => {
        $('#abc').animate({
          bottom: '+=10'
        }, 100,
          function(){
            console.log('done')
            $('#abc').animate({
              bottom: '-=10'
            }, 100,function(){
              console.log('done')
            })
          }
        )
      },10);
    }
  }
  
  goup(){
    console.log("clicked")
    console.log(this.coins);

    if(this.coins>0){
      this.coins=this.coins-1;
      this.discount+=1000
      this.pricetopay=this.totalprice-this.discount;
    }
    else{
      // window.alert("모든 코인을 사용하였습니다.")
    }
  }

  number_format(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
  }

  Delivery_area(){
    this.navCtrl.push(DeliveryAreaPage,{'user':this.user,"Delivery":this.Delivery}).then(() => {
      this.navCtrl.getActive().onDidDismiss(data => {
        if(data){
          this.Delivery=data;
          this.resultAddress=this.Delivery.adress;
          this.Delivery_check=true;
        }
      })
    })
  }

  btnclicked(){
    var a =  $("#a").val();
    var b =  $("#b").val();
    var c =  $("#c").val();

    this.postcode=a;
    this.address=b;
  }
  gotoback(){
    this.v.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderpagePage');
  }
  view(i) {
    //0번째 선택 , 1번째 선택
    // 0번째 선택되면

    if(this.lastchecked==undefined){
      this.lastchecked=-1;
    }
    this.selected=i;
    if(this.lastchecked==i){
      this.count++;
      //클릭한거 또 클릭함
     
      if(this.count%2==0){
        this.selected=i;

        this.count=0;
        
      }else{
        this.selected=-1;

      }
      //already clicked
    }else{
      //새로운거 클릭함.
      this.count=0;
      this.newcount++;
      if(this.newcount%2==0){
       
        this.selected=1;

      }else{
        this.selected=i;

        this.newcount=0;

      }
    }
   

    this.lastchecked=i;
    console.log(this.selected+"is selected")
  }

  stock(ch1,ch2,n){
    ch1.child(ch2).update({stock:String(n-1)})
  }

  orderpage(){
    
    // stock

    // this.firemain.child('category').once('value').
    var a = this.firemain.child("category").child(this.gamearray[0].flag)
    
    a.child('software').once("value",(snap)=>{
      for(var q in this.gamearray){
        for(var w in snap.val()){
          if(this.gamearray[q].name===snap.val()[w].name){
            this.stock(a.child('software'),w,Number(snap.val()[w].stock))
          }
        }
      }
    })

    a.child('hardware').once("value",(snap)=>{
      for(var w in snap.val()){
        if(this.hardware.name===snap.val()[w].name){
          this.stock(a.child('hardware'),w,Number(snap.val()[w].stock))
        }
      }
    })
    
    this.confirmAlert2('결재완료')

    // var data = {
    //   pay_method : 'card',
    //   merchant_uid: 'mid_' + new Date().getTime(),
    //   name : 'Ming 코인충전',
    //   amount : this.pricetopay+"",
    //   app_scheme : 'ionickcp',
    //   buyer_email : 'iamport@siot.do',
    //   buyer_name : '구매자이름',
    //   buyer_tel : '010-1234-5678',
    //   buyer_addr : '서울특별시 강남구 삼성동',
    //   buyer_postcode : '123-456'
    // };


    // var PaymentObject={
    //   userCode: "imp58611631",
    //   data: data,
    //   callback:(response)=> {
    //     console.log(response);
    //     if(response.imp_success=="true"){
    //       console.log("success")
    //       console.log(this.gamearray);
    //       console.log(this.hardware);
    //       console.log(this.totalprice);
    //       var now=new Date();
    //       var year=now.getFullYear();
    //       var month=now.getMonth()+1;
    //       var date=now.getDate();
    //       var hour=now.getHours();
    //       var min=now.getMinutes();
    //       var nnow=year+"-"+month+"-"+date+" "+hour+":"+min;
    //       console.log(nnow);
    //       if(this.hardware!=undefined){
    //         var k=this.firemain.child("users").child(this.user.phone).child("orderlist").push().key;
    //         this.firemain.child("users").child(this.user.phone).child("orderlist").child(k).update({"phone":this.user.phone,"key":k,"status":"paid","startDate":this.startDate,"endDate":this.endDate,"diff":this.diff,"orderdate":nnow,"game":this.gamearray,"hardware":this.hardware,"totalprice":this.totalprice,"discount":this.discount,"payment":this.pricetopay}).then(()=>{
    //           this.confirmAlert2("<p>주문이 완료되었습니다.</p><p>마이 페이지에서 상세내역 확인이 가능합니다.</p>");
    //           this.firemain.child("users").child(this.user.phone).update({"points":this.coins})
    //           this.navCtrl.setRoot(HomePage);
    //         }).catch((e)=>{
    //           console.log(e);
    //         })
  
    //       }else{

    //         var k=this.firemain.child("users").child(this.user.phone).child("orderlist").push().key;
    //         this.firemain.child("users").child(this.user.phone).child("orderlist").child(k).update({"phone":this.user.phone,"key":k,"status":"paid","startDate":this.startDate,"endDate":this.endDate,"diff":this.diff,"orderdate":nnow,"game":this.gamearray,"totalprice":this.totalprice,"discount":this.discount,"payment":this.pricetopay}).then(()=>{
    //           this.confirmAlert2("<p>주문이 완료되었습니다.</p><p>마이 페이지에서 상세내역 확인이 가능합니다.</p>");
    //           this.firemain.child("users").child(this.user.phone).update({"points":this.coins})
    //           this.navCtrl.setRoot(HomePage);
    //         }).catch((e)=>{
    //           console.log(e);
    //         })
    //       }
    //     }
    //   },
    // }
        
    
    // // 아임포트 관리자 페이지 가입 후 발급된 가맹점 식별코드를 사용
    // IamportCordova.payment(PaymentObject )
    //   .then((response)=> {
    //     alert("success")
    //     alert(JSON.stringify(response))
    //   })
    //   .catch((err)=> {
    //     alert(err)
    //   })
    // ;
  }

  confirmAlert2(str) {
    let alert = this.alertCtrl.create({      
        subTitle: str,
        buttons: [  
        {
          text: '확인',
          handler: () => {
            console.log('Buy clicked');
          }
        }],
        cssClass: 'alertDanger'
    });
    alert.present({animate:false});
  }

  payment(){
    console.log(this.resultAddress);
   
    if(this.Delivery_check===false){
      this.confirmAlert2('어디로 밍을 해야할지 몰라요....');
    }
    else if(this.resultAddress.indexOf("전북 전주")==1 || this.resultAddress.indexOf("전북 익산")==1){
      console.log("전주");
      this.confirmAlert2("현재 전주와 익산 지역만 배송이 가능합니다.<br>주소를 확인해주세요.");
    }
    else {
      this.navCtrl.push(PaymentPage,{"user":this.user, "diff":this.diff, "hardware":this.hardware,"peripheral":this.choiceperi, "game":this.gamearray ,"start":this.startDate, "end":this.endDate,"sale":this.sale_data});
    }

    /*  console.log(this.user); //대여인
    console.log(this.point);
    console.log(this.diff); //대여일
    console.log(this.hardware); //기계
    console.log(this.gamearray); //게임에 대해 */
  }
}
