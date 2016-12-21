/**
 * Created by mike on 21/12/16.
 */

   var i = 0;

   function prochain() {
       i = i + 1;
       var request = new XMLHttpRequest();

       request.onreadystatechange = function () {
           if (this.readyState == 4 && this.status == 200) {
               var divID = document.getElementById("ceci");
               divID.innerHTML = this.responseText;
           }
           if (this.readyState == 4 && this.status == 404) {
               console.log(404);
           }
       };
       request.open("GET", i + ".html", true);
       request.send();
   }

   function precedent() {
       i = i - 1;
       var request = new XMLHttpRequest();

       request.onreadystatechange = function () {
           if (this.readyState == 4 && this.status == 200) {
               var divID = document.getElementById("ceci");
               divID.innerHTML = this.responseText;
           }
           if (this.readyState == 4 && this.status == 404) {
               console.log(404);
           }
       };
       request.open("GET", i + ".html", true);
       request.send();
   }