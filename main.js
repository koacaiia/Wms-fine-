const firebaseConfig = {
    apiKey: "AIzaSyDLzmZyt5nZwCk98iZ6wi01y7Jxio1ppZQ",
    authDomain: "fine-bondedwarehouse.firebaseapp.com",
    databaseURL: "https://fine-bondedwarehouse-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fine-bondedwarehouse",
    storageBucket: "fine-bondedwarehouse.appspot.com",
    messagingSenderId: "415417723331",
    appId: "1:415417723331:web:15212f190062886281b576",
    measurementId: "G-SWBR4359JQ"
};
// const app=initializeApp();
// console.log(app)
firebase.initializeApp(firebaseConfig);
const database_f = firebase.database();
const messaging = firebase.messaging();
const storage_f = firebase.storage();
const deptName = "WareHouseDept2";
const key_f = ['date','container','spec','consignee','bl', 'description','count', 'incargo','Pqty','remark','keyValue','location','shape', 'working'];
let selRow={};
let initRow={};
let io;
if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(function(registration) {
    console.log('Service Worker Registered!', registration);
    })
    .catch(function(err) {
    console.error('Service Worker registration failed: ', err);
    });
    }

function transDate(dateT){
    let result_date;
    try{
    let result_month = dateT.getMonth()+1;
    let result_day =dateT.getDate();
    if(result_month<10){
        result_month ="0"+result_month;
    };
    if(result_day <10){
        result_day ="0"+result_day;
    };
    result_date = dateT.getFullYear()+"-"+result_month+"-"+result_day;
    return result_date;
    }catch(e){
    return result_date ="미정";
    }
    
}
document.getElementById("datePicker").value =transDate(new Date());
let tableHeader;
function fileIn(event){
    const target = event.target;
    // excelConvert("C:\Users\koaca\OneDrive\문서\화인통상2물류 incargo(2024).xlsm");
    excelConvert(target);

};
function excelConvert(target){
    try{
    let file =target.files[0];
    console.log(file)
    let op={};
    let sheetName;
    let fReader = new FileReader();
    fReader.readAsDataURL(file);
    fReader.onloadend=function(event){
        if(target.id =="fileIn"){
            document.getElementById("fileInName").value=target.value;
            op={defval:"",range:"A3:X3000",blankrows:false,raw:true};
            sheetName ="Container"
            io="i"
        }else{
            console.log("target Out")
            document.getElementById("fileOutName").value=target.value;
            op={defval:"",range:"A3:K10000",blankrows:false,raw:true};
            sheetName ="출고취합";
            io="o";
        };
    }
    
    let infoValue= new Array();
    let reader = new FileReader();
    let workbook = null;
    reader.onload = function(event){
        const data = event.target.result;
        workbook = XLSX.read(data,{type:"binary",cellDates: true,dateNF:"yyyy-mm-dd"});
    
    let rowsValue = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName],op);
    console.log("excelConvert",io);
    if(rowsValue.length ==0){
        excelConvert(target);
    }else{
        eTable(rowsValue);
    }
    };
    reader.readAsBinaryString(file);
    }catch(e){
        alert(e);
        console.log(e);
    }
    
}
function eTable(value){
    let tdList=[];
    let tableE;
    let trV = Object.values(value);
    let tBodyE; 
    const dateValue = document.getElementById("datePicker").value;
    // const dateValue = "2024-01-30";
    const offset = (9*60*60*1000);
    console.log("eTable",io);
    
    if(io =="i"){
        moveTab(0);
        const tableE=document.getElementById("tableE");
        tBodyE = document.getElementById("tbiE");
        tBodyE.replaceChildren();
        tdList =["Date","Container","40FT","화 주","BL","품명","#","Grocery","pallet  Qty","비고"];
        for(let rC in value){
        let trE = document.createElement("tr");
        if(value[rC]["Date"] != ""){
            value[rC]["Date"] = new Date(value[rC]["Date"].getTime()+offset);
        }
        // 
        // console.log(new Date(value[rC]["Date"].getTime()+offset),new Date(value[rC]["Date"].getTime()))
        value[rC]["Date"]=transDate(value[rC]["Date"]);
        if(value[rC]["40FT"] ==1){
            value[rC]["40FT"] ="40Ft";
        }else if(value[rC]["20FT"] ==1){
            value[rC]["40FT"] ="20Ft";
        }else if(value[rC]["LCL"] !=""){
            value[rC]["40FT"] ="L : "+value[rC]["LCL"]
        }else{
            value[rC]["40FT"]="0";
        };
        if(value[rC]["Date"] == dateValue){
            const td= document.createElement("td");
            const ch = document.createElement("input");
            ch.setAttribute("type","checkbox");
            ch.addEventListener("click",function(e){
                const tr = e.target.parentNode.parentNode;
                tr.classList.toggle("select");
            });
            td.appendChild(ch);
            trE.appendChild(td);
            tBodyE.appendChild(trE);
            for(let tdC in tdList){
            let tdE = document.createElement("td");
            tdE.innerHTML=value[rC][tdList[tdC]];
            trE.appendChild(tdE);
        }
        tBodyE.appendChild(trE);
        }
        tableE.appendChild(tBodyE);
    }
    }else{
        moveTab(2)
        const tableE=document.getElementById("tableEo");
        tBodyE = document.getElementById("tboE");
        tBodyE.replaceChildren();
        let count =0;
        const tdList=["반출일","화주","입고처","총출고수량","총출고팔렛트수량","품목별출고수량","품목별팔렛트수량","관리번호","Description"];
        
        for(let rC in value){
           
            if(value[rC]["반출일"] != ""){
            value[rC]["반출일"] = new Date(value[rC]["반출일"].getTime()+offset);
            value[rC]["반출일"]=transDate(value[rC]["반출일"]);
        if(value[rC]["반출일"] == dateValue){
            let trE = document.createElement("tr");
            let tdH = document.createElement("td");
            tdH.style.display ="none";
            tdH.innerHTML=value[rC]["__EMPTY"];
            trE.appendChild(tdH); 
            const td = document.createElement("td");
            const ch = document.createElement("input");
            ch.setAttribute("type","checkbox");
            ch.addEventListener("click",function(e){
                mSelected(e)
                // console.log(e.target.parentNode.parentNode.parentNode);
                // const tr = e.target.parentNode.parentNode.parentNode;
                // tr.classList.toggle("select");
            });
            td.appendChild(ch);
            trE.appendChild(td);

            for(let tdC in tdList){
            let tdE = document.createElement("td");
            tdE.innerHTML=value[rC][tdList[tdC]];
            trE.appendChild(tdE);
        }
        tBodyE.appendChild(trE);
        }
        
    }
}
    tableE.appendChild(tBodyE);
    
}
    
    sTable(dateValue,io);
};

