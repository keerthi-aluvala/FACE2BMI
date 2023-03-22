const form = document.querySelector("#form");
const fileInput = form.querySelector("#file-input");
const progressArea = document.querySelector(".progress-area");
const uploadedArea = document.querySelector(".uploaded-area");

form.onclick = (e => {
    fileInput.click();
})

fileInput.onchange = ({target}) =>{
    //console.log(target.files);
    let file = target.files[0];
    let fileName = file.name;
    console.log(fileName);
    //AJAX post request to the server
    let xhr = new XMLHttpRequest();
    xhr.open('POST','/Uploads',true);

    //progress function
    xhr.upload.onprogress = ({loaded,total}) =>{
        console.log(loaded,total);

        //converting bytes to KB
        loadedKB = Math.floor(loaded/1000);
        totalKB = Math.floor(total/1000);
        console.log(loadedKB, totalKB);

        percent = Math.floor(loadedKB/totalKB * 100);

        progressArea.innerHTML = `
                <li class="row">
                <span class="las la-file-alt"></span>
                <div class="content">
                    <div class="details">
                        <span class="name">${fileName}</span>
                        <span class="percent">${percent}%</span>
                    </div>
                    <div style = "width : ${percent}%"class="progress-bar">
                        <div class="progress"></div>
                    </div>
                </div>
                </li>`;
    }
    //server response
    xhr.onload = e =>{
        const{err} = JSON.parse(xhr.response);
        console.log(loadedKB,totalKB);
        if(err){
            console.log(err);
            return;
        }
        if(loadedKB==totalKB){
            //progressArea.innerHTML = ``;
            //console.log(loadedKB,totalKB);

            let uploadedContent = `
                    <li class="row">
                        <div class="content">
                            <span class="las la-file-alt"></span>
                            <div class="details">
                                <span class="name">${fileName}uploaded</span>
                                <span class="size">${totalKB}KB</span>
                            </div> 
                        </div>
                        <span class="las la-check"></span>
                    </li>`;
            uploadedArea.insertAdjacentHTML('afterbegin',uploadedContent);
        }
    }

    let formData = new FormData(form);
    xhr.send(formData);
}