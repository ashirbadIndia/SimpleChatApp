const submitInfo = ()=>{
    const name=document.querySelector('#name').value;
    const pass=document.querySelector('#pass').value;
    const jsonObj=JSON.stringify({name:name, password:pass});
    sendRes(jsonObj);
}
const sendRes= async (jsonObj)=>{
    try{
    const response = await fetch('127.0.0.1:3000/login',{
        method: 'POST',
        body: jsonObj,
        headers: {'Content-type': 'application/json'}
    })
    if(response.ok){
        const jsonResponse= await response.json();
        console.log(jsonResponse);
    }
    else{
        throw new Error("Request Failed!");
    }
}
catch(error){
    console.log(error);
}
}