function sTable(dateValue,io){
    if(io=="i"){
    // document.getElementById("tableS").replaceChildren();
    database_f.ref("DeptName/"+deptName+"/InCargo/").get().then((snapshot)=>{
    let snapV = snapshot.val();
    let keyList =[];
    const tdList =["date","container","container40","consignee","bl","description","count","incargo","incargo","remark","keyValue"];
    let headerS = document.createElement("thead");
    let tableS = document.getElementById("tableS");
    let tHrS = document.createElement("tr");
    let tBodyS = document.getElementById("tboE");

    for(let hC in tableHeader){
        let thS = document.createElement("th");
        thS.innerHTML=tableHeader[hC];
        thS.addEventListener("click",function(e){
            console.log(hC)
        });
        tHrS.appendChild(thS);
    }
    for(let kc in snapV){
        let kL =snapV[kc];
        for(let kc1 in kL){
            let keyValue = Object.keys(kL[kc1]);
            let value1 = Object.values(kL[kc1]);
            if(keyValue !='json 등록시 덥어쓰기 바랍니다'){
                if(Object.values(value1) != 'json 등록시 덥어쓰기 바랍니다' ||Object.keys(value1) != 'json 등록시 덥어쓰기 바랍니다'){
                    let value2 =Object.values(kL[kc1]);
                    for(kc2 in value2){
                        if(value2[kc2] !="json 최초등록시 ` { `기호 다음  `,`기호 있으면 `,` 기호삭제후 최초 등록 바랍니다. " && value2[kc2]["date"] == dateValue){
                            let trS = document.createElement("tr");
                            for(let tdC in tdList){
                                let td = document.createElement("td");
                                td.innerHTML= value2[kc2][tdList[tdC]];
                                if(tdC == tdList.length-1){
                                    td.style.display="none";
                                }
                                trS.appendChild(td);
                            }
                            tBodyS.appendChild(trS);  
                        }
                    }
                }}};
    };
    headerS.appendChild(tHrS);
    tableS.appendChild(headerS);
    tableS.appendChild(tBodyS);
    }
    );
    }else{
    const dateValue = document.getElementById("datePicker").value;
    const monValue = dateValue.substring(5,7)+"월";
    let tableS = document.getElementById("tableSo");
    // tableS.replaceChildren();
    database_f.ref("DeptName/"+deptName+"/OutCargo/"+monValue+"/"+dateValue).get().then((snapshot)=>{
    let snapV = snapshot.val();
    // console.log(snapV)
    let keyList =[];
    const tdList =["date","consigneeName","outwarehouse","totalEa","totalQty","eaQty","pltQty","managementNo","description"];
    let headerS = document.createElement("thead");
    let tHrS = document.createElement("tr");
    let tBodyS = document.getElementById("tboS");

    for(let hC in tableHeader){
        let thS = document.createElement("th");
        thS.innerHTML=tableHeader[hC];
        thS.addEventListener("click",function(e){
            console.log(hC)
        });
        tHrS.appendChild(thS);
    }

    for(let kc in snapV){
        let trS = document.createElement("tr");
        for(let tdC in tdList){
            let td = document.createElement("td");
            td.innerHTML= snapV[kc][tdList[tdC]];
            trS.appendChild(td);
        }
        tBodyS.appendChild(trS);  
               
        }
    headerS.appendChild(tHrS);
    tableS.appendChild(headerS);
    tableS.appendChild(tBodyS);
    }
    );
    };
}
const tabList = document.querySelectorAll(".tab_menu .list li");
for(var i=0 ;i<tabList.length;i++){
    tabList[i].querySelector(".btn").addEventListener("click", function(e){
        e.preventDefault();
        for(var j=0;j<tabList.length;j++){
            tabList[j].classList.remove("is_on");
        }
        this.parentNode.classList.add("is_on");
    });
}
function thClick(n){
    console.log(n)
};
function dateC(){
    let target;
    if(io =="i"){
        target = document.getElementById("fileIn")
            excelConvert(target);
       
        }else if(io =="o"){
        target = document.getElementById("fileOut");
        excelConvert(target);
    }else{
        alert(document.getElementById("datePicker").value+" 로 날짜 변경 했습니다.");
    }
    // console.log(target)
    
};
function submitBtn(){
    let refPath;
    let conMessage="";
    let doc;
    if( io=="o"){
        doc=document.getElementById("tboE")
        const tr = doc.querySelectorAll(".select");
        const serverKeyList = ["date","consigneeName","outwarehouse","totalEa","totalQty","eaQty","pltQty","managementNo","description"];
        for(let i=0; i<tr.length;i++){
            let ar={};
            const tdKey = tr[i].cells[0].innerHTML;
            ar["keypath"]=tdKey;
            for(let j=0 ;j<serverKeyList.length;j++){
                ar[serverKeyList[j]]=tr[i].cells[(j+2)].innerHTML;
                console.log(tr[i].cells[(j+2)].innerHTML);
            }
            const monValue = ar["date"].substring(5,7)+"월";
            ar["keyValue"]="DeptName/"+deptName+"/OutCargo/"+monValue+"/"+ar["date"]+"/"+ar["keypath"];
            ar["workprocess"]="미";
            console.log(ar["totalQty"])
            if(ar["totalQty"]!=""){
                console.log(ar["totalQty"])
                ar["totalQty"]=ar["totalQty"]+"PLT"
            }else{
                ar["totalQty"]=selRow[tdKey]["totalQty"];
                ar["description"]=selRow[tdKey]["description"]+","+ar["description"];
                ar["managementNo"]=selRow[tdKey]["managementNo"]+","+ar["managementNo"];
                ar["eaQty"]=selRow[tdKey]["eaQty"]+","+ar["eaQty"];
                ar["pltQty"]=selRow[tdKey]["pltQty"]+","+ar["pltQty"];
            }
           selRow[tdKey]=ar;
        }
        for(let i in Object.keys(selRow)){
            conMessage = conMessage +Object.keys(selRow)[i]+"\n";
            }
        conMessage= "총("+Object.keys(selRow).length+")건의 출고내역을 서버에 등록 하시겠습니까?"+"\n"+conMessage;
        }else{
            doc=document.getElementById("tbiE")
            const trL = doc.querySelectorAll(".select");
            for(let trC =1;trC<trL.length;trC++){
                let selectOb = {};
                for(let tdC=0;tdC<key_f.length;tdC++){
                    const c = tdC+1;
                    try{
                        selectOb[key_f[tdC]]=trL[trC].cells[c].innerHTML; 
                    }catch(e){
                        selectOb[key_f[tdC]]="";
                    }
                }
                if(selectOb["spec"] =="40Ft"){
                    selectOb["container40"]="1";
                    selectOb["container20"]="0";
                    selectOb["lclcargo"]="0";
                }else if(selectOb["spec"] =="20Ft"){
                    selectOb["container40"]="0"; 
                    selectOb["container20"]="1";
                    selectOb["lclcargo"]="0";
                }else if(selectOb["spec"].includes("L : ")){
                    selectOb["container40"]="0";
                    selectOb["container20"]="0";
                    selectOb["lclcargo"]="1";
                }else{
                    selectOb["container40"]="0";
                    selectOb["container20"]="0";
                    selectOb["lclcargo"]="0";
                }
                const monValue = selectOb["date"].substring(5,7)+"월";
                const keyPath = selectOb["date"]+"_"+selectOb["bl"]+"_"+selectOb["description"]+"_"+selectOb["count"]+"_"+selectOb["container"];
                const refValue = "DeptName/"+deptName+"/InCargo/"+monValue+"/"+selectOb["date"]+"/"+keyPath;
                selectOb["keyValue"]=keyPath;
                selectOb["refValue"]=refValue;
                selRow[trC]=selectOb;
                }
                conMessage="총 "+trL.length+"건의 입고내역 서버에 등록 하시겠습니까?";
            }
            
            let sendConfirm = confirm(conMessage);
            if(sendConfirm){
                for (let i in selRow){
                        if( io=="o"){
                            refPath=selRow[i]["keyValue"];
                        }else{
                            refPath=selRow[i]["refValue"];
                        }
                        console.log(refPath);
                        database_f.ref(refPath).update(selRow[i]).then(()=>{
                            const seL = Object.keys(selRow);
                            const seLlast = seL[seL.length];
                            if( i== seLlast){
                                if(io == "i"){
                                    alert(" 입고 총 "+seL.length+"입고건 서버등록 되었습니다.");
                                    moveTab(1);
                                }else{
                                    alert("출고 총 "+seL.length+"출고건 서버등록 되었습니다.");
                                    moveTab(3);
                                }
                            }
                            
                        }).catch((e)=>{
                            alert(e);
                            console.error(e);
                        });
                    }
            }
    // 
    resetBtn();
    
    }
    const messageTitle = '알림 제목';
    const messageBody = '알림 내용입니다.';
    const topic="WareHouseDept2"
    const message={
        data:{"contents":"test","nickName":"test","message":"test"},
        topic:"WareHouseDept2"
    }
    const token = 'fhr3iBpyPDxgNVdTXuO6oQ:APA91bGNVwB59JQDdFcX4R4kq9nsQ5xGfAm5fl2isCr3epQHqZRQkafCag8D1PhS8DjOmlt5GYGHdze2GNnW4hM5FKk66qI61XSPt8oPSi-G0ZftWyH87tGfwcyIxng_Ww5tHj6cj9vl'; // 메시지를 받을 대상의 FCM 토큰
    Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
        console.log('알림 권한이 허용되었습니다.');
        // Firebase 메시징 초기화 및 추가 설정
        messaging.getToken().then((c) => {
        if (c) {
           
            console.log(c)
            // messaging.send(c,message).then((r)=>{
            // console.log("Successfully sent Message",r)
            // }).catch((e)=>{
            //     console.log("Error sending message",e);
            // });
            } else {
                console.log('토큰이 없습니다. 권한을 다시 확인하세요.');
            }
        }
            ).catch((err) => {
        console.log('토큰을 가져오는 중 오류가 발생했습니다.', err);
        });
    } else {
        console.log('알림 권한을 허용하지 않았습니다.');
    }
    }).catch((err) => {
    console.log('알림 권한 요청 중 오류가 발생했습니다.', err);
    });
    // messaging.requestPermission().then(function(){
    //     console.log("Permission Allowed");
    //     return messaging.getToken();
    // }).then(function(token){
    //     console.log("Token",token);
    //     // messaging.subscribeToTopic(token,"WareHouseDept2").
    //     // then((re)=>{
    //     //     console.log("Successfully subscribed to Topic",re);
    //     // }).catch((e)=>{
    //     //     console.log("Error subscribing to Topic",e);
    //     // })
        
    // }).catch(function(e){
    //     console.log(e);
    // });
    // console.log(messaging)
   
    messaging.onMessage((payload)=>{
        console.log("message received",payload)
        alert(payload)
    })

    // FCM에 메시지를 보내는 함수
    function sendFCMMessage(topic, title, body,token) {
    // FCM 서버에 요청을 보내기 위한 fetch 사용 (서버 측에서 처리해야 함)
    // const fetch = require("node-fetch");
    fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=AAAAYLjTacM:APA91bEfxvEgfzLykmd3YAu-WAI6VW64Ol8TdmGC0GIKao0EB9c3OMAsJNpPCDEUVsMgUkQjbWCpP_Dw2CNpF2u-4u3xuUF30COZslRIqqbryAAhQu0tGLdtFsTXU5EqsMGaMnGK8jpQ' 
    },
    
    body: JSON.stringify({
        // to: "topics/"+topic,
        // contents:"Test",
        // nickName:"Test",
        // message:"Test",

        notification: {
        title: title,
        body: body,
        },
        to:token
    })
    })
    .then(response => {
    console.log('FCM 메시지 전송 성공:', response);
    })
    .catch(error => {
    console.error('FCM 메시지 전송 실패:', error);
    });
    }
    sendFCMMessage(topic, messageTitle, messageBody,token);

