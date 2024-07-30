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
firebase.initializeApp(firebaseConfig);
const database_f = firebase.database();
const messaging = firebase.messaging();
const storage_f = firebase.storage();
const deptName = "WareHouseDept2";
const key_f = ['date','container','spec','consignee','bl', 'description','count', 'incargo','Pqty','remark','keyValue','location','shape', 'working'];
let selRow={};
let initRow={};
let io;
let bKeyValue;
let aKeyValue;
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
document.getElementById("pltDate").value =transDate(new Date());
let tableHeader;
function getFileI(){
    document.getElementById("fileIn").click();
    io="i";
}
function getFileO(){
    document.getElementById("fileOut").click();
    io="o";
}
function fileIn(event){
    const target = event.target;
    excelConvert(target);

};
function excelConvert(target){
    try{
    let file =target.files[0];
    let op={};
    let sheetName;
    let reader = new FileReader();
    let workbook = null;
    reader.onload = function(event){
        if(target.id =="fileIn"){
            op={defval:"",range:"A3:X3000",blankrows:false,raw:true};
            sheetName ="Container"
            io="i"
        }else{
            op={defval:"",range:"A3:K10000",blankrows:false,raw:true};
            sheetName ="출고취합";
            io="o";
        };
        const data = event.target.result;
        workbook = XLSX.read(data,{type:"binary",cellDates: true,dateNF:"yyyy-mm-dd"});
    
    let rowsValue = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName],op);
    if(rowsValue.length ==0){
        excelConvert(target);
    }else{
        eTable(rowsValue);
    }
    };
    reader.readAsBinaryString(file);
    }catch(e){
        alert(e);
    }
    
}
sTable("i");
sTable("o");
function eTable(value){
    let tdList=[];
    let tBodyE; 
    const dateValue = document.getElementById("datePicker").value;
    // const dateValue = "2024-01-30";
    const offset = (9*60*60*1000);
    if(io =="i"){
        const tableE=document.getElementById("tableE");
        tBodyE = document.getElementById("tbiE");
        tBodyE.replaceChildren();
        tdList =["Date","Container","40FT","화 주","BL","품명","#","Grocery","pallet  Qty","비고"];
        for(let rC in value){
        let trE = document.createElement("tr");
        if(value[rC]["Date"] != ""){
            value[rC]["Date"] = new Date(value[rC]["Date"].getTime()+offset);
        }
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
        const tableE=document.getElementById("tableEo");
        tBodyE = document.getElementById("tboE");
        tBodyE.replaceChildren();
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
};

function sTable(io){
    const dateValue= document.getElementById("datePicker").value;
    if(io=="i"){
    document.getElementById("tbiS").replaceChildren();
    const monValue = dateValue.substring(5,7)+"월";
    database_f.ref("DeptName/"+deptName+"/InCargo/"+monValue+"/"+dateValue).get().then((snapshot)=>{
    let snapV = snapshot.val();
    let keyList =[];
    const tdList =["date","container","container40","consignee","bl","description","count","incargo","Pqty","remark","keyValue"];
    let tableS = document.getElementById("tableS");
    let tBodyS = document.getElementById("tbiS");
    let containerList =[];    
    for(let kc in snapV){
        let kL =snapV[kc];
            let keyValue = Object.keys(kL);
            let value1 = Object.values(kL);
            let trS = document.createElement("tr");
            trS.style.height="5vh";
            if(kL["working"]!=""){
            containerList.push(kL["container"]);}

            if(keyValue !='json 등록시 덥어쓰기 바랍니다'){
                if(Object.values(value1) != 'json 등록시 덥어쓰기 바랍니다' ||Object.keys(value1) != 'json 등록시 덥어쓰기 바랍니다'){
                        if(kL[kc] !="json 최초등록시 ` { `기호 다음  `,`기호 있으면 `,` 기호삭제후 최초 등록 바랍니다. " && kL["date"] == dateValue){
                            for(let tdC in tdList){
                                let td = document.createElement("td");
                                td.innerHTML= kL[tdList[tdC]];
                                td.style.height="5vh";
                                trS.appendChild(td);
                                if(tdC == tdList.length-1){
                                    td.style.display="none";
                               }
                              
                            }
                        }
                }};
                tBodyS.appendChild(trS);  
    };
    tableS.appendChild(tBodyS);
    const trContainer = tBodyS.querySelectorAll("tr");
    for(let r=0;r<trContainer.length;r++){
        const containerName = trContainer[r].cells[1].innerHTML;
        if(containerList.includes(containerName)){
            trContainer[r].style.backgroundColor="steelblue";
        }
    }
    trContainer.forEach((tr)=>{tr.addEventListener("click",function(e){
        const rowIndex = e.target.parentNode.rowIndex;
        const tabInDiv = document.getElementById("tabInDiv");
        const tabInDivCheck =tabInDiv.style.display;
            incargoUpdate(trContainer[rowIndex-1]);
    }
    )});
    });
    }else{
    const dateValue = document.getElementById("datePicker").value;
    const monValue = dateValue.substring(5,7)+"월";
    let tableS = document.getElementById("tableSo");
    // tableS.replaceChildren();
    database_f.ref("DeptName/"+deptName+"/OutCargo/"+monValue+"/"+dateValue).get().then((snapshot)=>{
    let snapV = snapshot.val();
    let keyList =[];
    const tdList =["date","consigneeName","outwarehouse","totalEa","totalQty","eaQty","pltQty","managementNo","description"];
    let tHrS = document.createElement("tr");
    const tBodyS = document.getElementById("tboS");
    for(let kc in snapV){
        let trS = document.createElement("tr");
        for(let tdC in tdList){
            let td = document.createElement("td");
            td.innerHTML= snapV[kc][tdList[tdC]];
            trS.appendChild(td);
        }
        tBodyS.appendChild(trS);  
        if(snapV[kc]["workprocess"]!="미"){
            trS.style.backgroundColor="steelblue";}
               
        }
    tableS.appendChild(tBodyS);
    const trContainer = tBodyS.querySelectorAll("tr");
    trContainer.forEach((tr)=>{tr.addEventListener("click",function(e){
        const rowIndex = e.target.parentNode.rowIndex;
        const tabInDiv = document.getElementById("tabOutDiv");
        const tabInDivCheck =tabInDiv.style.display;
            outcargoUpdate(trContainer[rowIndex-1]);
    }
    )});
    }
    );
    };
}
const tabList = document.querySelectorAll("li");
for(var i=0 ;i<tabList.length;i++){
    tabList[i].querySelector(".btn").addEventListener("click", function(e){
        e.preventDefault();
        const selectTab=this.parentNode;
        checkIo(selectTab,selectTab.querySelectorAll(".cont")[0].id);
        });
}
function moveTab(n){
    const tabList = document.querySelectorAll("li");
    const selectTab=tabList[n];
    checkIo(selectTab,selectTab.querySelectorAll(".cont")[0].id);
}
function checkIo(tab,id){
    if(id =="tab1"){
        tabList[0].classList.remove("is_onI");
        tabList[2].classList.remove("is_onI");
        tab.classList.add("is_onI");
        eTable("i");}
        else if(id =="tab2"){
            tabList[1].classList.remove("is_onI");
            tabList[2].classList.remove("is_onI");
            tab.classList.add("is_onI");
            sTable("i");}
            else if(id =="tab3"){
                tabList[0].classList.remove("is_onI");
                tabList[1].classList.remove("is_onI");
                tab.classList.add("is_onI");
                
            }
                else if(id =="tab4"){
                    tabList[4].classList.remove("is_onO");
                    tab.classList.add("is_onO");
                    sTable("o");}
                    else if(id =="tab5"){
                        tabList[3].classList.remove("is_onO");
                        tab.classList.add("is_onO");
                        eTable("o");
                    }
                    
                }

function thClick(n){
};
function dateC(){
    let target;
    if(io =="i"){
        target = document.getElementById("fileIn");
        excelConvert(target);
        }else if(io =="o"){
        target = document.getElementById("fileOut");
        excelConvert(target);
    }else{
        const value= document.getElementById("datePicker").value;
        alert(value+" 로 날짜 변경 했습니다.");
        periodSearch(value);
    }
};
function submitBtn(){
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
            }
            const monValue = ar["date"].substring(5,7)+"월";
            ar["keyValue"]="DeptName/"+deptName+"/OutCargo/"+monValue+"/"+ar["date"]+"/"+ar["keypath"];
            ar["workprocess"]="미";
            
            if(ar["totalEa"]==""){
                if(isNaN(parseInt(ar["totalQty"]))){
                    ar["totalQty"]="0";
                }
                if(selRow[tdKey]["totalQty"] ==undefined){
                    selRow[tdKey]["totalQty"]="0";
                }

                console.log(ar["totalQty"],selRow[tdKey]["totalQty"],tdKey);
                ar["totalQty"]=parseInt(selRow[tdKey]["totalQty"])+parseInt(ar["totalQty"]);
                ar["description"]=selRow[tdKey]["description"]+","+ar["description"];
                ar["managementNo"]=selRow[tdKey]["managementNo"]+","+ar["managementNo"];
                ar["eaQty"]=selRow[tdKey]["eaQty"]+","+ar["eaQty"];
                ar["pltQty"]=selRow[tdKey]["pltQty"]+","+ar["pltQty"];
            }
            ar["totalQty"]=ar["totalQty"]+"PLT";
           selRow[tdKey]=ar;
        }
        for(let i in Object.keys(selRow)){
            conMessage = conMessage +Object.keys(selRow)[i]+"\n";
            }
        conMessage= "총("+Object.keys(selRow).length+")건의 출고내역을 서버에 등록 하시겠습니까?"+"\n"+conMessage;
        }else{
            doc=document.getElementById("tbiE")
            const trL = doc.querySelectorAll(".select");
            for(let trC =0;trC<trL.length;trC++){
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
                if(selectOb["incargo"]==""){
                    selectOb["incargo"]="0";
                };
                selectOb["keyValue"]=keyPath;
                selectOb["refValue"]=refValue;
                selRow[trC]=selectOb;
                }
                conMessage="총 "+trL.length+"건의 입고내역 서버에 등록 하시겠습니까?";
            }
            let sendConfirm = confirm(conMessage);
            if(sendConfirm){
                const seL = Object.keys(selRow);
                const seLlast = seL[seL.length-1];
                for (let i in selRow){
                        if( io=="o"){
                            refPath=selRow[i]["keyValue"];
                        }else{
                            refPath=selRow[i]["refValue"];
                        }
                        database_f.ref(refPath).update(selRow[i]).then(()=>{
                            if( i== seLlast){
                                if(io == "i"){
                                    alert(" 입고 총 "+seL.length+"입고건 서버등록 되었습니다.");
                                    moveTab(1);
                                }else{
                                    alert("출고 총 "+seL.length+"출고건 서버등록 되었습니다.");
                                    moveTab(4);
                                }
                            }
                            
                        }).catch((e)=>{
                            console.error(e);
                        });
                    }
            }
    
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
            // remove("Successfully sent Message",r)
            // }).catch((e)=>{
            //     remove("Error sending message",e);
            // });
            } else {
                remove('토큰이 없습니다. 권한을 다시 확인하세요.');
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
    //     remove("Permission Allowed");
    //     return messaging.getToken();
    // }).then(function(token){
    //     remove("Token",token);
    //     // messaging.subscribeToTopic(token,"WareHouseDept2").
    //     // then((re)=>{
    //     //     remove("Successfully subscribed to Topic",re);
    //     // }).catch((e)=>{
    //     //     remove("Error subscribing to Topic",e);
    //     // })
        
    // }).catch(function(e){
    //     remove(e);
    // });
    // remove(messaging)
   
    messaging.onMessage((payload)=>{
        remove("message received",payload)
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
let periodMsg;
msgLoad();
function msgLoad(){
    const dateValue = document.getElementById("datePicker").value;
    if(dateValue !=""){
        periodMsg=[];
        periodMsg.push(dateValue);
    }
    const tI= document.getElementById("msgTableIn");
        tI.replaceChildren();
        const tO= document.getElementById("msgTableOut");
        tO.replaceChildren();
    for(let i=0;i<periodMsg.length;i++){
    const dateValue = periodMsg[i];
    const ref = "DeptName/WareHouseDept2/WorkingMessage/"+dateValue;
    database_f.ref(ref).get().then((snapshot)=>{
        // remove(snapshot.val())
        const value= snapshot.val();
        

        for(let v in value){
            const ob = Object.keys(value[v]);
            const keyB = ob.includes("keyValue");
            const tr = document.createElement("tr");
            tr.classList.toggle("tableTrB");
            const tDiv = document.createElement("div");
            tDiv.classList.toggle("tableMsgDiv");
            // const h6 = document.createElement("h7");
            // h6.style.className="msgTitle";
            // h6.innerHTML=v;
            const content = document.createElement("h8");
            content.classList.add("msgContent");
            let msgContent;
            if(value[v]["inOutCargo"]!="InCargo"){
                console.log(value[v]["keyValue"]);
                msgContent = value[v]["keyValue"].substring(value[v]["keyValue"].indexOf("_"));
            } else{
                msgContent= value[v]["msg"].substring(0,value[v]["msg"].length-8);}
          
            content.innerHTML=v+"\n"+msgContent;
            tDiv.style.border="0.5px solid black";
            tDiv.style.borderRadius="1px";
            tDiv.style.width="100%";
            // tDiv.appendChild(h6);
            tDiv.appendChild(content);
            tr.appendChild(tDiv);
            let inOut="";
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
    }

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
        checkboxes.forEach((checkbox) => {
            checkbox.parentNode.parentNode.classList.remove("select");
            checkbox.checked = event.checked
            checkbox.parentNode.parentNode.classList.toggle("select");
        })
    };
    function resetBtn(){
        let doc;
        if(io=="i"){
            doc = document.getElementById("tbiE");
            docCheck = document.getElementById("tableE");
        }else{
            doc = document.getElementById("tboE");
            docCheck = document.getElementById("tableEo");
        }
        const ch = doc.querySelectorAll("input[type='checkbox']");
        for(let i=0; i<ch.length;i++){
            ch[i].classList.remove("select");
            if(ch[i].checked){
                    ch[i].parentNode.parentNode.classList.toggle("select");
                    ch[i].checked = false;
                }
            }
            docCheck.querySelectorAll("input[type='checkbox']")[0].checked = false; 
            selRow={};
        }

    function mSelected(e){
        const tr = e.target.parentNode.parentNode;
        tr.classList.toggle("select");
        let trList;
        if(io=="o"){
            trList = document.querySelectorAll("#tboE tr");
        }else{
            trList = document.querySelectorAll("#tbiE tr");
        }
        let trIndex = tr.rowIndex-1;
        const trValue= trList[trIndex].cells[0].innerHTML;
        for(let i=trIndex+1 ;i<trList.length;i++){
            if(trList[i].cells[0].innerHTML == trValue){
                trList[i].classList.toggle("select");
                if(trList[i].querySelector("input[type='checkbox']").checked == false){
                    trList[i].querySelector("input[type='checkbox']").checked = true;
                }else{
                    trList[i].querySelector("input[type='checkbox']").checked = false;
                };
            }
        }
        }
    function pltBtn(){
        const pltBtn = document.getElementById("pltReg");
        const fileDiv = document.getElementById("File");
        const pltDiv = document.getElementById("pltDivH");
        if(pltBtn.innerHTML =="Plt 현황"){
            pltBtn.innerHTML="입,출고 현황";
            fileDiv.style.display="none";
            pltDiv.style.display="block";  
        }
            else{
                pltBtn.innerHTML="Plt 현황";
                fileDiv.style.display="block";
                pltDiv.style.display="none";
            }
             
        
    }
    let pltData={};
    const selClient = document.getElementById("pltClient");
    database_f.ref("DeptName/"+deptName+"/PltManagement").get().then((snapshot)=>{
            const value = snapshot.val();
            pltData=value;
            for(let c in value){
                const option = document.createElement("option");
                option.innerHTML=c;
                selClient.appendChild(option);
    }
    });
    function pltClient(){
        const clientValue= selClient.value;
        const pltType = document.getElementById("pltType");
            pltType.replaceChildren();
            const op=document.createElement("option");
            op.innerHTML="Type선택";
            pltType.appendChild(op);
            for(let c in pltData[clientValue]){
                const option = document.createElement("option");
                option.innerHTML=c;
                pltType.appendChild(option);
            }
            
        
    }
    
    function pltType(){
       pltDataTable();
    }
   
    function pltReg(){
        const date= document.getElementById("pltDate");
        const inQty=document.getElementById("pltIn");
        const outQty=document.getElementById("pltOut");
        const remark=document.getElementById("pltNote");
        const confirmPlt = confirm("입고수량 : "+inQty.value+"\n"+"출고수량 : "+outQty.value+"\n"+"재고수량 : "+remark.value+"\n"+"위 내용으로 등록 하시겠습니까?");
        if(confirmPlt){
            const client = document.getElementById("pltClient").value;
            const time = new Date().getTime();
            const type = document.getElementById("pltType").value;
            const refPath = "DeptName/"+deptName+"/PltManagement/"+client+"/"+type+"/"+date.value+"_"+time;
            const pltValue = {"date":date.value,"inQty":inQty.value,"outQty":outQty.value,"remark":remark.value};
            database_f.ref(refPath).update(pltValue).then(()=>{
                alert("Plt 현황이 등록 되었습니다.");
                pltDataTable();
                inQty.value=null;
                outQty.value=null;
                remark.value=null;
            }).catch((e)=>{
                console.error(e);
            });
        }
    }
    
    function pltDataTable(){
        const tbody=document.getElementById("pltTableTbody");
        tbody.replaceChildren();
        const client = document.getElementById("pltClient").value;
        const type = document.getElementById("pltType").value;
        database_f.ref("DeptName/"+deptName+"/PltManagement/"+client+"/"+type).get().then((snapshot)=>{
            let value = snapshot.val();
            let values = Object.values(value);
            values=values.sort(function(a,b){
                return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
            });
            let totalIn=0;
            let totalOut=0;
            for(let p in values){
                const tr = document.createElement("tr");
                tbody.appendChild(tr);
                const pltTh =["date","inQty","outQty","stockQty","remark"];
                if(values[p]["inQty"]==""){
                    values[p]["inQty"]=0;
                }
                if(values[p]["outQty"]==""){
                    values[p]["outQty"]=0;
                }
                totalIn = totalIn+parseInt(values[p]["inQty"]);
                totalOut = totalOut+parseInt(values[p]["outQty"]);
                for(let t in pltTh){
                    const td = document.createElement("td");
                    remove(totalIn,totalOut,pltTh[t]);
                    if(pltTh[t]=="stockQty"){
                        remove("stockQty",parseInt(totalIn)-parseInt(totalOut));
                        td.innerHTML=parseInt(totalIn)-parseInt(totalOut);
                    }else{
                        td.innerHTML=values[p][pltTh[t]];
                        if(values[p][pltTh[t]]==undefined){
                            td.innerHTML="";
                        }
                    }
                    
                    tr.appendChild(td);
                }
            }
           
        });
    }
    function addRow(){
        const body=document.getElementById("tbiU");
        const tr = document.createElement("tr");
        const td= document.createElement("td");
        const ch = document.createElement("input");
        ch.setAttribute("type","checkbox");
        ch.addEventListener("click",function(e){
            const tr = e.target.parentNode.parentNode;
            tr.classList.toggle("select");
        });
        td.appendChild(ch);
        tr.appendChild(td);
        const tdD = document.createElement("td");
        const tdDate = document.createElement("input");
        tdDate.setAttribute("type","date");
        tdDate.value=transDate(new Date());
        tdD.appendChild(tdDate);
        tr.appendChild(tdD);
        for(let i=0;i<9;i++){
            if(i==1){
                const td = document.createElement("td");
                const select = document.createElement("select");
                const typeList =["Type","40Ft","20Ft","Console","LCL"];
                for(let t in typeList){
                    const option = document.createElement("option");
                    option.innerHTML=typeList[t];
                    option.value=typeList[t];
                    select.appendChild(option);
                }
                select.style.height="90%";
                select.style.width="90%";
                td.appendChild(select);
                tr.appendChild(td);
            }else{
                const td = document.createElement("td");
                const input = document.createElement("input");
                input.setAttribute("type","text");
                input.style.height="90%";
                input.style.width="90%";
                td.appendChild(input);
                tr.appendChild(td);
            }
        }
        body.appendChild(tr);
    }
    function delRow(e){
        const body=document.getElementById("tbiU");
        const tr = body.querySelectorAll("tr");
        for(let i=0;i<tr.length;i++){
            if(tr[i].classList.contains("select")){
                body.removeChild(tr[i]);
            }
        }
    }
    function selUpLoad(){
        const body=document.getElementById("tbiU");
        const tr = body.querySelectorAll(".select");
        let selRow={};
        let ar={};
        for(let i=0;i<tr.length;i++){
            for(let key=0;key<key_f.length-4;key++){
                if(key ==2){
                    const type=tr[i].cells[3].querySelector("select").value;
                    if(type=="40Ft"){
                        ar["container40"]="1";
                        ar["container20"]="0";
                        ar["lclcargo"]="0";
                    }else if(type =="20Ft"){
                        ar["container40"]="0"; 
                        ar["container20"]="1";
                        ar["lclcargo"]="0";
                    }else if(type =="LCL"){
                        ar["container40"]="0";
                        ar["container20"]="0";
                        ar["lclcargo"]="1";
                    }else{
                        ar["container40"]="0";
                        ar["container20"]="0";
                        ar["lclcargo"]="0";
                    }
                }else{
                    ar[key_f[key]]=tr[i].cells[parseInt(key)+parseInt(1)].querySelector("input").value;
                }
            }
            const month = ar["date"].substring(5,7)+"월";
            ar["keyValue"]=ar["date"]+"_"+ar["bl"]+"_"+ar["description"]+"_"+ar["count"]+"_"+ar["container"];
            ar["refValue"]="DeptName/"+deptName+"/InCargo/"+month+"/"+ar["date"]+"/"+ar["keyValue"];
            ar["working"]="";
            ar["location"]=""; 
            selRow[i]=ar;
            remove(selRow[i]["container"])
        }
        for(let r in selRow){
            database_f.ref(ar["refValue"]).update(ar).then(()=>{
                remove("Successfully uploaded",ar["refValue"]);
            }).catch((e)=>{
                console.error(e);
            });
            remove(selRow[r]);
        }
        body.replaceChildren();
        }
    function copyRow(){
        const body=document.getElementById("tbiU");
        const tr = body.querySelectorAll(".select");
        if(tr.length>1){
            alert("하나의 행만 선택해 주세요.");}
            else{
                tr[0].classList.toggle("select");
                const ch=tr[0].querySelector("input[type='checkbox']");
                ch.checked=false;
                const trC = tr[0].cloneNode(true);
                trC.rowIndex=tr[0].rowIndex+1;
                body.insertBefore(trC,tr[0]);
                
                const trL = body.querySelectorAll("tr");
                // const trCloned = trL[trC.rowIndex-1];
                const chC = trL[trC.rowIndex-1].querySelector("input[type='checkbox']");
                chC.addEventListener("click",function(e){
                    e.target.parentNode.parentNode.classList.toggle("select");
                    remove(trCloned.rowIndex,e.target);
                });

                // // body.appendChild(trC);
            }
    }
    function incargoExcel(){
        const dateValue= document.getElementById("datePicker").value;
        const fileName = dateValue+"_"+deptName+"_입고내역.xlsx";
        const wb = XLSX.utils.table_to_book(document.getElementById("tableS"),{sheet:dateValue+"입고내역",raw:true});
        XLSX.writeFile(wb,fileName);
    }
    const mainTabList = document.querySelectorAll(".mainTab");
    for(let i=0; i<mainTabList.length;i++ ){
        const tabI= document.getElementById("tabI");
        const tabO= document.getElementById("tabO");
        mainTabList[i].addEventListener("click",function(e){
            const idValue= e.target.id;
            if(idValue=="tabMenuI"){
                tabI.style.display="grid";
                tabO.style.display="none";
            }else if(idValue=="tabMenuO"){
                tabI.style.display="none";
                tabO.style.display="grid";
            }
        });
    };
    function outcargoUpdate(v){
        const msgDiv= document.getElementById("MessageO");
        msgDiv.style.display="none";
        const upDiv =document.getElementById("tabOutDiv");
        upDiv.style.display="grid";
        upDiv.style.gridTemplateRows="10vh 80vh";
        const infoDiv=document.getElementById("infoDivO");
        infoDiv.replaceChildren();
        const thList = document.querySelectorAll("#tableS th");
    }

    function incargoUpdate(v){
        const msgDiv= document.getElementById("Message");
        msgDiv.style.display="none";
        const upDiv =document.getElementById("tabInDiv");
        upDiv.style.display="grid";
        upDiv.style.gridTemplateRows="10vh 80vh";
        const infoDiv=document.getElementById("infoDiv");
        infoDiv.replaceChildren();
        const thList = document.querySelectorAll("#tableS th");
        for(let i=0;i<thList.length;i++){
            const tr = document.createElement("tr");
            const tdH = document.createElement("td");
            tdH.innerHTML=thList[i].innerHTML;
            const td = document.createElement("td");
            let tdInput;                                                                                                        
            if(i==2){
                tdInput= document.createElement("select");
                const typeList=["20Ft","40Ft","LCL"];
                for(let t in typeList){
                    const option = document.createElement("option");
                    option.innerHTML=typeList[t];
                    option.value=typeList[t];
                    tdInput.appendChild(option);
                }

            }else{
                tdInput = document.createElement("input");
                tdInput.setAttribute("type","text");
                tdInput.value=v.cells[i].innerHTML;
            }
            tdInput.setAttribute("class","infoInput");
            td.appendChild(tdInput);
            tr.appendChild(tdH);
            tr.appendChild(td);
            infoDiv.appendChild(tr);
        }
        bKeyValue = v.cells[0].innerHTML+"_"+v.cells[4].innerHTML+"_"+v.cells[5].innerHTML+"_"+v.cells[6].innerHTML+"_"+v.cells[1].innerHTML;
    }
    function infoRe(){
        document.getElementById("tabInDiv").style.display="none";
        document.getElementById("Message").style.display="grid";}
    function infoUp(v){
        remove(v.id);
        const infoValueList= infoDiv.querySelectorAll(".infoInput");
        aKeyValue =infoValueList[0].value+"_"+infoValueList[4].value+"_"+infoValueList[5].value+"_"+infoValueList[6].value+"_"+infoValueList[1].value;
        let upCheck;
        if(v.id=="infoUp"){
            upCheck = confirm(bKeyValue+" 값에 이어서 \n"+aKeyValue+" 값을 \n DataBase Key 로 Upload 하시겠습니까?");
           
        }else{
            upCheck = confirm(bKeyValue+" 값을 삭제후 \n"+aKeyValue+" 값을 \n DataBase Key 로 Upload 하시겠습니까?");
            if(upCheck){
                database_f.ref("DeptName/"+deptName+"/InCargo/"+monthValue+"/"+dateValue+"/"+bKeyValue).remove().then(()=>{
                    alert(bKeyValue+"\nKey 값이 Database에서 Delete 되었습니다.");
                    location.reload();
                }).catch((e)=>{
                    console.error(e);
                });
            }
        }
        let upData={};
        if(upCheck){
            for(let i=0;i<10;i++){
                remove(infoValueList[i].value);
                upData[[key_f[i]]]=infoValueList[i].value;
            }
            if(upData["spec"]=="20Ft"){
                upData["container40"]="0";
                upData["container20"]="1";
                upData["lclcargo"]="0";
            }else if(upData["spec"]=="40Ft"){
                upData["container40"]="1";
                upData["container20"]="0";
                upData["lclcargo"]="0";
            }else{
                upData["container40"]="0";
                upData["container20"]="0";
                upData["lclcargo"]="1";
            }
            const monValue = upData["date"].substring(5,7)+"월";
            const refValue = "DeptName/"+deptName+"/InCargo/"+monValue+"/"+upData["date"]+"/"+aKeyValue;
            if(upData["incargo"]==""){
                upData["incargo"]="0";
            }
            upData["keyValue"]=aKeyValue;
            upData["refValue"]=refValue;
            database_f.ref(refValue).update(upData).then(()=>{
                // const toast= document.createElement("div");
                // toast.setAttribute("id","tost_message");
                // toast.innerHTML=aKeyValue+"값이 DataBase에 Upload 되었습니다.";
                // document.body.appendChild(toast);
                // toast.classList.add("show");
                // setTimeout(function(){
                //     toast.className=toast.className.replace("show","");
                //     document.body.removeChild(toast);
                // },3000)
                location.reload();
                // location.reload();
                // alert(aKeyValue+"\n값이 DataBase에 Upload 되었습니다.");
            }).catch((e)=>{
                console.error(e);
            });
        }
    }
    function infoDel(){
        let delCheck = confirm(bKeyValue+"\nKey 값을 Database에서 Delete 하시겠습니까?");
        const dateValue= bKeyValue.substring(0,10);
        const monthValue = dateValue.substring(5,7)+"월";
        if(delCheck){
            database_f.ref("DeptName/"+deptName+"/InCargo/"+monthValue+"/"+dateValue+"/"+bKeyValue).remove().then(()=>{
                alert(bKeyValue+"\nKey 값이 Database에서 Delete 되었습니다.");
                location.reload();
            }).catch((e)=>{
                console.error(e);
            });
        }
    }
    function periodBtn(){
        const periodDiv = document.getElementById("periodPop");
        const styleP= periodDiv.style.display;
        if(styleP=="grid"){
            periodDiv.style.display="none";}
            else{
                periodDiv.style.display="grid";
                periodDiv.style.gridTemplateRows="1fr 1fr 1fr";
                periodDiv.style.position="fixed";
                periodDiv.style.top="30%";
                periodDiv.style.left="50%";
                periodDiv.style.transform="translate(-50%,-50%)";
                periodDiv.style.backgroundColor="white";
                periodDiv.style.border="2px solid black";
                periodDiv.style.borderRadius="10px";
                periodDiv.style.gridGap="10px";
            }
        document.getElementById("periodS").value=transDate(new Date());
        document.getElementById("periodE").value=transDate(new Date());

    }
    let period;
    function periodCheck(v){
        const bId=v.id;
        let startDate;
        let endDate;
        //function  thisweek, lastweek, thismonth, lastmonth, thisyear
        if(bId=="thisM"){
            startDate = new Date(new Date().getFullYear(),new Date().getMonth(),1);
            endDate = new Date(new Date().getFullYear(),new Date().getMonth()+1,0);}
        else if(bId=="lastM"){
            startDate = new Date(new Date().getFullYear(),new Date().getMonth()-1,1);
            endDate = new Date(new Date().getFullYear(),new Date().getMonth(),0);}
            else if(bId=="thisY"){
                startDate = new Date(new Date().getFullYear(),0,1);
                endDate = new Date(new Date().getFullYear(),11,31);}
                else if(bId=="thisW"){
                    startDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-new Date().getDay());
                    endDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-new Date().getDay()+6);}
                    else if(bId=="lastW"){
                        startDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-new Date().getDay()-7);
                        endDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-new Date().getDay()-1);}
                        else if(bId=="nextW"){
                            startDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-new Date().getDay()+7);
                            endDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-new Date().getDay()+13);}
                            document.getElementById("periodS").value=transDate(startDate);
                            document.getElementById("periodE").value=transDate(endDate);
       
    }
    
    function periodSearch(v){
        let startDate;
        let endDate;
        console.log(periodMsg)
        periodMsg=[];
        if(v==undefined){
            startDate = document.getElementById("periodS").value;
            endDate = document.getElementById("periodE").value;
            document.getElementById("datePicker").value="";
        }else{
            startDate = v;
            endDate = v;
        }
        const monSvalue = startDate.substring(5,7);
        const monEvalue = endDate.substring(5,7);
        const tabDiv = document.getElementById("tabI");
        let tabTable;
        let tabBody;
        if(tabDiv.style.display !="none"){
            tabTable = document.getElementById("tableS");
            tabBody = document.getElementById("tbiS");
        }else{
            tabTable = document.getElementById("tableSo");
            tabBody = document.getElementById("tboS");
        }
        
        tabBody.replaceChildren();
        let vList;
        let refValue;
            if(tabDiv.style.display !="none"){
                vList = key_f;
                refValue = "DeptName/"+deptName+"/InCargo/"
              }else{
                vList = ["date","consigneeName","outwarehouse","totalEa","totalQty","eaQty","pltQty","managementNo","description"];
                refValue = "DeptName/"+deptName+"/OutCargo/"
            }
        for(let m=monSvalue;m<=monEvalue;m++){
            if(m<10){
                if(typeof(m)=="number"){
                    m="0"+m;
                }
            }
           
            database_f.ref(refValue+m+"월/").get().then((snapshot)=>{
            let snapV = snapshot.val();
            console.log(snapV);
            for(let kc in snapV){
                if(kc>=startDate && kc<=endDate){
                    for(let key in snapV[kc]){
                        if(!periodMsg.includes(kc)){
                            periodMsg.push(kc);
                        }
                        let trS = document.createElement("tr");
                        for(let tdC=0;tdC<vList.length;tdC++){
                                let td = document.createElement("td");
                                td.innerHTML= snapV[kc][key][vList[tdC]];
                                trS.appendChild(td);
                                if(tdC>9){
                                    td.style.display="none";
                                }
                            }
                            tabBody.appendChild(trS);  
                            if(snapV[kc][key]["working"]!=""){
                                trS.style.backgroundColor="steelblue";}
                                const trContainer = tabBody.querySelectorAll("tr");
                                trContainer.forEach((trS)=>{trS.addEventListener("click",function(e){
                                    const rowIndex = e.target.parentNode.rowIndex;
                                    const tabInDiv = document.getElementById("tabInDiv");
                                    const tabInDivCheck =tabInDiv.style.display;
                                        incargoUpdate(trContainer[rowIndex-1]);
                            
                                }
                                )});
                    }
                }
            }
            
            tabTable.appendChild(tabBody);
        });
    }
        document.getElementById("periodPop").style.display="none";
       
    }
    let upfileList ={};
    const fileInput = document.getElementById("fileUp");
    const fileTr = document.getElementById("previewTr");
    // fileInput.addEventListener("change",selectFile);
    const resizeImage = (settings) => {
        const file = settings.file;
        const maxSize = settings.maxSize;
        const reader = new FileReader();
        const image = new Image();
        const canvas = document.createElement("canvas");
      
        const dataURItoBlob = (dataURI) => {
          const bytes =
            dataURI.split(",")[0].indexOf("base64") >= 0
              ? atob(dataURI.split(",")[1])
              : unescape(dataURI.split(",")[1]);
          const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
          const max = bytes.length;
          const ia = new Uint8Array(max);
          for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
          return new Blob([ia], { type: mime });
        };
      
        const resize = () => {
          let width = image.width;
          let height = image.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(image, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg");
          return dataURItoBlob(dataUrl);
        };
      
        return new Promise((ok, no) => {
          if (!file) {
            return;
          }
          if (!file.type.match(/image.*/)) {
            no(new Error("Not an image"));
            return;
          }
          reader.onload = (readerEvent) => {
            image.onload = () => {
              return ok(resize());
            };
            image.src = readerEvent.target.result;
          };
          reader.readAsDataURL(file);
        });
      };
      const handleImgInput = (e) => {
        upfileList = e.target.files;
        for(let i=0;i<e.target.files.length;i++){
        console.log(e.target.files[i]);     
        const config = {
          file: e.target.files[i],
          maxSize: 150,
        };
        const imgTag = document.createElement("td");
        resizeImage(config)
          .then((resizedImage) => {
            const url = window.URL.createObjectURL(resizedImage);
            const img = document.createElement("img");
            img.setAttribute("src", url);
            img.className = "profile-img";
            img.style.display = "block";
            imgTag.appendChild(img);
            fileTr.appendChild(imgTag);
          })
          .then(() => {
            const img = document.querySelector(".profile-img");
            img.onload = () => {
              const widthDiff = (img.clientWidth - imgTag.offsetWidth) / 2;
              const heightDiff = (img.clientHeight - imgTag.offsetHeight) / 2;
              img.style.transform = `translate( -${widthDiff}px , -${heightDiff}px)`;
            };
          })
          .catch((err) => {
            console.log(err);
          });
        }
      };
    fileInput.addEventListener("change",handleImgInput);
    
    // function selectFile(e){
    //     upfileList = e.target.files;
    //     console.log(upfileList,"selectFile");
    //     for(let i=0;i<upfileList.length;i++){
    //         const reader = new FileReader();
    //         const fileTd = document.createElement("td");
    //         const fileIdDiv = document.createElement("div");
    //         const fileImg = document.createElement("img");
    //         const fileName = document.createElement("p");
    //         reader.onload = function(e){
    //         const dataURL = e.target.result;
    //         console.log(dataURL.size);
    //         const img = new Image();
    //         img.onload = function(){
    //             const canvas = document.createElement("canvas");
    //             const ctx = canvas.getContext("2d");
    //             canvas.width = 10;
    //             canvas.height = 10;
    //             ctx.drawImage(img,0,0,canvas.wigth,canvas.height);
    //             const data = canvas.toDataURL("image/jpeg");
    //             const dataURItoBlob = (dataURI) => {
    //                 const bytes =
    //                   dataURI.split(",")[0].indexOf("base64") >= 0
    //                     ? atob(dataURI.split(",")[1])
    //                     : unescape(dataURI.split(",")[1]);
    //                 const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
    //                 const max = bytes.length;
    //                 const ia = new Uint8Array(max);
    //                 for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
    //                 return new Blob([ia], { type: mime });
    //               };
    //             const dataRe = dataURItoBlob(data); 
    //             fileImg.src = dataRe;
    //         };
    //         img.src = dataURL;
    //         const inputList = document.querySelectorAll(".infoInput");
    //         const fileInputName = inputList[1].value+"_"+inputList[3].value+"("+i+")";
    //         const tabInDiv = document.getElementById("tabO").display;
    //         if(tabInDiv!="grid"){
    //             ioValue="InCargo";
    //         }else{
    //             ioValue="OutCargo";
    //         }
    //         upRef ="images/"+deptName+"/"+inputList[0].value+"/"+ioValue+"/"+inputList[0].value+"_"+inputList[4].value+"_"+inputList[6].value+"_"+inputList[1].value;
    //         console.log()
    //         fileName.innerHTML= fileInputName;
    //         // fileImg.src = dataURL;
    //         fileImg.style.width="10vh";
    //         fileImg.style.height="10vh";
    //         fileIdDiv.appendChild(fileImg);
    //         fileIdDiv.appendChild(fileName);
    //         fileTd.appendChild(fileIdDiv);
    //         let list = Array.from(upfileList);
    //         fileImg.addEventListener("click",function(e){
    //             const removeDiv = e.target.parentNode;
    //             removeDiv.parentNode.removeChild(removeDiv);
    //             list.splice(i,1);
    //             upfileList = list;
    //         });
    //     };
    //     reader.readAsDataURL(upfileList[i]);
    //     fileTr.appendChild(fileTd);
    //     }
    // }
    
    function fileUp(){
        const inputList = document.querySelectorAll(".infoInput");
        const tabInDiv = document.getElementById("tabO").display;
        if(tabInDiv!="grid"){
                        ioValue="InCargo";
                    }else{
                        ioValue="OutCargo";
                    }
                    
        const today = new Date();
        const monthValue = today.getMonth()+1;
        const dateValue= bKeyValue.substring(0,10);
        let month;
        if(monthValue<10){
            month="0"+monthValue;
        }else{
            month=monthValue;}
        const refValue = "DeptName/"+deptName+"/"+ioValue+"/"+month+"월/"+dateValue+"/"+bKeyValue;
        const timeValue=today.getFullYear()+"년"+monthValue+"월"+today.getDate()+"일"+today.getHours()+"시"+today.getMinutes()+"분"+today.getSeconds()+"초";
        const workMsgRef = "DeptName/"+deptName+"/WorkingMessage/"+inputList[0].value+"/web_"+timeValue;
        const workObj={"consignee":inputList[3].value,"msg":inputList[3].value+"_"+inputList[1].value+"_사진업로드","inOutCargo":ioValue,"date":inputList[0].value,"keyValue":inputList[0].value+"_"+inputList[4].value+"_"+inputList[6].value+"_"+inputList[1].value,"nickName":"web","time":timeValue};
        const upRef ="images/"+deptName+"/"+inputList[0].value+"/"+ioValue+"/"+inputList[0].value+"_"+inputList[4].value+"_"+inputList[6].value+"_"+inputList[1].value;
        console.log(workMsgRef,workObj,upRef);
        database_f.ref(workMsgRef).update(workObj).then(()=>{
            console.log("Successfully uploaded");
        }).catch((e)=>{
            console.error(e);
        });
        const workingProcess={"working":"컨테이너 진입"};
        database_f.ref(refValue).update(workingProcess).then(()=>{
            console.log("Successfully uploaded");
        }).catch((e)=>{
            console.error(e);
        });
        for(let i=0;i<upfileList.length;i++){
            const file = upfileList[i];
            const ref = storage_f.ref(upRef+"/"+file.name);
            ref.put(file).then(()=>{
                console.log(file+"Successfully uploaded");
            }).catch((e)=>{
                alert(e);
            });
        }
    }
    


        
       