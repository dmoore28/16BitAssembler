import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "assembler";
  input: string;
  type: string;
  isValid: boolean = true;
  binaryInstruction: string;
  hexInstruction: string;
  rType = {
    add: "0000",
    sub: "0001",
    and: "0010",
    or: "0011",
    xor: "0100",
    nand: "0101",
    nor: "0110",
    xnor: "0111",
    cmp: "1000",
    jmp: "1001",
    callr: "1010",
    ret: "1011"
  };
  iType = { addi: "011", ori: "100", orhi: "101", ldw: "001", stw: "010" };
  bType = { br: "0000", beq: "0001", bne: "0010", bgeu: "0011", bltu: "0100", bgtu: "0101", bleu: "0110", bge: "0111", blt: "1000", bgt: "1001", ble: "1010" };
  jType = { call: "111" };

  GetInstruction() {
    if (!this.input) {
      this.reset();
      return;
    }
    if(!this.input.includes(',')){
      this.reset();
      this.isValid = false;
      return;
    }
    this.reset();
    this.isValid = true;
    let parts = this.input.replace(/,/g, "").split(" ");
    if (parts[0] in this.rType) {
      this.type = "R-Type";
      if (parts[0] == "cmp") {
        let rs = this.pad((parseInt(parts[1].replace("r", "")) >>> 0).toString(2), 3);
        let rt = this.pad((parseInt(parts[2].replace("r", "")) >>> 0).toString(2), 3);
        let rd = this.pad((parseInt("0") >>> 0).toString(2), 3);
        this.binaryInstruction = rs + rt + rd + this.rType[parts[0]] + "000";
        this.hexInstruction = parseInt(this.binaryInstruction, 2).toString(16).toUpperCase();
      }
      else if (parts.length != 4) {
        this.isValid = false;
      } else {
        let rs = this.pad((parseInt(parts[2].replace("r", "")) >>> 0).toString(2), 3);
        let rt = this.pad((parseInt(parts[3].replace("r", "")) >>> 0).toString(2), 3);
        let rd = this.pad((parseInt(parts[1].replace("r", "")) >>> 0).toString(2), 3);
        this.binaryInstruction = rs + rt + rd + this.rType[parts[0]] + "000";
        this.hexInstruction = parseInt(this.binaryInstruction, 2).toString(16).toUpperCase();
      }
    } else if (parts[0] in this.iType) {
      this.type = "I-Type";
      if (parts.length < 3 || parts.length > 4) {
        this.isValid = false;
      } else if (parts.length == 4) {
        let rs = this.pad((parseInt(parts[2].replace("r", "")) >>> 0).toString(2), 3);
        let rd = this.pad((parseInt(parts[1].replace("r", "")) >>> 0).toString(2), 3);
        let immediate = this.pad((parseInt(parts[3].replace("r", "")) >>> 0).toString(2), 7);
        this.binaryInstruction = rs + rd + immediate + this.iType[parts[0]];
        this.hexInstruction = parseInt(this.binaryInstruction, 2).toString(16).toUpperCase();
      } else {
        let rs = this.pad((parseInt(parts[2].split('r')[1].replace(")", "")) >>> 0).toString(2), 3);
        let rd = this.pad((parseInt(parts[1].replace("r", "")) >>> 0).toString(2), 3);
        let immediate = this.pad((parseInt(parts[2].split('(')[0]) >>> 0).toString(2), 7);
        this.binaryInstruction = rs + rd + immediate + this.iType[parts[0]];
        this.hexInstruction = parseInt(this.binaryInstruction, 2).toString(16).toUpperCase();
      }
    } else if (parts[0] in this.bType) {
      this.type = "B-Type";
      if (parts.length != 2) {
        this.isValid = false;
      } else {
        let immediate = this.pad((parseInt(parts[1]) >>> 0).toString(2), 9);
        this.binaryInstruction = immediate + this.bType[parts[0]] + "110";
        this.hexInstruction = parseInt(this.binaryInstruction, 2).toString(16).toUpperCase();
      }
    } else if (parts[0] in this.jType) {
      this.type = "J-Type";
      if (parts.length != 2) {
        this.isValid = false;
      } else {
        let immediate = this.pad((parseInt(parts[1]) >>> 0).toString(2), 13);
        this.binaryInstruction = immediate + this.jType[parts[0]];
        this.hexInstruction = parseInt(this.binaryInstruction, 2).toString(16).toUpperCase();
      }
    } else {
      this.isValid = false;
    }

    this.binaryInstruction = "0b" + this.binaryInstruction;
    this.hexInstruction = "0x" + this.hexInstruction;
  }

  pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  clear() {
    this.input = null;
    this.isValid = true;
    this.binaryInstruction = null;
    this.hexInstruction = null;
    this.type = null;
  }

  reset() {
    this.isValid = true;
    this.binaryInstruction = null;
    this.hexInstruction = null;
    this.type = null;
  }
}
