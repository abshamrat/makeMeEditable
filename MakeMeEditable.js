(function(){
    this.MakeMeEditable = function() {
        this.mmeClass = "mme";
        this.mmeLoader = "mme-loader";
        this.mmeTextArea = "textarea";
        this.mmeInput = "input";
        this.mmeButton = "button";
        this.mmeBr = "br";
        this.mmeStyle = "style";
        this.mmeStyleType = "text/css";
        this.htmlHead = "head";
        this.mmeRows = "3";
        this.mmeCols = "30";
        this.mmePositiveClass = "mme-Positive";
        this.mmeNegativeClass = "mme-Negative";
        this.mmePositiveName = "Save";
        this.mmeNegativeName = "cancel";
        this.mmePositivtEvent = "click";
        this.mmeNegativeEvent = "click";
        this.mmeEnabledEvent = "click";
        this.mmeUpdateMethod = "POST";
        if (arguments[0] && typeof arguments[0] == "object") {
            this.elemIdToEditable = arguments[0].elemIdToEditable;
            this.endPoint = arguments[0].endPoint;
            this.postParamName = arguments[0].postParamName;
            this.postParamKey = arguments[0].postParamKey;
            this.postParamKeyName = arguments[0].postParamKeyName || "id";
            this.isTextArea = arguments[0].isTextArea || false;
            this.hoverBG = arguments[0].hoverBG || "#f1f1f1";
        }
        init.call(this);
    }
    function init(){
        this.isEnabled = false;
        this.element = document.getElementById(this.elemIdToEditable);
        this.elementOldTxt = this.element.innerHTML;
        this.element.addEventListener(this.mmeEnabledEvent, makeEditable.bind(this), true);
        appendStyle.call(this);
    };
    function makeEditable() {
        if (this.isEnabled) {
            return;
        }
        this.isEnabled = true;
        if (this.isTextArea) {
            this.textArea = document.createElement(this.mmeTextArea);
        } else {
            this.textArea = document.createElement(this.mmeInput);
        }
        this.NegativeBtn = document.createElement(this.mmeButton);
        this.PositiveBtn = document.createElement(this.mmeButton);
        this.br = document.createElement(this.mmeBr);
        this.textArea.rows = this.mmeRows;
        this.textArea.cols = this.mmeCols;
        
        this.PositiveBtn.className = this.mmePositiveClass;
        this.PositiveBtn.innerHTML = this.mmePositiveName;
        this.NegativeBtn.className = this.mmeNegativeClass;
        this.NegativeBtn.innerHTML = this.mmeNegativeName;
        
        this.element.innerHTML = '';
        this.element.appendChild(this.textArea);
        this.element.appendChild(this.br);
        this.element.appendChild(this.NegativeBtn);
        this.element.appendChild(this.PositiveBtn);
 
        this.NegativeBtn.addEventListener(this.mmePositivtEvent, NegativeEditing.bind(this));
        this.PositiveBtn.addEventListener(this.mmeNegativeEvent, PositiveChanges.bind(this));
    }
    function PositiveChanges() {
        this.isEnabled = false;
        var data = {[this.postParamName]:this.textArea.value, [this.postParamKeyName]: this.postParamKey };
        POST.apply(this, [data, updateSuccessfully, updateError]);
        this.elementNewText = this.textArea.value;
    }
    function NegativeEditing() {
        this.element.innerHTML = this.elementOldTxt;
        this.isEnabled = false;
    }
    function appendStyle() {
        var classDef = `
            .mme{ 
                cursor: pointer; 
                transition: all 0.4s; 
            } 
            .mme:hover{ 
                background-color: ${this.hoverBG}
            } 
            .mme-textarea{  
                resize: both;
                overflow: auto;
            } 
            .mme-loader { 
                border: 8px solid #f3f3f3; /* Light grey */ 
                border-top: 8px solid #3498db; /* Blue */ 
                border-radius: 50%; 
                width: 30px; 
                height: 30px; 
                animation: spin 2s linear infinite; 
            } 
            @keyframes spin { 
                0% { transform: rotate(0deg); } 
                100% { transform: rotate(360deg); } 
            }`;
        var styleId = this.hoverClass;
        var style = document.createElement(this.mmeStyle);
        var existingStyle = document.querySelector("#"+styleId);
        if (!existingStyle) {
            style.type = this.mmeStyleType;
            style.id = styleId;
            if (style.styleSheet) {
                style.styleSheet.cssText = classDef;
            } else {
                style.appendChild(document.createTextNode(classDef));
            }
            document.getElementsByTagName(this.htmlHead)[0].appendChild(style);
        }
        this.element.className = this.hoverClass;   
    }
    function POST(data, success, error) {
        var xmlHttp = new XMLHttpRequest();
        this.element.className = this.mmeLoader;
        var _ = this;
        xmlHttp.onreadystatechange = function() {
            _.element.classList.remove(_.mmeLoader)
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                success.call(_);
            } else {
                error.call(_);
                // setTimeout(error.bind(_), 2000);
            }
        }
        xmlHttp.open(this.mmeUpdateMethod, this.endPoint, true); // true for asynchronous 
        // xmlHttp.setRequestHeader(this.xHeader,this.xHeadParam);
        xmlHttp.send(JSON.stringify(data));
    };
    function updateSuccessfully() {
        alert('Updated Successfully');
        this.element.innerHTML = this.elementNewText;
    }
    function updateError() {
        alert('A Server Side Error Occured');
        this.element.innerHTML = this.elementOldTxt;
    }

}());