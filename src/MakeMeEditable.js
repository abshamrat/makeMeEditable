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
        this.mmePositiveName = "Save";
        this.mmeNegativeName = "Cancel";
        this.mmePositivtEvent = "click";
        this.mmeNegativeEvent = "click";
        this.mmeEnabledEvent = "click";
        this.mmeUpdateMethod = "POST";
        this.listenEvent = ['mme-error', 'mme-success'];
        this.dispatch = [];

        if (arguments[0] && typeof arguments[0] == "object") {
            this.elemIdToEditable = arguments[0].elemIdToEditable;
            this.endPoint = arguments[0].endPoint;
            this.postParamName = arguments[0].postParamName;
            this.postParamKey = arguments[0].postParamKey;
            this.postParamKeyName = arguments[0].postParamKeyName || "id";
            this.isTextArea = arguments[0].isTextArea || false;
            this.hoverBG = arguments[0].hoverBG || "#f1f1f1";
            this.mmePositiveClass = arguments[0].mmePositiveClass || "mme-positive";
            this.mmeNegativeClass = arguments[0].mmeNegativeClass || "mme-negative";
        }

        init.call(this);
        
    }
    function init(){
        this.isEnabled = false;
        this.element = document.getElementById(this.elemIdToEditable);
        this.elementOldTxt = this.element.innerHTML;
        this.element.addEventListener(this.mmeEnabledEvent, makeEditable.bind(this), true);
        this.listen = function(etype, dispatch) {
            if(this.listenEvent[0] === etype || this.listenEvent[1] === etype)
            {
                this.dispatch[etype] = dispatch;
                return;
            }
            new Error(`Please define valid event [${this.listenEvent.join(' or ')}]`);
        }
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
        this.textArea.value = this.elementOldTxt;
        
        this.PositiveBtn.classList.add(this.mmePositiveClass);
        this.PositiveBtn.innerHTML = this.mmePositiveName;
        this.NegativeBtn.classList.add(this.mmeNegativeClass);
        this.NegativeBtn.innerHTML = this.mmeNegativeName;
        
        this.element.innerHTML = '';
        this.element.appendChild(this.textArea);
        this.element.appendChild(this.br);
        this.element.appendChild(this.NegativeBtn);
        this.element.appendChild(this.PositiveBtn);
 
        this.NegativeBtn.addEventListener(this.mmePositivtEvent, NegativeEditing.bind(this));
        this.PositiveBtn.addEventListener(this.mmeNegativeEvent, PositiveChanges.bind(this));
    }
    function PositiveChanges(e) {
        var data = {[this.postParamName]:this.textArea.value, [this.postParamKeyName]: this.postParamKey };
        POST.apply(this, [data, updateSuccessfully, updateError]);
        this.elementNewText = this.textArea.value;
        this.isEnabled = false;
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
            .mme-positive{
                border: 0.5px solid #4cae4c;
                background: #5cb85c;
                outer-border:none;
                padding: 5px;
                font-size:11px;
                font-weight: bold;
                color: #FFF;
                margin:1px;
                cursor:pointer;
                transition: all 0.4s;
            }
            .mme-positive:hover{
                border: 0.5px solid #398439;
                background: #449d44;
            }
            .mme-negative{
                border: 0.5px solid #d43f3a;
                background: #d9534f;
                outer-border:none;
                padding: 5px;
                font-size:11px;
                font-weight: bold;
                color: #FFF;
                margin:1px;
                cursor:pointer;
                transition: all 0.4s;
            }
            .mme-negative:hover{
                border: 0.5px solid #ac2925;
                background: #c9302c;
            }
            @keyframes spin { 
                0% { transform: rotate(0deg); } 
                100% { transform: rotate(360deg); } 
            }`;
        var styleId = this.mmeClass;
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
        this.element.classList.add(this.mmeClass);
    }
    function POST(data, success, error) {
        var xmlHttp = new XMLHttpRequest();
        this.element.classList.add(this.mmeLoader);
        var _ = this;
        sent = false;
        xmlHttp.onreadystatechange = function(e) {
            if (!sent) {
                sent = true;
                _.element.classList.remove(_.mmeLoader)
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                {
                    success.apply(_, [xmlHttp]);
                } else {
                    error.apply(_, [xmlHttp]);
                }
            }
        }
        xmlHttp.open(this.mmeUpdateMethod, this.endPoint, true);
        // xmlHttp.setRequestHeader(this.xHeader,this.xHeadParam);
        xmlHttp.send(JSON.stringify(data));
    };
    function updateSuccessfully(res) {
        this.element.innerHTML = this.elementNewText;
        return this.dispatch[this.listenEvent[1]].apply(null, [res]) || null;
    }
    function updateError(res) {
        this.element.innerHTML = this.elementOldTxt;
        return this.dispatch[this.listenEvent[0]].apply(null, [res]) || null;
    }

}());