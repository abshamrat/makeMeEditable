(function(){
    this.MakeMeEditable = function() {
        this.hoverClass = "mme";
        if (arguments[0] && typeof arguments[0] == "object") {
            this.elemIdToEditable = arguments[0].elemIdToEditable;
            this.endPoint = arguments[0].endPoint;
            this.postParamName = arguments[0].postParamName;
            this.isTextArea = arguments[0].isTextArea || false;
            this.hoverBG = arguments[0].hoverBG || "#f1f1f1";
        }
        init.call(this);
    }
    function init(){
        this.isEnabled = false;
        this.element = document.getElementById(this.elemIdToEditable);
        this.elementOldTxt = this.element.innerHTML;
        this.element.addEventListener('click', makeEditable.bind(this), true);
        appendStyle.call(this);
    };
    function makeEditable() {
        if (this.isEnabled) {
            return;
        }
        this.isEnabled = true;
        if (this.isTextArea) {
            this.textArea = document.createElement('textarea');
        } else {
            this.textArea = document.createElement('input');
        }
        this.textArea.rows = "3";
        this.textArea.cols = "35";

        this.saveBtn = document.createElement('button');
        this.cancelBtn = document.createElement('button');
        this.br = document.createElement('br');

        this.saveBtn.className = 'mme-save';
        this.saveBtn.innerHTML = 'Save';
        this.cancelBtn.className = 'mme-cancel';
        this.cancelBtn.innerHTML = 'Cancel';
        
        this.element.innerHTML = '';
        this.element.appendChild(this.textArea);
        this.element.appendChild(this.br);
        this.element.appendChild(this.cancelBtn);
        this.element.appendChild(this.saveBtn);
 
        this.cancelBtn.addEventListener('click', cancelEditing.bind(this));
        this.saveBtn.addEventListener('click', saveChanges.bind(this));
    }
    function saveChanges() {
        var data = {[this.postParamName]:this.textArea.value };
        POST.apply(this, [data, updateSuccessfully, updateError]);
        this.elementNewText = this.textArea.value;
        this.isEnabled = false;
    }
    function cancelEditing() {
        this.element.innerHTML = this.elementOldTxt;
        this.isEnabled = false;
    }
    function appendStyle() {
        var classDef = '.mme{ cursor: pointer; transition: all 0.4s; } .mme:hover{ background-color: '+this.hoverBG+'} .mme-textarea{  resize: both;overflow: auto;}';
        var styleId = this.hoverClass;
        var style = document.createElement('style');
        var existingStyle = document.querySelector("#"+styleId);
        if (!existingStyle) {
            style.type = 'text/css';
            style.id = styleId;
            if (style.styleSheet) {
                style.styleSheet.cssText = classDef;
            } else {
                style.appendChild(document.createTextNode(classDef));
            }
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        this.element.className = this.hoverClass;   
    }
    function POST(data, success, error) {
        var xmlHttp = new XMLHttpRequest();
        var self = this;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                success.call(self);
            } else {
                error.call(self);
            }
        }
        xmlHttp.open("POST", this.endPoint, true); // true for asynchronous 
        // xmlHttp.setRequestHeader(this.xHeader,this.xHeadParam);
        xmlHttp.send(JSON.stringify(data));
    };
    function updateSuccessfully() {
        this.element.innerHTML = this.elementNewText;
    }
    function updateError() {
        this.element.innerHTML = this.elementOldTxt;
    }

}());