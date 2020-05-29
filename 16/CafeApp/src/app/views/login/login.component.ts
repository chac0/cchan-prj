import {Component, Inject, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { OverlaySpinnerServiceService } from '../../services/ui/overlay-spinner/overlay-spinner-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  email: string;
  password: string;
  user: Observable<firebase.User>;

  loginErrorMsg = 'ログインできませんでした\nメールアドレスとパスワードをご確認ください';

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private overLaySpinner: OverlaySpinnerServiceService
              ) {

  }

  ngOnInit() {

    this.user = this.authService.userData;
    // ユーザデータが存在すれば、product_listに遷移します
    this.user.subscribe(u => {
      this.router.navigate(['/product_list'] );
    });
    this.form = this._buildForm();
  }

  //--------------------------
  // フォームを用意
  //--------------------------
  private _buildForm(): FormGroup {
    return this.fb.group({
      fbemail: ['', [Validators.required]],
      fbpwd: ['', Validators.compose([Validators.maxLength(128), Validators.required])]
    });
  }

  //--------------------------
  // サインイン実行
  //--------------------------
  submit(form: FormGroup) {
    this.signIn();
  }

  //--------------------------
  // メールアドレス取得
  //--------------------------
  get fbemail() {
    return <FormControl>this.form.get('fbemail');
  }

  //--------------------------
  // パスワード取得
  //--------------------------
  get fbpwd() {
    return <FormControl>this.form.get('fbpwd');
  }

  //--------------------------
  // 登録
  //--------------------------
  signUp() {
    this.authService.SignUp(this.email, this.password);
  }


  //--------------------------
  // サインイン
  //--------------------------
  signIn() {
    //loading表示
    this.overLaySpinner.show();
    this.authService.Login(this.email, this.password)
    .then(()=>{
      //loading非表示
      this.overLaySpinner.hide();
      this.router.navigate(['/product_list'] );
    })
    .catch(()=>{
      //loading非表示
      this.overLaySpinner.hide();
    })

  }
  //--------------------------
  // サインアウト
  //--------------------------
  signOut() {
    this.authService.SignOut();
  }

}