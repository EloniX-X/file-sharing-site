

document.addEventListener('DOMContentLoaded', function () {
    var curlist = []
    var herefiles = {}
    var mynum = null;
    const formData = new FormData();
    const fileInput = document.getElementById('dropzone-file');
    function toggleVisibility() {
        if (document.getElementById("togglebox").checked) {
            document.getElementById("getfrom").classList.remove("invisible");
            document.getElementById("postto").classList.add("invisible");
        } else {
            document.getElementById("postto").classList.remove("invisible");
            document.getElementById("getfrom").classList.add("invisible");
        }
    }
    
    document.getElementById("togglebox").addEventListener("change", toggleVisibility);
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0]; 
        if (!file) {
            return; 
        }
        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append('files', fileInput.files[i]);
        }
    
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log(curlist);
            if (!curlist.includes(file.name)) {
                document.getElementById("filenamehere").innerHTML += `<p>${file.name}</p>`;
                curlist.push(file.name);
            }
        };
        
        reader.readAsText(file);
    });
        
    document.getElementById('delbtn').addEventListener('click', function() {
        console.log(mynum);
        fetch('http://localhost:3000/del', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify({ mynum}),
        })
        .then(response => response.text())
        .then(data => {
            console.log(data)
            location.reload();
        })
        .catch((error) => {
            console.error(error);
        })
    });
    function trigdl(url) {
        const anchorElement = document.createElement('a');
        anchorElement.href = url;
        document.body.appendChild(anchorElement); 
        anchorElement.click();
        document.body.removeChild(anchorElement); 
    }
    


    document.getElementById('clicky').addEventListener('click', function() {
        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text()) 
        .then(data => {
            console.log('Success:', data);
            document.getElementById("heyContainer").classList.remove("invisible");
            document.getElementById("heretext").innerText = data;
            mynum = data;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
    var gobtn = document.getElementById('goget');

    function focusNextInput(el, prevId, nextId) {
        if (el.value.length === 0) {
            if (prevId) {
                document.getElementById(prevId).focus();
                if (!gobtn.hasAttribute('disabled')) {
                    gobtn.setAttribute('disabled', '');
                    gobtn.classList.add('cursor-not-allowed');
                    gobtn.classList.add('bg-gray-500');
                    gobtn.classList.remove('bg-blue-500');
    
                }
            }
        } else {
            if (nextId) {
                document.getElementById(nextId).focus();
            }
        }
    }

    document.querySelectorAll('[data-focus-input-init]').forEach(function(element) {
        element.addEventListener('keyup', function() {
            const prevId = this.getAttribute('data-focus-input-prev');
            const nextId = this.getAttribute('data-focus-input-next');
            if (nextId == null) {
                this.blur();
                gobtn.removeAttribute('disabled');
                gobtn.classList.remove('cursor-not-allowed');
                gobtn.classList.remove('bg-gray-500');
                gobtn.classList.add('bg-blue-500');
            }
            focusNextInput(this, prevId, nextId);
        });
    });
    gobtn.addEventListener('click', function () {
        console.log("get getting");
        let numbers = "";
        document.querySelectorAll('[data-focus-input-init]').forEach(function(element) {
            numbers += String(element.value);
        });
        //bg-blue-500
        console.log(numbers);
        var fhrealol = document.getElementById('fileshere');

        fetch('http://localhost:3000/getheart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },

            body: JSON.stringify({ numbers })
        })
        .then(response => response.json())
        
        .then(data => {
            console.log("back");
            fhrealol.innerHTML = " ";

            console.log(data);
            if (data.files && data.files.length > 0) {
                data.files.forEach((file) => {
                    const fileem = document.createElement('p')
                    const dlbtn = document.createElement('a')
                    fileem.textContent = file;
                    dlbtn.textContent = 'download';
                    let filename = numbers + '/' + file;
                    dlbtn.href = `http://localhost:3000/download/${encodeURIComponent(filename)}`;
                    dlbtn.setAttribute('download', '');
                    // dlbtn.addEventListener('click', function() {
                    //     trigdl(url) ;

                    // })
                    dlbtn.classList.add('bg-gray-500', 'rounded', 'p-1');
                    fhrealol.appendChild(fileem)
                    fhrealol.appendChild(dlbtn)
                    console.log('added');
                
                    });
            }
                
        })
        .catch((error) => {console.error(error);})
    })

});