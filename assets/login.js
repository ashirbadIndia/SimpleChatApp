const submitInfo = ()=>{
    const name=document.querySelector('#name').value;
    const pass=document.querySelector('#pass').value;
    const jsonObj=JSON.stringify({name:name, password:pass});
    sendRes(jsonObj);
}
const sendRes= async (jsonObj)=>{
    try{
    const response = await fetch('http://127.0.0.1:4000/login',{
        method: 'POST',
        body: jsonObj,
        headers: {'Content-type': 'application/json',"Accept":"text/html"},
        credentials: 'same-origin',
        redirect: 'follow'
    })
    if(response.redirected){
        console.log('Redirected');
        console.log(response.url);
        window.location.replace(response.url);

    }
    else if(response.ok){
        const jsonResponse= await response.json();
        document.getElementById('error').innerHTML = jsonResponse.status;
    }
    else{
        throw new Error("Request Failed!");
    }
}
catch(error){
    console.log(error);
}
}