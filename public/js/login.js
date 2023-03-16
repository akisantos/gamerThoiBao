$("#inputIdUsrname").keyup(checkInputValid)
$("#inputIdPassword").keyup(checkInputValid)


function checkInputValid(){
    if ($("#inputIdUsrname").val() && $("#inputIdPassword").val() ){
        $(".submitButton").removeClass("submitButtonDisabled");
    }else{
        $(".submitButton").addClass("submitButtonDisabled");
    }
}

const isEmpty = str => !str.trim().length;


async function sendRefreshToken(){
    try{
        const response = await fetch('http://localhost:6969/refresh',{
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        });

        if (!response.ok){
            if (response.status === 401){
                return alert('Không tồn tại tài khoản');

            }
            throw new Error(`${response.status} ${response.statusText}`);
        }

        return await response.json();
    }catch (err){
        console.log(err);

    }
}

const sendLogin = async () =>{
    const user = $('#inputIdUsrname').val();
    const pwd = $('#inputIdPassword').val();

    try{
        const response = await fetch('http://localhost:6969/auth',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({user,pwd})
        });

        if (!response.ok){
            if (response.status === 401){
                return await sendRefreshToken();

            }
            throw new Error(`${response.status} ${response.statusText}`);
        }

        return await response.json();
    }catch (err){
        console.log(err);

    }
}


$(".submitButton").click(()=>{
    if (!isEmpty($("#inputIdUsrname").val()) && !isEmpty($("#inputIdPassword").val())){
        sendLogin().then(()=>{
            alert("Đăng nhập thành công!");
            // window.location.href = 'http://localhost:6969/'
        }, ()=>{
            alert('Có lỗi xảy ra')
        })
    }
})
