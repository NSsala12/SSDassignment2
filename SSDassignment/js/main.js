$(document).ready(function(){

    var clientId = "1028898698703-91t3j8tod4urc0u8c9frduq7b1nmar9j.apps.googleusercontent.com";

    var redirectURI = "https://localhost/SSDassignment/upload.html";

    var projectScope = "https://www.googleapis.com/auth/drive";

    var url = "";


    //event click listener to the login button
    $("#signin").click(function(){
       signIn(clientId,redirectURI,projectScope,url);

    });

    function signIn(clientId,redirectURI,projectScope,url){

      //url the user will directed after sign in
       url = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri="+redirectURI
       +"&prompt=consent&response_type=code&client_id="+clientId+"&scope="+projectScope
       +"&access_type=offline";

       window.location = url;

    }



});