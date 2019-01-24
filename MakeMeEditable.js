(function(){
    this.MakeMeEditable = function() {
        this.hoverClass = "mme";
        if (arguments[0] && typeof arguments[0] == "object") {
            this.elemIdToEditable = arguments[0].elemIdToEditable;
            this.endPoint = arguments[0].endPoint;
            this.postName = arguments[0].postName;
            this.hoverBG = arguments[0].hoverBG || "#f1f1f1";
        }
        init.call(this);
    }
    function init(){
        this.element = document.getElementById(this.elemIdToEditable);
        this.elementOldTxt = this.element.innerHTML;
        this.element.addEventListener('click', makeEditable.bind(this), true);
        appendStyle.call(this);
    };
    function makeEditable() {
        this.textArea = document.createElement('textarea');
        this.textArea.rows = "4";
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
 
        this.textArea.addEventListener('click', makeMeNeutral.bind(this));
        this.cancelBtn.addEventListener('click', cancelEditing.bind(this));
        this.saveBtn.addEventListener('click', saveChanges.bind(this));
        this.element.removeEventListener('click', makeEditable, true);
        
    }
    function makeMeNeutral() {
        this.element.removeEventListener('click', makeEditable, true);
        
    }
    function saveChanges() {
        var data = {[this.postName]:this.textArea.innerHTML };
        this.elementNewText = this.textArea.innerHTML;
        this.element.innerHTML = this.elementNewText;
        console.log(data);
        this.element.removeEventListener('click', makeEditable, true);
        
    }
    function cancelEditing() {
        this.element.innerHTML = this.elementOldTxt;
    }
    function appendStyle() {
        var classDef = '.mme{ cursor: pointer; transition: all 0.4s; } .mme:hover{ background-color: '+this.hoverBG+'} .mme-textarea{  resize: both;overflow: auto;}';
        var styleId = this.hoverClass;
        var style = document.createElement('style');
        var existingStyle = document.querySelector("#"+styleId);
        if (!existingStyle) {
            style.id = styleId;
            if (style.styleSheet) {
                style.styleSheet.cssText = classDef;
            } else {
                // style.appendChild(document.createTextNode(classDef));
                style.innerHTML = classDef;
            }
            style.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        this.element.className = this.hoverClass;
        
    }

}());