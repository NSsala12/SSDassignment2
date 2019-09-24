$(document).ready(function(){
    

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const redirectURI = "https://localhost/SSDassignment/upload.html"
    const clientSecret = "nm6E2zCAY9ObekUt9C4ERvFj";
    const scope = "https://www.googleapis.com/auth/drive";
    var access_token= "";
    var clientId = "1028898698703-91t3j8tod4urc0u8c9frduq7b1nmar9j.apps.googleusercontent.com";

    $.ajax({
        type: 'POST',
        url: "https://www.googleapis.com/oauth2/v4/token",
        data: {
            code:code,
            redirect_uri:redirectURI,
            client_secret:clientSecret,
            client_id:clientId,
            scope:scope,
            grant_type:"authorization_code"
        },
        dataType: "json",
        success: function(resultData) {
           
            //saving the access token in local storage
           localStorage.setItem("accessToken",resultData.access_token);
           localStorage.setItem("refreshToken",resultData.refreshToken);
           localStorage.setItem("expires_in",resultData.expires_in);
           window.history.pushState({}, document.title, "/SSDassignment/" + "upload.html");
         
        }
        
  });

    function stripQueryStringAndHashFromPath(url) {
        return url.split("?")[0].split("#")[0];
    }   

    var Upload = function (file) {
        this.file = file;
    };
    
    Upload.prototype.getType = function() {
        localStorage.setItem("type",this.file.type);
        return this.file.type;
    };
    Upload.prototype.getSize = function() {
        localStorage.setItem("size",this.file.size);
        return this.file.size;
    };
    Upload.prototype.getName = function() {
        return this.file.name;
    };

    // upload the files to google drive using google API service
    Upload.prototype.doUpload = function () {
        var that = this;
        var formData = new FormData();
        
        formData.append("file", this.file, this.getName());
        formData.append("upload_file", true);
    
        $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
                
            },
            url: "https://www.googleapis.com/upload/drive/v2/files",
            data:{
                uploadType:"media"
            },
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', that.progressHandling, false);
                }
                return myXhr;     
            },            
            success: function (data) {
                console.log(data);
            },
            error: function(error) {
                console.log(error);
            },
            async: true,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        });
    };
    
    Upload.prototype.progressHandling = function (event) {
        var percent = 0;
        var position = event.loaded || event.position;
        var total = event.total;
        var progress_bar_id = "#progress-wrp";
        if (event.lengthComputable) {
            percent = Math.ceil(position / total * 100);
        }
       
        $(progress_bar_id + " .progress-bar").css("width", +percent + "%");
        $(progress_bar_id + " .status").text(percent + "%");
    };

    $("#uploadFile").on("click", function (e) {
        var file = $("#files")[0].files[0];
        var upload = new Upload(file);

        upload.doUpload();
    });



    
});