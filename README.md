# MakeMeEditable
a pure js function to make any field editable on click and send any change to server

## How to start?
- clone the repo `git clone https://github.com/shamrat17/makeMeEditable.git` 
- Go to the folder `cd makeMeEditable`
- Open `index.html` to browser
- Click on `hello world`

## How can I use it?
Nothing special. You need to specify the Id and the parameters for that field.

```html
<div id="div-box" class="mme">hello world</div>
```

```js
var makeMeEditable = new MakeMeEditable(
{
    elemIdToEditable: "div-box",
    endPoint: "localhost/update",
    hoverBG: "#f5f5f5",
    isTextArea: true,
    postParamName: 'question',
    postParamKey: '1'
});
makeMeEditable.listen('mme-error', function(e) {
    console.log('Error Occured');
    console.log(e.status);
});
makeMeEditable.listen('mme-success', function(e) {
    console.log('Successfully Updated');
});
```
