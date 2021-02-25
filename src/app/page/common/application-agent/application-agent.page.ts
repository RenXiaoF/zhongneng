import { Component, OnInit, ViewChild } from '@angular/core';
import { NativeService, Utils, Api } from 'src/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-agent',
  templateUrl: './application-agent.page.html',
  styleUrls: ['./application-agent.page.scss'],
})
export class ApplicationAgentPage implements OnInit {
  @ViewChild('imgFile', { static: false }) imgFile: any;


  constructor(
    private native: NativeService,
    public api: Api,
    public nativeservice: NativeService,
    private router: Router,


  ) {}

  public agentInfo = {
    'content': "",//公司名称
    'mobile': "",//联系手机
    'wechat': "",//微信联系方式
    // 'qr_code': "",//收款码
  };



  ngOnInit() {
  }

  submit(){
    console.log(this.agentInfo);
    let reg=/^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/
    
    if(this.agentInfo.mobile == ""){
      this.nativeservice.showToastTips('请输入手机号码！');
      return
    }else if(!reg.test(this.agentInfo.mobile)){
      this.nativeservice.showToastTips('请输入正确的手机号码！');
      return
    }else{
      this.api.postFormData('User/applicationAgent', this.agentInfo).subscribe((res: any) => {
        if(res.status == 200){
          this.nativeservice.showToastTips('提交成功！');
          this.goback();

        }else{
          this.nativeservice.showToastTips(res.msg);
        } 
      })
    }

    
  }

  goback(){
    this.router.navigate(["tabs/mine"]);

  }

}
