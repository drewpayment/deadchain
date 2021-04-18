import { Component, Inject, OnInit } from '@angular/core';
import * as Greeter from '../artifacts/contracts/Greeter.sol/Greeter.json';
import * as Token from '../artifacts/contracts/Token.sol/Token.json';
import { ethers } from 'ethers';
import { Observable, Observer, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { coerceNumberProperty } from '@angular/cdk/coercion';

const GREETER_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const TOKEN_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

@Component({
  selector: 'dc-dapp',
  templateUrl: './dapp.component.html',
  styleUrls: ['./dapp.component.scss'],
})
export class DappComponent {
  ethereum;
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  greetingContract;
  tokenContract;
  account: string;

  greetingControl = new FormControl({ value: '', disabled: true });
  transferForm = this.createTransferForm();
  currentBalance = 0;

  private destroy$ = new Subject();

  constructor(
    @Inject('window') private window,
    private snack: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.ethereum = window.ethereum;

    if (this.ethereum) {
      this.requestAccount()
        .pipe(takeUntil(this.destroy$))
        .subscribe((account) => {
          this.account = account;
          this.provider = new ethers.providers.Web3Provider(this.ethereum);
          this.signer = this.provider.getSigner();
          this.greetingContract = new ethers.Contract(
            GREETER_ADDRESS,
            Greeter.abi,
            this.signer
          );
          this.tokenContract = new ethers.Contract(
            TOKEN_ADDRESS,
            Token.abi,
            this.signer
          );

          this.greetingControl.enable();
          this.transferForm.enable();

          this.getBalance();
        });
    }
  }

  saveGreeting() {
    if (this.greetingControl.invalid) return;

    const value = this.greetingControl.value;

    if (!value) return;

    this.greetingContract.setGreeting(value).then(
      (transaction) => transaction.wait().then(() => this.fetchGreeting()),
      (err) => {
        if (!err) return;

        this.snack.open(`${err.message}`, 'dismiss', {
          duration: 10000,
        });

        if (err.code == 4001) this.greetingControl.reset('');
      }
    );
  }

  requestAccount(): Observable<string> {
    return new Observable((ob: Observer<string>) => {
      this.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => {
          if (accounts && accounts.length) ob.next(accounts[0]);
          ob.complete();
        });
    });
  }

  fetchGreeting() {
    this.greetingContract.greet().then(
      (data) => {
        console.log(`data: ${data}`);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getBalance() {
    this.tokenContract.balanceOf(this.account).then((balance) => {
      console.log(`${balance}`);

      this.currentBalance = coerceNumberProperty(balance);
    });
  }

  sendCoins() {
    if (this.transferForm.invalid) return;
    const fv = this.transferForm.value;
    const userAccount = fv.toAcct;
    const amount = fv.amount;

    this.tokenContract.transfer(userAccount, amount).then((transaction) =>
      transaction.wait().then(
        () => {
          this.snack.open(
            `${fv.amount} coins successfully sent to ${fv.userAccount}`,
            'dismiss',
            {
              duration: 3500,
            }
          );
        },
        (err) => {
          console.dir(err);
        }
      )
    );
  }

  clear() {
    this.transferForm.reset({
      toAcct: '',
      amount: '',
    });
  }

  createTransferForm(): FormGroup {
    return this.fb.group({
      toAcct: this.fb.control({ value: '', disabled: true }, [
        Validators.required,
      ]),
      amount: this.fb.control({ value: '', disabled: true }, [
        Validators.required,
      ]),
    });
  }
}
