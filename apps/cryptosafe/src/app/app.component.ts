import { Component, Inject, OnInit } from '@angular/core';
import * as Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import { ethers } from 'ethers';
import { Observable, Observer, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

const GREETER_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

@Component({
  selector: 'deadchain-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'CryptoSafe';
  ethereum;
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  contract;

  greetingControl = new FormControl({ value: '', disabled: true });

  private destroy$ = new Subject();

  constructor(@Inject('window') private window) {
    this.ethereum = window.ethereum;

    if (this.ethereum) {
      this.requestAccount().pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.provider = new ethers.providers.Web3Provider(this.ethereum);
          this.signer = this.provider.getSigner();
          this.contract = new ethers.Contract(GREETER_ADDRESS, Greeter.abi, this.signer);

          this.greetingControl.enable();
        });
    }
  }

  saveGreeting() {
    if (this.greetingControl.invalid) return;

    const value = this.greetingControl.value;

    if (!value) return;

    this.contract.setGreeting(value).then(transaction => {
      transaction.wait().then(() => {
        this.fetchGreeting();
      });
    });
  }

  requestAccount(): Observable<void> {
    return new Observable((ob: Observer<void>) => {
      this.ethereum.request({ method: 'eth_requestAccounts', })
        .then(() => {
          ob.next();
          ob.complete();
        });
    });
  }

  fetchGreeting() {
    this.contract.greet().then(data => {
      console.log(`data: ${data}`);
    }, err => {
      console.error(err);
    });
  }

}