msgLoad();
function msgLoad(){
    const dateValue = document.getElementById("datePicker").value;
    
    const ref = "DeptName/WareHouseDept2/WorkingMessage/"+dateValue;
    database_f.ref(ref).get().then((snapshot)=>{
        // console.log(snapshot.val())
        const value= snapshot.val();
        const tI= document.getElementById("msgTableIn");
        tI.replaceChildren();
        const tO= document.getElementById("msgTableOut");
        tO.replaceChildren();

        for(let v in value){
            const ob = Object.keys(value[v]);
            const keyB = ob.includes("keyValue");
            const tr = document.createElement("tr");
            tr.classList.toggle("tableTrB");
            const tDiv = document.createElement("div");
            tDiv.classList.toggle("tableMsgDiv");
            const h6 = document.createElement("h7");
            h6.style.className="msgTitle";
            h6.innerHTML=v;
            const content = document.createElement("h8");
            content.classList.add("msgContent");
            let msgContent;
            if(value[v]["inOutCargo"]!="InCargo"){
                msgContent = value[v]["keyValue"].substring(value[v]["keyValue"].indexOf("_"));
            } else{
                msgContent= value[v]["msg"];}
          
            content.innerHTML=msgContent;
            tDiv.style.border="0.5px solid black";
            tDiv.style.borderRadius="1px";
            tDiv.style.width="20vw";
            tDiv.appendChild(h6);
            tDiv.appendChild(content);
            tr.appendChild(tDiv);
            let inOut="";
            console.log(value[v]["inOutCargo"])
            if(value[v]["inOutCargo"] =="OutCargo"){
                tO.appendChild(tr);
                inOut="/OutCargo/";
            }else{
                tI.appendChild(tr);
                inOut="/InCargo/"
            }
            if(keyB){
                const tableP = document.createElement("table");
                tableP.classList.add("tableMsg");
                const tPbody = document.createElement("tbody");
                const tPtr = document.createElement("tr");
                tPtr.classList.toggle("tableTr");
                const refStorage = "images/WareHouseDept2/"+dateValue+inOut+value[v]["keyValue"];
                    storage_f.ref(refStorage).listAll().then((res)=>{
                            res.items.forEach((itemRef)=>{
                                const tPtd = document.createElement("td");
                                const img = document.createElement("img");
                                img.setAttribute("class","imgTd");
                                img.addEventListener("click", function(){picDown(event)});
                                
                            const filePath = storage_f.ref(refStorage+"/"+itemRef.name);
                            filePath.getDownloadURL().then((url)=>{
                                img.src=url;
                                tPtd.appendChild(img);
                            });
                            tPtr.appendChild(tPtd);
                        });
                    });
                tableP.appendChild(tPtr)
                tDiv.appendChild(tableP);
            }
        }
    });}

    function picDown(event){
    const link = document.createElement("a");
        link.href=event.target.src;
        link.target="_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    };
    function allS(event){
        let doc;
        if(io=="i"){
            doc = document.getElementById("tbiE");
        }else{
            doc = document.getElementById("tboE");
        }
        
        const checkboxes 
            = doc.querySelectorAll('input[type="checkbox"]');
            console.log(checkboxes);
        
        checkboxes.forEach((checkbox) => {
            checkbox.checked = event.checked
            checkbox.parentNode.parentNode.classList.toggle("select");
        })
    };
    function resetBtn(){
        const ch = document.querySelectorAll("input[type='checkbox']");
        for(let i=0; i<ch.length;i++){
            ch[i].classList.remove("select");
            if(ch[i].checked){
                    ch[i].parentNode.parentNode.classList.toggle("select");
                    ch[i].checked = false;
                }
            }
            selRow={};
        }

    function mSelected(e){
        const tr = e.target.parentNode.parentNode;
        tr.classList.toggle("select");
        const trList = document.querySelectorAll("tr");
        let trIndex = tr.rowIndex;
        const trValue= trList[trIndex+2].cells[0].innerHTML;
        while(trValue == trList[trIndex+3].cells[0].innerHTML){
            const tr=trList[trIndex+3];
            const ch=tr.querySelectorAll("input[type='checkbox']")[0];
            tr.classList.toggle("select");
            ch.checked = true;
             trIndex++;
            }
        }
    function moveTab(n){
        const tabList = document.querySelectorAll(".tab_menu .list li");
        console.log(io,tabList)
        for(var i=0 ;i<tabList.length;i++){
            tabList[i].classList.remove("is_on");
        }
        tabList[n].classList.add("is_on");
    }
        
       