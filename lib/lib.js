Date.prototype.getCompleteDate = function (){
    let str='';
    str += this.getFullYear().toString();
    str += '-';
    if(this.getMonth() <= 9) str += '0' + (this.getMonth() + 1).toString(); 
    else str += (this.getMonth() + 1).toString();
    str += '-';
    if(this.getDate() <= 9) str += '0' + this.getDate().toString();
    else str += this.getDate().toString();
    str += ' ';
    if(this.getHours() <= 9) str += '0' + this.getHours().toString();
    else str += this.getHours().toString();
    str += ':';
    if(this.getMinutes() <= 9) str += '0' + this.getMinutes().toString();
    else str += this.getMinutes().toString();
    str += ':';
    if(this.getSeconds() <= 9) str += '0' + this.getSeconds().toString();
    else 
    str += this.getSeconds().toString();
    str += '.000Z';
    return str;
}
module.exports.Date = Date;