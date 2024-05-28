const usersButton = document.querySelector('#users');
if (usersButton) {
    usersButton.addEventListener('click', e => {
        window.location = '/admin/users';
    });
}

const backButton = document.querySelector('#page');
if (backButton) {
    backButton.addEventListener('click', e => {
        window.location = '/admin/page';
    })
}

const userSelect = document.querySelector('#userSelect');
const roleSelect = document.querySelector('#role');
if (userSelect) {
    userSelect.addEventListener('change', async e => {
        const id = userSelect.value;
        const options = await getFetch('/roles');
        const response = await fetch('/user/update/' + id);
        const data = await response.json();
        if (data.status === 'success') {
            const message = data.message;
            const userForm = document.querySelector('#userForm');
            const deleteButton = document.querySelector('#delete');
            userForm.classList.remove('d-none');
            userForm.elements['id'].value = message.id;
            userForm.elements['email'].value = message.email;
            userForm.elements['username'].value = message.username;
            userForm.elements['password'].value = message.password;
            options.message.forEach(element => {
                const newOption = new Option(element.role_name, element.role_id);
                roleSelect.append(newOption);
            });
            roleSelect.value = message.role_id;
            console.log(message.role_id);

            userForm.addEventListener('submit', async e => {
                e.preventDefault();
                const elements = {
                    username: userForm.elements['username'].value,
                    email: userForm.elements['email'].value,
                    password: userForm.elements['password'].value,
                    id: userForm.elements['id'].value,
                };
                const data = await postFetch('/user/update/' + id, elements);
                console.log(data);
            });
            deleteButton.addEventListener('click', async e => {
                const userResponse = confirm('Вы уверены, что хотите удалить пользователя?');
                if (userResponse) {
                    const data = await getFetch(`/user/delete/` + id);
                    console.log(data);
                    if (data.message) {
                        alert('Пользователь удален');
                        location.reload();
                    }
                    else {
                        alert('Возникла ошибка');
                    }
                }
            })
        }
    })
}